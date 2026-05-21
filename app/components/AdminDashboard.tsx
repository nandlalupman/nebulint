"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness, Edit3, Eye, EyeOff,
  FileText, Inbox, LayoutDashboard, Loader2, Lock, LogIn, LogOut,
  Plus, RefreshCcw, Search, Settings, Trash2, Users, X
} from "lucide-react";

type Inquiry = { id: string; name: string; email: string; company?: string | null; project_type: string; timeline?: string | null; environment?: string | null; brief: string; status: string; created_at: string };
type Application = { id: string; name: string; email: string; role: string; portfolio?: string | null; statement: string; status: string; created_at: string };
type Role = { id: string; title: string; summary?: string | null; department?: string | null; location?: string | null; type?: string | null; sort_order?: number | null; is_active?: boolean | null };
type Work = { id: string; title: string; summary: string; category?: string | null; image_url?: string | null; sort_order?: number | null; is_active?: boolean | null };
type SettingRow = { setting_key: string; setting_value: Record<string, unknown> };
type Overview = { inquiries: Inquiry[]; applications: Application[]; roles: Role[]; works: Work[]; settings?: SettingRow[] };
type Tab = "overview" | "inquiries" | "applications" | "roles" | "works" | "settings";

const statusOptions = ["new", "reviewing", "qualified", "contacted", "closed"];
const emptyRole = { title: "", summary: "", department: "", location: "Remote / Hybrid", type: "Engineering", sort_order: 100 };
const emptyWork = { title: "", summary: "", category: "", image_url: "", sort_order: 100 };

function statusClass(s: string) { return `admin-status ${s.toLowerCase().replace(/\s+/g, "-")}`; }
function includesQuery(vals: Array<string | null | undefined>, q: string) { if (!q) return true; const n = q.toLowerCase(); return vals.some(v => (v || "").toLowerCase().includes(n)); }
function formatDate(v?: string) { if (!v) return "Recently"; return new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(v)); }

function ConfirmDialog({ title, message, onConfirm, onCancel }: { title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="admin-confirm-overlay" onClick={onCancel}>
      <div className="admin-confirm-dialog" onClick={e => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="admin-confirm-actions">
          <button className="admin-cancel-btn" onClick={onCancel}>Cancel</button>
          <button className="admin-delete-btn" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [data, setData] = useState<Overview | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [roleForm, setRoleForm] = useState(emptyRole);
  const [workForm, setWorkForm] = useState(emptyWork);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string | number>>({});
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string; endpoint: string } | null>(null);
  const [settingsData, setSettingsData] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => { void load(); }, []);

  useEffect(() => {
    if (data?.settings) {
      const map: Record<string, Record<string, string>> = {};
      for (const s of data.settings) {
        const obj: Record<string, string> = {};
        for (const [k, v] of Object.entries(s.setting_value)) obj[k] = String(v ?? "");
        map[s.setting_key] = obj;
      }
      setSettingsData(map);
    }
  }, [data?.settings]);

  const metrics = useMemo(() => {
    const inq = data?.inquiries || [], app = data?.applications || [], rol = data?.roles || [], wrk = data?.works || [];
    return [
      { label: "Client inquiries", value: inq.length, detail: `${inq.filter(i => i.status === "new").length} new`, icon: Inbox },
      { label: "Career profiles", value: app.length, detail: `${app.filter(i => i.status === "reviewing").length} reviewing`, icon: Users },
      { label: "Published roles", value: rol.filter(i => i.is_active).length, detail: `${rol.length} total`, icon: BriefcaseBusiness },
      { label: "Live work items", value: wrk.filter(i => i.is_active).length, detail: `${wrk.length} case studies`, icon: FileText }
    ];
  }, [data]);

  const filteredInquiries = useMemo(() => (data?.inquiries || []).filter(i => includesQuery([i.name, i.company, i.email, i.project_type, i.brief], query)), [data, query]);
  const filteredApplications = useMemo(() => (data?.applications || []).filter(i => includesQuery([i.name, i.email, i.role, i.statement, i.portfolio], query)), [data, query]);
  const filteredRoles = useMemo(() => (data?.roles || []).filter(i => includesQuery([i.title, i.summary, i.department, i.location, i.type], query)), [data, query]);
  const filteredWorks = useMemo(() => (data?.works || []).filter(i => includesQuery([i.title, i.summary, i.category, i.image_url], query)), [data, query]);

  async function load() {
    setLoading(true); setMessage("");
    try {
      const r = await fetch("/api/admin/overview", { cache: "no-store" });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Unable to load admin data.");
      setData(p.data);
    } catch (e) { setData(null); setMessage(e instanceof Error ? e.message : "Unable to load admin data."); }
    finally { setLoading(false); }
  }

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setMessage("");
    try {
      const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(credentials) });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Admin sign in failed.");
      setCredentials({ email: credentials.email, password: "" }); await load();
    } catch (e) { setData(null); setMessage(e instanceof Error ? e.message : "Admin sign in failed."); }
    finally { setLoading(false); }
  }

  async function logout() {
    try { await fetch("/api/admin/logout", { method: "POST" }); } catch { /* ignore */ }
    setData(null); setMessage(""); setTab("overview");
  }

  async function patch(path: string, body: Record<string, unknown>) {
    setLoading(true); setMessage("");
    try {
      const r = await fetch(path, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Update failed.");
      await load();
    } catch (e) { setMessage(e instanceof Error ? e.message : "Update failed."); }
    finally { setLoading(false); }
  }

  async function create(path: string, body: Record<string, unknown>, reset: () => void) {
    setLoading(true); setMessage("");
    try {
      const r = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Create failed.");
      reset(); await load();
    } catch (e) { setMessage(e instanceof Error ? e.message : "Create failed."); }
    finally { setLoading(false); }
  }

  async function deleteItem(endpoint: string) {
    setLoading(true); setMessage("");
    try {
      const r = await fetch(endpoint, { method: "DELETE" });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Delete failed.");
      await load();
    } catch (e) { setMessage(e instanceof Error ? e.message : "Delete failed."); }
    finally { setLoading(false); setDeleteTarget(null); }
  }

  function startEdit(id: string, fields: Record<string, string | number | null | undefined>) {
    const clean: Record<string, string | number> = {};
    for (const [k, v] of Object.entries(fields)) clean[k] = v ?? "";
    setEditingId(id); setEditForm(clean);
  }

  async function saveEdit(endpoint: string) {
    await patch(endpoint, editForm);
    setEditingId(null); setEditForm({});
  }

  async function saveSetting(key: string) {
    setLoading(true); setMessage("");
    try {
      const r = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, value: settingsData[key] }) });
      const p = await r.json();
      if (!r.ok) throw new Error(p?.message || "Save failed.");
      setMessage(""); await load();
    } catch (e) { setMessage(e instanceof Error ? e.message : "Save failed."); }
    finally { setLoading(false); }
  }

  if (!data) {
    return (
      <main className="admin-login-page">
        <section className="admin-login-shell">
          <div className="admin-login-copy">
            <span className="admin-kicker"><Lock size={15} /> Admin access</span>
            <h1>Sign in</h1>
            <p>Enter your admin email and password to continue.</p>
          </div>
          <form className="admin-login-card" onSubmit={submitLogin}>
            <div>
              <h2>Welcome back</h2>
              <p>Use your admin credentials to access the dashboard.</p>
            </div>
            <label>Email<input value={credentials.email} onChange={e => setCredentials({ ...credentials, email: e.target.value })} type="email" placeholder="Email address" required /></label>
            <label>Password<input value={credentials.password} onChange={e => setCredentials({ ...credentials, password: e.target.value })} type="password" placeholder="Password" required /></label>
            <button className="button primary" type="submit" disabled={loading}>{loading ? <Loader2 size={16} className="spin" /> : <LogIn size={16} />} Sign In</button>
            {message ? <p className="admin-message">{message}</p> : null}
          </form>
        </section>
      </main>
    );
  }

  const navItems: [Tab, string, typeof LayoutDashboard][] = [
    ["overview", "Overview", LayoutDashboard],
    ["inquiries", "Client Inquiries", Inbox],
    ["applications", "Career Forms", Users],
    ["roles", "Open Roles", BriefcaseBusiness],
    ["works", "Our Work", FileText],
    ["settings", "Site Settings", Settings]
  ];

  return (
    <main className="admin-shell">
      {deleteTarget && <ConfirmDialog title="Confirm Deletion" message={`Are you sure you want to permanently delete "${deleteTarget.label}"? This action cannot be undone.`} onConfirm={() => deleteItem(deleteTarget.endpoint)} onCancel={() => setDeleteTarget(null)} />}

      <aside className="admin-sidebar">
        <div className="admin-sidebar-head"><span>NEBULINT</span><strong>Admin OS</strong></div>
        <nav className="admin-side-nav" aria-label="Admin sections">
          {navItems.map(([id, label, Icon]) => (
            <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}><Icon size={17} /><span>{label}</span></button>
          ))}
        </nav>
        <button className="admin-logout-btn" onClick={logout}><LogOut size={16} /> Sign Out</button>
        <div className="admin-sidebar-status"><span>Environment</span><strong>Local / Supabase-ready</strong></div>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar">
          <div><span>Website Operations</span><h1>{tab === "overview" ? "Command Center" : tab === "settings" ? "Site Settings" : tab.replace("-", " ")}</h1></div>
          <div className="admin-topbar-actions">
            <label className="admin-search"><Search size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search records..." /></label>
            <button className="admin-icon-button" onClick={() => load()} disabled={loading} aria-label="Refresh">{loading ? <Loader2 size={17} className="spin" /> : <RefreshCcw size={17} />}</button>
          </div>
        </header>

        {message ? <p className="admin-message">{message}</p> : null}

        <section className="admin-kpi-grid">
          {metrics.map(({ label, value, detail, icon: Icon }) => (
            <article key={label} className="admin-kpi-card"><div><Icon size={18} /><span>{label}</span></div><strong>{value}</strong><small>{detail}</small></article>
          ))}
        </section>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <section className="admin-overview-grid">
            <article className="admin-system-card">
              <div className="admin-card-head"><span>Operational pipeline</span><strong>Active intake flow</strong></div>
              <div className="admin-flow">
                {["Inquiry", "Triage", "Engineering review", "Client response", "Delivery"].map((item, i) => (
                  <div key={item}><i>{String(i + 1).padStart(2, "0")}</i><span>{item}</span></div>
                ))}
              </div>
            </article>
            <article className="admin-system-card">
              <div className="admin-card-head"><span>Recent records</span><strong>Needs attention</strong></div>
              <div className="admin-mini-list">
                {[...data.inquiries.slice(0, 3), ...data.applications.slice(0, 3)].slice(0, 5).map(item => (
                  <div key={item.id}>
                    <span>{formatDate(item.created_at)}</span>
                    <strong>{"project_type" in item ? item.project_type : item.role}</strong>
                    <small>{item.name}</small>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}

        {/* INQUIRIES */}
        {tab === "inquiries" && (
          <section className="admin-table-panel">
            <div className="admin-table-head"><div><span>Records</span><h2>Client inquiry queue</h2></div><strong>{filteredInquiries.length}</strong></div>
            <div className="admin-table">
              {filteredInquiries.map(item => (
                <article className="admin-row" key={item.id}>
                  <div className="admin-row-main">
                    <span className={statusClass(item.status)}>{item.status}</span>
                    <h3>{item.company || item.name}</h3>
                    <p>{item.project_type} / {item.environment || "TBD"} / {item.timeline || "TBD"}</p>
                    <small>{item.name} / {item.email}</small>
                  </div>
                  <p className="admin-row-note">{item.brief}</p>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <select value={item.status} onChange={e => patch(`/api/admin/inquiries/${item.id}`, { status: e.target.value })}>
                      {statusOptions.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <button className="admin-content-item-actions" style={{ border: "1px solid var(--border)", background: "var(--field-bg)", color: "var(--text)", cursor: "pointer", minHeight: 36, minWidth: 36, display: "grid", placeItems: "center" }} onClick={() => setDeleteTarget({ id: item.id, label: item.company || item.name, endpoint: `/api/admin/inquiries/${item.id}` })}><Trash2 size={14} /></button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* APPLICATIONS */}
        {tab === "applications" && (
          <section className="admin-table-panel">
            <div className="admin-table-head"><div><span>Records</span><h2>Career application queue</h2></div><strong>{filteredApplications.length}</strong></div>
            <div className="admin-table">
              {filteredApplications.map(item => (
                <article className="admin-row" key={item.id}>
                  <div className="admin-row-main">
                    <span className={statusClass(item.status)}>{item.status}</span>
                    <h3>{item.name}</h3>
                    <p>{item.role}</p>
                    <small>{item.email}{item.portfolio ? ` / ${item.portfolio}` : ""}</small>
                  </div>
                  <p className="admin-row-note">{item.statement}</p>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <select value={item.status} onChange={e => patch(`/api/admin/applications/${item.id}`, { status: e.target.value })}>
                      {statusOptions.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <button style={{ border: "1px solid var(--border)", background: "var(--field-bg)", color: "var(--text)", cursor: "pointer", minHeight: 36, minWidth: 36, display: "grid", placeItems: "center" }} onClick={() => setDeleteTarget({ id: item.id, label: item.name, endpoint: `/api/admin/applications/${item.id}` })}><Trash2 size={14} /></button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ROLES */}
        {tab === "roles" && (
          <section className="admin-editor-layout">
            <form className="admin-form-card" onSubmit={e => { e.preventDefault(); void create("/api/admin/roles", roleForm, () => setRoleForm(emptyRole)); }}>
              <h2>Add open role</h2>
              <input placeholder="Title" value={roleForm.title} onChange={e => setRoleForm({ ...roleForm, title: e.target.value })} required />
              <textarea placeholder="Summary" value={roleForm.summary} onChange={e => setRoleForm({ ...roleForm, summary: e.target.value })} />
              <div className="admin-form-grid">
                <input placeholder="Department" value={roleForm.department} onChange={e => setRoleForm({ ...roleForm, department: e.target.value })} />
                <input placeholder="Location" value={roleForm.location} onChange={e => setRoleForm({ ...roleForm, location: e.target.value })} />
                <input placeholder="Type" value={roleForm.type} onChange={e => setRoleForm({ ...roleForm, type: e.target.value })} />
                <input type="number" placeholder="Order" value={roleForm.sort_order} onChange={e => setRoleForm({ ...roleForm, sort_order: Number(e.target.value) })} />
              </div>
              <button className="button primary" type="submit"><Plus size={16} /> Add Role</button>
            </form>
            <div className="admin-content-list">
              {filteredRoles.map(item => (
                <article className="admin-content-item" key={item.id}>
                  <div>
                    <span>{item.department || "Role"}</span>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                    <small>{item.location} · {item.type}</small>
                    {editingId === item.id && (
                      <div className="admin-inline-edit">
                        <input placeholder="Title" value={editForm.title ?? ""} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                        <textarea placeholder="Summary" value={editForm.summary ?? ""} onChange={e => setEditForm({ ...editForm, summary: e.target.value })} />
                        <div className="admin-form-grid">
                          <input placeholder="Department" value={editForm.department ?? ""} onChange={e => setEditForm({ ...editForm, department: e.target.value })} />
                          <input placeholder="Location" value={editForm.location ?? ""} onChange={e => setEditForm({ ...editForm, location: e.target.value })} />
                        </div>
                        <div className="admin-inline-actions">
                          <button className="admin-cancel-edit-btn" onClick={() => setEditingId(null)}>Cancel</button>
                          <button className="admin-save-btn" onClick={() => saveEdit(`/api/admin/roles/${item.id}`)}>Save</button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="admin-content-item-actions">
                    <button onClick={() => item.id && patch(`/api/admin/roles/${item.id}`, { is_active: !item.is_active })} title={item.is_active ? "Hide" : "Publish"}>{item.is_active ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                    <button onClick={() => startEdit(item.id, { title: item.title, summary: item.summary ?? "", department: item.department ?? "", location: item.location ?? "" })} title="Edit"><Edit3 size={14} /></button>
                    <button className="admin-delete-icon" onClick={() => setDeleteTarget({ id: item.id, label: item.title, endpoint: `/api/admin/roles/${item.id}` })} title="Delete"><Trash2 size={14} /></button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* WORKS */}
        {tab === "works" && (
          <section className="admin-editor-layout">
            <form className="admin-form-card" onSubmit={e => { e.preventDefault(); void create("/api/admin/works", workForm, () => setWorkForm(emptyWork)); }}>
              <h2>Add case study</h2>
              <input placeholder="Title" value={workForm.title} onChange={e => setWorkForm({ ...workForm, title: e.target.value })} required />
              <textarea placeholder="Summary" value={workForm.summary} onChange={e => setWorkForm({ ...workForm, summary: e.target.value })} required />
              <div className="admin-form-grid">
                <input placeholder="Category" value={workForm.category} onChange={e => setWorkForm({ ...workForm, category: e.target.value })} />
                <input placeholder="Image URL" value={workForm.image_url} onChange={e => setWorkForm({ ...workForm, image_url: e.target.value })} />
                <input type="number" placeholder="Order" value={workForm.sort_order} onChange={e => setWorkForm({ ...workForm, sort_order: Number(e.target.value) })} />
              </div>
              {workForm.image_url && <img className="admin-image-preview" src={workForm.image_url} alt="Preview" onError={e => (e.currentTarget.style.display = "none")} onLoad={e => (e.currentTarget.style.display = "block")} />}
              <button className="button primary" type="submit"><Plus size={16} /> Add Work</button>
            </form>
            <div className="admin-content-list">
              {filteredWorks.map(item => (
                <article className="admin-content-item" key={item.id}>
                  <div>
                    <span>{item.category || "Case study"}</span>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                    {item.image_url && <img className="admin-image-preview" src={item.image_url} alt={item.title} onError={e => (e.currentTarget.style.display = "none")} />}
                    {editingId === item.id && (
                      <div className="admin-inline-edit">
                        <input placeholder="Title" value={editForm.title ?? ""} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                        <textarea placeholder="Summary" value={editForm.summary ?? ""} onChange={e => setEditForm({ ...editForm, summary: e.target.value })} />
                        <div className="admin-form-grid">
                          <input placeholder="Category" value={editForm.category ?? ""} onChange={e => setEditForm({ ...editForm, category: e.target.value })} />
                          <input placeholder="Image URL" value={editForm.image_url ?? ""} onChange={e => setEditForm({ ...editForm, image_url: e.target.value })} />
                        </div>
                        <div className="admin-inline-actions">
                          <button className="admin-cancel-edit-btn" onClick={() => setEditingId(null)}>Cancel</button>
                          <button className="admin-save-btn" onClick={() => saveEdit(`/api/admin/works/${item.id}`)}>Save</button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="admin-content-item-actions">
                    <button onClick={() => item.id && patch(`/api/admin/works/${item.id}`, { is_active: !item.is_active })} title={item.is_active ? "Hide" : "Publish"}>{item.is_active ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                    <button onClick={() => startEdit(item.id, { title: item.title, summary: item.summary, category: item.category ?? "", image_url: item.image_url ?? "" })} title="Edit"><Edit3 size={14} /></button>
                    <button className="admin-delete-icon" onClick={() => setDeleteTarget({ id: item.id, label: item.title, endpoint: `/api/admin/works/${item.id}` })} title="Delete"><Trash2 size={14} /></button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* SETTINGS */}
        {tab === "settings" && (
          <section>
            {[
              { key: "company", title: "Company Information", fields: ["name", "tagline", "description", "email", "phone"] },
              { key: "social", title: "Social Links", fields: ["linkedin", "github", "twitter"] },
              { key: "hero", title: "Homepage Hero", fields: ["title", "subtitle", "cta_text", "cta_url"] }
            ].map(group => (
              <div className="admin-settings-card" key={group.key}>
                <h3>{group.title}</h3>
                <div className="admin-settings-grid">
                  {group.fields.map(field => (
                    <label key={field}>
                      {field.replace(/_/g, " ")}
                      {field === "description" || field === "subtitle" ? (
                        <textarea value={settingsData[group.key]?.[field] ?? ""} onChange={e => setSettingsData({ ...settingsData, [group.key]: { ...settingsData[group.key], [field]: e.target.value } })} />
                      ) : (
                        <input value={settingsData[group.key]?.[field] ?? ""} onChange={e => setSettingsData({ ...settingsData, [group.key]: { ...settingsData[group.key], [field]: e.target.value } })} />
                      )}
                    </label>
                  ))}
                </div>
                <button className="button primary" style={{ marginTop: 14 }} onClick={() => saveSetting(group.key)} disabled={loading}>
                  {loading ? <Loader2 size={14} className="spin" /> : <Settings size={14} />} Save {group.title}
                </button>
              </div>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}
