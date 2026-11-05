import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { once } from "node:events";

// Runs the production Next.js server against an isolated in-memory Supabase
// HTTP double. No production credentials, database or uploads are used.
test("production routes and admin publishing workflow", { timeout: 120000 }, async t => {
  const tables = Object.fromEntries(["campaigns", "verification_records", "admin_sessions", "site_settings", "case_studies", "open_roles", "project_inquiries", "career_applications"].map(name => [name, []]));
  let failBackend = false;
  const db = createServer(async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (failBackend) { res.writeHead(500); res.end(JSON.stringify({ secret: "PRIVATE_BACKEND_DETAIL" })); return; }
    const url = new URL(req.url, "http://localhost");
    const chunks = []; for await (const chunk of req) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);
    if (url.pathname.startsWith("/storage/v1/object/")) { res.end(JSON.stringify({ Key: url.pathname })); return; }
    const body = buffer.length ? JSON.parse(buffer.toString()) : {};
    if (url.pathname === "/rest/v1/rpc/verify_admin_login") {
      res.end(JSON.stringify(body.admin_email === "qa@example.test" && body.admin_password === "TestPassword123!" ? [{ email: body.admin_email, name: "Test Admin" }] : [])); return;
    }
    const table = url.pathname.replace("/rest/v1/", "");
    if (!tables[table]) { res.writeHead(404); res.end("{}"); return; }
    const matches = row => [...url.searchParams].every(([key, filter]) => {
      if (["select", "order", "limit", "on_conflict"].includes(key)) return true;
      if (filter.startsWith("eq.")) return String(row[key]) === filter.slice(3);
      if (filter.startsWith("lt.")) return row[key] < filter.slice(3);
      return false;
    });
    let result = tables[table].filter(matches);
    if (req.method === "POST") {
      if (table === "site_settings") {
        assert.equal(url.searchParams.get("on_conflict"), "setting_key", "settings must upsert on the unique setting key");
        const existing = tables[table].find(row => row.setting_key === body.setting_key);
        if (existing) { Object.assign(existing, body); result = [existing]; }
        else { result = [{ id: randomUUID(), ...body }]; tables[table].push(...result); }
      } else {
        result = [{ id: randomUUID(), created_at: new Date().toISOString(), ...body }]; tables[table].push(...result);
      }
    }
    if (req.method === "PATCH") result.forEach(row => Object.assign(row, body));
    if (req.method === "DELETE") { tables[table] = tables[table].filter(row => !matches(row)); res.writeHead(204); res.end(); return; }
    const limit = Number(url.searchParams.get("limit")); if (limit) result = result.slice(0, limit);
    const select = url.searchParams.get("select");
    if (select && select !== "*") result = result.map(row => Object.fromEntries(select.split(",").map(key => [key, row[key]])));
    res.end(JSON.stringify(result));
  });
  db.listen(0, "127.0.0.1"); await once(db, "listening");
  const spare = createServer(); spare.listen(0, "127.0.0.1"); await once(spare, "listening");
  const port = spare.address().port; await new Promise(resolve => spare.close(resolve));
  const base = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    env: { ...process.env, NODE_ENV: "production", SUPABASE_URL: `http://127.0.0.1:${db.address().port}`, SUPABASE_SERVICE_ROLE_KEY: "isolated-test-key" },
    stdio: ["ignore", "pipe", "pipe"]
  });
  let logs = ""; child.stdout.on("data", data => logs += data); child.stderr.on("data", data => logs += data);
  t.after(async () => { child.kill(); if (child.exitCode === null) await once(child, "exit"); db.closeAllConnections(); await new Promise(resolve => db.close(resolve)); });
  for (let attempt = 0; attempt < 100; attempt++) {
    try { if ((await fetch(`${base}/verify`)).ok) break; } catch { /* Wait for Next.js. */ }
    if (child.exitCode !== null || attempt === 99) throw new Error(`Next.js did not start: ${logs}`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  let cookie = "";
  async function call(path, method = "GET", body, headers = {}) {
    const response = await fetch(`${base}${path}`, { method, headers: { ...(cookie ? { Cookie: cookie } : {}), ...(body !== undefined ? { "Content-Type": "application/json" } : {}), ...headers }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
    return { response, payload: await response.json() };
  }
  await t.test("admin auth rejects anonymous, invalid and malformed sessions", async () => {
    assert.equal((await call("/api/admin/overview")).response.status, 401);
    assert.equal((await call("/api/admin/campaigns", "POST", {})).response.status, 401);
    assert.equal((await call("/api/admin/overview", "GET", undefined, { Cookie: "nebulint_admin_session=%ZZ" })).response.status, 401);
    assert.equal((await call("/api/admin/login", "POST", { email: "qa@example.test", password: "wrong" })).response.status, 401);
    const login = await call("/api/admin/login", "POST", { email: "qa@example.test", password: "TestPassword123!" });
    assert.equal(login.response.status, 200); assert.match(login.response.headers.get("set-cookie"), /HttpOnly.*SameSite=Lax.*Secure/);
    cookie = login.response.headers.get("set-cookie").split(";")[0];
    assert.equal((await call("/api/admin/overview")).response.status, 200);
    assert.equal((await call("/api/admin/campaigns", "POST", {}, { Origin: "https://untrusted.example" })).response.status, 403);
  });
  let campaignId;
  await t.test("campaign create, schedule, homepage, detail, edit and hide", async () => {
    const draft = { title: "QA robotics campaign", summary: "Build with us", details: "Full campaign details\nSecond paragraph", is_active: true };
    assert.equal((await call("/api/admin/campaigns", "POST", { ...draft, cta_url: "javascript:alert(1)" })).response.status, 400);
    assert.equal((await call("/api/admin/campaigns", "POST", { ...draft, start_date: "2026-13-01" })).response.status, 400);
    assert.equal((await call("/api/admin/campaigns", "POST", { ...draft, start_date: "2026-02-30" })).response.status, 400);
    assert.equal((await call("/api/admin/campaigns", "POST", { ...draft, start_date: "2026-03-01", end_date: "2026-02-01" })).response.status, 400);
    const created = await call("/api/admin/campaigns", "POST", draft); assert.equal(created.response.status, 201);
    campaignId = created.payload.rows[0].id;
    assert.match(await (await fetch(base)).text(), /QA robotics campaign/);
    assert.match(await (await fetch(`${base}/campaigns/${campaignId}`)).text(), /Full campaign details/);
    assert.equal((await call(`/api/admin/campaigns/${campaignId}`, "PATCH", { title: "Updated robotics campaign" })).response.status, 200);
    assert.match(await (await fetch(`${base}/campaigns`)).text(), /Updated robotics campaign/);
    await call(`/api/admin/campaigns/${campaignId}`, "PATCH", { start_date: "2099-01-01" });
    assert.equal((await fetch(`${base}/campaigns/${campaignId}`)).status, 404);
    await call(`/api/admin/campaigns/${campaignId}`, "PATCH", { start_date: "2000-01-01", end_date: "2001-01-01" });
    assert.doesNotMatch(await (await fetch(base)).text(), /Updated robotics campaign/);
    await call(`/api/admin/campaigns/${campaignId}`, "PATCH", { start_date: null, end_date: null, is_active: false });
    assert.equal((await fetch(`${base}/campaigns/${campaignId}`)).status, 404);
  });
  await t.test("verification lookup preserves privacy, status and revocation", async () => {
    const record = { verification_code: "NEB-QA-2026-A1", full_name: "Example Intern", record_type: "internship", role: "Robotics Intern", start_date: "2026-01-01", end_date: "2026-03-31", status: "completed", is_public: false };
    const created = await call("/api/admin/verifications", "POST", record); assert.equal(created.response.status, 201);
    const id = created.payload.rows[0].id;
    assert.equal((await call("/api/verify", "POST", { code: record.verification_code })).payload.record, null);
    await call(`/api/admin/verifications/${id}`, "PATCH", { is_public: true });
    const found = await call("/api/verify", "POST", { code: record.verification_code.toLowerCase() });
    assert.equal(found.payload.record.full_name, record.full_name); assert.equal(found.payload.record.status, "completed");
    assert.equal(found.payload.record.id, undefined); assert.equal(found.payload.record.is_public, undefined);
    assert.equal(found.response.headers.get("cache-control"), "no-store");
    await call(`/api/admin/verifications/${id}`, "PATCH", { status: "revoked" });
    assert.equal((await call("/api/verify", "POST", { code: record.verification_code })).payload.record.status, "revoked");
    assert.equal((await call("/api/verify", "POST", { code: "UNKNOWN-2026" })).payload.record, null);
    assert.equal((await call("/api/verify", "POST", { code: "*" })).response.status, 400);
    await call(`/api/admin/verifications/${id}`, "DELETE");
    assert.equal((await call("/api/verify", "POST", { code: record.verification_code })).payload.record, null);
  });
  await t.test("image uploads require admin and reject disguised/oversized files", async () => {
    async function upload(file, auth = true) {
      const form = new FormData(); form.set("file", file);
      return fetch(`${base}/api/admin/uploads`, { method: "POST", headers: auth ? { Cookie: cookie } : {}, body: form });
    }
    const png = new File([Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZQmcAAAAASUVORK5CYII=", "base64")], "test.png", { type: "image/png" });
    assert.equal((await upload(png, false)).status, 401);
    assert.equal((await upload(new File(["<svg></svg>"], "fake.png", { type: "image/png" }))).status, 400);
    assert.equal((await upload(new File([new Uint8Array(3 * 1024 * 1024 + 1)], "large.png", { type: "image/png" }))).status, 400);
    const uploaded = await upload(png); assert.equal(uploaded.status, 201);
    const { url } = await uploaded.json(); assert.match(url, /\/storage\/v1\/object\/public\/site-media\/images\/.*\.png$/);
    const work = await call("/api/admin/works", "POST", { title: "QA case study", summary: "Image test", image_url: url });
    assert.equal(work.response.status, 201); assert.match(await (await fetch(base)).text(), /site-media\/images/);
    await call(`/api/admin/works/${work.payload.rows[0].id}`, "PATCH", { is_active: false });
    const home = await (await fetch(base)).text();
    assert.doesNotMatch(home, /QA case study/); assert.doesNotMatch(home, /Autonomous Monitoring Platform/);
  });
  await t.test("settings upsert and public form validation", async () => {
    for (const title of ["First saved headline", "Updated saved headline"]) {
      assert.equal((await call("/api/admin/settings", "PUT", { key: "hero", value: { title, cta_url: "/campaigns" } })).response.status, 200);
    }
    assert.equal(tables.site_settings.length, 1);
    assert.match(await (await fetch(base)).text(), /Updated saved headline/);
    assert.equal((await call("/api/admin/settings", "PUT", { key: "hero", value: { cta_url: "javascript:alert(1)" } })).response.status, 400);
    assert.equal((await call("/api/admin/settings", "PUT", { key: "__proto__", value: {} })).response.status, 400);
    assert.equal((await call("/api/inquiries", "POST", { name: "Test", email: "bad", projectType: "AI", brief: "Hello" })).response.status, 400);
    assert.equal((await call("/api/inquiries", "POST", { name: "Test", email: "qa@example.test", projectType: "AI", brief: "Hello" })).response.status, 200);
    assert.equal((await call("/api/careers", "POST", { name: "Test", email: "qa@example.test", role: "Intern", statement: "Hello", portfolio: "javascript:alert(1)" })).response.status, 400);
    assert.equal((await call("/api/careers", "POST", { name: "Test", email: "qa@example.test", role: "Intern", statement: "Hello" })).response.status, 200);
  });
  await t.test("delete, backend failures, expiry and logout", async () => {
    assert.equal((await call(`/api/admin/campaigns/${campaignId}`, "DELETE")).response.status, 200);
    assert.equal((await call(`/api/admin/campaigns/${campaignId}`, "PATCH", { title: "Gone" })).response.status, 404);
    failBackend = true;
    const failed = await call("/api/verify", "POST", { code: "NEB-QA-2026-A1" });
    assert.equal(failed.response.status, 500); assert.doesNotMatch(JSON.stringify(failed.payload), /PRIVATE_BACKEND_DETAIL/);
    failBackend = false;
    tables.admin_sessions[0].expires_at = "2000-01-01T00:00:00Z";
    assert.equal((await call("/api/admin/overview")).response.status, 401);
    tables.admin_sessions[0].expires_at = "2099-01-01T00:00:00Z";
    assert.equal((await call("/api/admin/logout", "POST")).response.status, 200);
    assert.equal((await call("/api/admin/overview")).response.status, 401);
  });
});
