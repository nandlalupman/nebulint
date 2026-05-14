"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, CircleCheck, Inbox, Loader2, Lock, LogIn, Plus, RefreshCcw, Users } from "lucide-react";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  project_type: string;
  timeline?: string | null;
  environment?: string | null;
  brief: string;
  status: string;
  created_at: string;
};

type Application = {
  id: string;
  name: string;
  email: string;
  role: string;
  portfolio?: string | null;
  statement: string;
  status: string;
  created_at: string;
};

type Role = {
  id: string;
  title: string;
  summary?: string | null;
  department?: string | null;
  location?: string | null;
  type?: string | null;
  sort_order?: number | null;
  is_active?: boolean | null;
};

type Work = {
  id: string;
  title: string;
  summary: string;
  category?: string | null;
  image_url?: string | null;
  sort_order?: number | null;
  is_active?: boolean | null;
};

type Overview = {
  inquiries: Inquiry[];
  applications: Application[];
  roles: Role[];
  works: Work[];
};

type Tab = "inquiries" | "applications" | "roles" | "works";

const statusOptions = ["new", "reviewing", "qualified", "contacted", "closed"];

const emptyRole = {
  title: "",
  summary: "",
  department: "",
  location: "Remote / Hybrid",
  type: "Engineering",
  sort_order: 100
};

const emptyWork = {
  title: "",
  summary: "",
  category: "",
  image_url: "",
  sort_order: 100
};

export function AdminDashboard() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [data, setData] = useState<Overview | null>(null);
  const [tab, setTab] = useState<Tab>("inquiries");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [roleForm, setRoleForm] = useState(emptyRole);
  const [workForm, setWorkForm] = useState(emptyWork);

  useEffect(() => {
    void load();
  }, []);

  const totals = useMemo(() => {
    return {
      inquiries: data?.inquiries.length || 0,
      applications: data?.applications.length || 0,
      roles: data?.roles.length || 0,
      works: data?.works.length || 0
    };
  }, [data]);

  async function load() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/overview", {
        cache: "no-store"
      });
      const payload = await response.json();

      if (!response.ok) throw new Error(payload?.message || "Unable to load admin data.");

      setData(payload.data);
    } catch (error) {
      setData(null);
      setMessage(error instanceof Error ? error.message : "Unable to load admin data.");
    } finally {
      setLoading(false);
    }
  }

  async function submitToken(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });
      const payload = await response.json();

      if (!response.ok) throw new Error(payload?.message || "Admin sign in failed.");

      setCredentials({ email: credentials.email, password: "" });
      await load();
    } catch (error) {
      setData(null);
      setMessage(error instanceof Error ? error.message : "Admin sign in failed.");
    } finally {
      setLoading(false);
    }
  }

  async function patch(path: string, body: Record<string, unknown>) {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(path, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || "Update failed.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setLoading(false);
    }
  }

  async function create(path: string, body: Record<string, unknown>, reset: () => void) {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || "Create failed.");
      reset();
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Create failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-hero">
        <div>
          <span className="admin-kicker"><Lock size={15} /> NEBULINT ADMIN</span>
          <h1>Website Operations Console</h1>
          <p>Edit roles, case studies, review client inquiries, and manage career applications from one protected backend console.</p>
        </div>
        <form className="admin-login" onSubmit={submitToken}>
          <label>
            Admin email
            <input
              value={credentials.email}
              onChange={(event) => setCredentials({ ...credentials, email: event.target.value })}
              type="email"
              placeholder="admin@nebulint.com"
              required
            />
          </label>
          <label>
            Password
            <input
              value={credentials.password}
              onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
              type="password"
              placeholder="Supabase admin password"
              required
            />
          </label>
          <button className="button primary" type="submit" disabled={loading}>
            {loading ? <Loader2 size={16} className="spin" /> : <LogIn size={16} />} Sign In
          </button>
        </form>
      </section>

      {message ? <p className="admin-message">{message}</p> : null}

      {data ? (
        <>
          <section className="admin-stats">
            <button className={tab === "inquiries" ? "active" : ""} onClick={() => setTab("inquiries")}>
              <Inbox size={18} /><span>Client Inquiries</span><strong>{totals.inquiries}</strong>
            </button>
            <button className={tab === "applications" ? "active" : ""} onClick={() => setTab("applications")}>
              <Users size={18} /><span>Career Forms</span><strong>{totals.applications}</strong>
            </button>
            <button className={tab === "roles" ? "active" : ""} onClick={() => setTab("roles")}>
              <BriefcaseBusiness size={18} /><span>Open Roles</span><strong>{totals.roles}</strong>
            </button>
            <button className={tab === "works" ? "active" : ""} onClick={() => setTab("works")}>
              <CircleCheck size={18} /><span>Our Work</span><strong>{totals.works}</strong>
            </button>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <span>Live backend</span>
                <h2>{tab.replace("-", " ")}</h2>
              </div>
              <button className="admin-icon-button" onClick={() => load()} disabled={loading} aria-label="Refresh admin data">
                <RefreshCcw size={17} />
              </button>
            </div>

            {tab === "inquiries" ? (
              <div className="admin-list">
                {data.inquiries.map((item) => (
                  <article className="admin-record" key={item.id}>
                    <div>
                      <span>{item.project_type}</span>
                      <h3>{item.name} {item.company ? ` / ${item.company}` : ""}</h3>
                      <a href={`mailto:${item.email}`}>{item.email}</a>
                      <p>{item.brief}</p>
                    </div>
                    <select value={item.status} onChange={(event) => patch(`/api/admin/inquiries/${item.id}`, { status: event.target.value })}>
                      {statusOptions.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </article>
                ))}
              </div>
            ) : null}

            {tab === "applications" ? (
              <div className="admin-list">
                {data.applications.map((item) => (
                  <article className="admin-record" key={item.id}>
                    <div>
                      <span>{item.role}</span>
                      <h3>{item.name}</h3>
                      <a href={`mailto:${item.email}`}>{item.email}</a>
                      {item.portfolio ? <a href={item.portfolio} target="_blank" rel="noreferrer">{item.portfolio}</a> : null}
                      <p>{item.statement}</p>
                    </div>
                    <select value={item.status} onChange={(event) => patch(`/api/admin/applications/${item.id}`, { status: event.target.value })}>
                      {statusOptions.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </article>
                ))}
              </div>
            ) : null}

            {tab === "roles" ? (
              <div className="admin-editor">
                <form className="admin-form" onSubmit={(event) => {
                  event.preventDefault();
                  void create("/api/admin/roles", roleForm, () => setRoleForm(emptyRole));
                }}>
                  <h3>Add open role</h3>
                  <input placeholder="Title" value={roleForm.title} onChange={(event) => setRoleForm({ ...roleForm, title: event.target.value })} required />
                  <textarea placeholder="Summary" value={roleForm.summary} onChange={(event) => setRoleForm({ ...roleForm, summary: event.target.value })} />
                  <div className="admin-form-grid">
                    <input placeholder="Department" value={roleForm.department} onChange={(event) => setRoleForm({ ...roleForm, department: event.target.value })} />
                    <input placeholder="Location" value={roleForm.location} onChange={(event) => setRoleForm({ ...roleForm, location: event.target.value })} />
                    <input placeholder="Type" value={roleForm.type} onChange={(event) => setRoleForm({ ...roleForm, type: event.target.value })} />
                    <input type="number" placeholder="Order" value={roleForm.sort_order} onChange={(event) => setRoleForm({ ...roleForm, sort_order: Number(event.target.value) })} />
                  </div>
                  <button className="button primary" type="submit"><Plus size={16} /> Add Role</button>
                </form>
                <div className="admin-list">
                  {data.roles.map((role) => (
                    <article className="admin-record compact" key={role.id}>
                      <div>
                        <span>{role.department || role.type || "Role"}</span>
                        <h3>{role.title}</h3>
                        <p>{role.summary}</p>
                        <small>{role.location} / order {role.sort_order ?? 100}</small>
                      </div>
                      <button onClick={() => patch(`/api/admin/roles/${role.id}`, { is_active: !role.is_active })}>
                        {role.is_active ? "Pause" : "Publish"}
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}

            {tab === "works" ? (
              <div className="admin-editor">
                <form className="admin-form" onSubmit={(event) => {
                  event.preventDefault();
                  void create("/api/admin/works", workForm, () => setWorkForm(emptyWork));
                }}>
                  <h3>Add case study / work</h3>
                  <input placeholder="Title" value={workForm.title} onChange={(event) => setWorkForm({ ...workForm, title: event.target.value })} required />
                  <textarea placeholder="Summary" value={workForm.summary} onChange={(event) => setWorkForm({ ...workForm, summary: event.target.value })} required />
                  <div className="admin-form-grid">
                    <input placeholder="Category" value={workForm.category} onChange={(event) => setWorkForm({ ...workForm, category: event.target.value })} />
                    <input placeholder="Image URL" value={workForm.image_url} onChange={(event) => setWorkForm({ ...workForm, image_url: event.target.value })} />
                    <input type="number" placeholder="Order" value={workForm.sort_order} onChange={(event) => setWorkForm({ ...workForm, sort_order: Number(event.target.value) })} />
                  </div>
                  <button className="button primary" type="submit"><Plus size={16} /> Add Work</button>
                </form>
                <div className="admin-list">
                  {data.works.map((work) => (
                    <article className="admin-record compact" key={work.id}>
                      <div>
                        <span>{work.category || "Case study"}</span>
                        <h3>{work.title}</h3>
                        <p>{work.summary}</p>
                        {work.image_url ? <small>{work.image_url}</small> : null}
                      </div>
                      <button onClick={() => patch(`/api/admin/works/${work.id}`, { is_active: !work.is_active })}>
                        {work.is_active ? "Hide" : "Publish"}
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </>
      ) : (
        <section className="admin-empty">
          <h2>Connect to Supabase-backed operations.</h2>
          <p>Run the Supabase admin auth SQL, create an admin user with the setup script, then sign in above.</p>
        </section>
      )}
    </main>
  );
}
