"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Activity,
  BriefcaseBusiness,
  Building2,
  FileText,
  Inbox,
  LayoutDashboard,
  Loader2,
  Lock,
  LogIn,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  Users
} from "lucide-react";

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

type Tab = "overview" | "inquiries" | "applications" | "roles" | "works";

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

function statusClass(status: string) {
  return `admin-status ${status.toLowerCase().replace(/\s+/g, "-")}`;
}

function includesQuery(values: Array<string | null | undefined>, query: string) {
  if (!query) return true;
  const needle = query.toLowerCase();
  return values.some((value) => (value || "").toLowerCase().includes(needle));
}

function formatDate(value?: string) {
  if (!value) return "Recently";
  return new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
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

  useEffect(() => {
    void load();
  }, []);

  const metrics = useMemo(() => {
    const inquiries = data?.inquiries || [];
    const applications = data?.applications || [];
    const roles = data?.roles || [];
    const works = data?.works || [];

    return [
      { label: "Client inquiries", value: inquiries.length, detail: `${inquiries.filter((item) => item.status === "new").length} new`, icon: Inbox },
      { label: "Career profiles", value: applications.length, detail: `${applications.filter((item) => item.status === "reviewing").length} reviewing`, icon: Users },
      { label: "Published roles", value: roles.filter((item) => item.is_active).length, detail: `${roles.length} total`, icon: BriefcaseBusiness },
      { label: "Live work items", value: works.filter((item) => item.is_active).length, detail: `${works.length} case studies`, icon: FileText }
    ];
  }, [data]);

  const filteredInquiries = useMemo(() => {
    return (data?.inquiries || []).filter((item) =>
      includesQuery([item.name, item.company, item.email, item.project_type, item.brief], query)
    );
  }, [data, query]);

  const filteredApplications = useMemo(() => {
    return (data?.applications || []).filter((item) =>
      includesQuery([item.name, item.email, item.role, item.statement, item.portfolio], query)
    );
  }, [data, query]);

  const filteredRoles = useMemo(() => {
    return (data?.roles || []).filter((item) =>
      includesQuery([item.title, item.summary, item.department, item.location, item.type], query)
    );
  }, [data, query]);

  const filteredWorks = useMemo(() => {
    return (data?.works || []).filter((item) =>
      includesQuery([item.title, item.summary, item.category, item.image_url], query)
    );
  }, [data, query]);

  async function load() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/overview", { cache: "no-store" });
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

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
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

  if (!data) {
    return (
      <main className="admin-login-page">
        <section className="admin-login-shell">
          <div className="admin-login-copy">
            <span className="admin-kicker"><Lock size={15} /> Secure admin access</span>
            <h1>NEBULINT Operations Console</h1>
            <p>Review project inquiries, career profiles, open roles, and published work from a protected backend dashboard.</p>
            <div className="admin-login-proof">
              <span><ShieldCheck size={16} /> Signed session</span>
              <span><Activity size={16} /> Live Supabase data</span>
              <span><Building2 size={16} /> Content operations</span>
            </div>
          </div>
          <form className="admin-login-card" onSubmit={submitLogin}>
            <div>
              <h2>Admin sign in</h2>
              <p>Use Supabase admin credentials. Local demo: admin@nebulint.local / NebulintAdmin123!</p>
            </div>
            <label>
              Email
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
                placeholder="Admin password"
                required
              />
            </label>
            <button className="button primary" type="submit" disabled={loading}>
              {loading ? <Loader2 size={16} className="spin" /> : <LogIn size={16} />} Sign In
            </button>
            {message ? <p className="admin-message">{message}</p> : null}
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-head">
          <span>NEBULINT</span>
          <strong>Admin OS</strong>
        </div>
        <nav className="admin-side-nav" aria-label="Admin sections">
          {[
            ["overview", "Overview", LayoutDashboard],
            ["inquiries", "Client Inquiries", Inbox],
            ["applications", "Career Forms", Users],
            ["roles", "Open Roles", BriefcaseBusiness],
            ["works", "Our Work", FileText]
          ].map(([id, label, Icon]) => (
            <button key={id as string} className={tab === id ? "active" : ""} onClick={() => setTab(id as Tab)}>
              <Icon size={17} />
              <span>{label as string}</span>
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-status">
          <span>Environment</span>
          <strong>Local / Supabase-ready</strong>
        </div>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <span>Website Operations</span>
            <h1>{tab === "overview" ? "Command Center" : tab.replace("-", " ")}</h1>
          </div>
          <div className="admin-topbar-actions">
            <label className="admin-search">
              <Search size={16} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records..." />
            </label>
            <button className="admin-icon-button" onClick={() => load()} disabled={loading} aria-label="Refresh admin data">
              {loading ? <Loader2 size={17} className="spin" /> : <RefreshCcw size={17} />}
            </button>
          </div>
        </header>

        {message ? <p className="admin-message">{message}</p> : null}

        <section className="admin-kpi-grid">
          {metrics.map(({ label, value, detail, icon: Icon }) => (
            <article key={label} className="admin-kpi-card">
              <div><Icon size={18} /><span>{label}</span></div>
              <strong>{value}</strong>
              <small>{detail}</small>
            </article>
          ))}
        </section>

        {tab === "overview" ? (
          <section className="admin-overview-grid">
            <article className="admin-system-card">
              <div className="admin-card-head">
                <span>Operational pipeline</span>
                <strong>Active intake flow</strong>
              </div>
              <div className="admin-flow">
                {["Inquiry", "Triage", "Engineering review", "Client response", "Delivery"].map((item, index) => (
                  <div key={item}>
                    <i>{String(index + 1).padStart(2, "0")}</i>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>
            <article className="admin-system-card">
              <div className="admin-card-head">
                <span>Recent records</span>
                <strong>Needs attention</strong>
              </div>
              <div className="admin-mini-list">
                {[...data.inquiries.slice(0, 3), ...data.applications.slice(0, 3)].slice(0, 5).map((item) => (
                  <div key={item.id}>
                    <span>{formatDate(item.created_at)}</span>
                    <strong>{"project_type" in item ? item.project_type : item.role}</strong>
                    <small>{item.name}</small>
                  </div>
                ))}
              </div>
            </article>
          </section>
        ) : null}

        {tab === "inquiries" ? (
          <section className="admin-table-panel">
            <AdminTableHeader title="Client inquiry queue" count={filteredInquiries.length} />
            <div className="admin-table">
              {filteredInquiries.map((item) => (
                <article className="admin-row" key={item.id}>
                  <div className="admin-row-main">
                    <span className={statusClass(item.status)}>{item.status}</span>
                    <h3>{item.company || item.name}</h3>
                    <p>{item.project_type} / {item.environment || "Environment TBD"} / {item.timeline || "Timeline TBD"}</p>
                    <small>{item.name} / {item.email}</small>
                  </div>
                  <p className="admin-row-note">{item.brief}</p>
                  <select value={item.status} onChange={(event) => patch(`/api/admin/inquiries/${item.id}`, { status: event.target.value })}>
                    {statusOptions.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {tab === "applications" ? (
          <section className="admin-table-panel">
            <AdminTableHeader title="Career application queue" count={filteredApplications.length} />
            <div className="admin-table">
              {filteredApplications.map((item) => (
                <article className="admin-row" key={item.id}>
                  <div className="admin-row-main">
                    <span className={statusClass(item.status)}>{item.status}</span>
                    <h3>{item.name}</h3>
                    <p>{item.role}</p>
                    <small>{item.email}</small>
                  </div>
                  <p className="admin-row-note">{item.statement}</p>
                  <select value={item.status} onChange={(event) => patch(`/api/admin/applications/${item.id}`, { status: event.target.value })}>
                    {statusOptions.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {tab === "roles" ? (
          <section className="admin-editor-layout">
            <form className="admin-form-card" onSubmit={(event) => {
              event.preventDefault();
              void create("/api/admin/roles", roleForm, () => setRoleForm(emptyRole));
            }}>
              <h2>Add open role</h2>
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
            <ContentList items={filteredRoles} kind="role" onToggle={(id, active) => patch(`/api/admin/roles/${id}`, { is_active: !active })} />
          </section>
        ) : null}

        {tab === "works" ? (
          <section className="admin-editor-layout">
            <form className="admin-form-card" onSubmit={(event) => {
              event.preventDefault();
              void create("/api/admin/works", workForm, () => setWorkForm(emptyWork));
            }}>
              <h2>Add case study</h2>
              <input placeholder="Title" value={workForm.title} onChange={(event) => setWorkForm({ ...workForm, title: event.target.value })} required />
              <textarea placeholder="Summary" value={workForm.summary} onChange={(event) => setWorkForm({ ...workForm, summary: event.target.value })} required />
              <div className="admin-form-grid">
                <input placeholder="Category" value={workForm.category} onChange={(event) => setWorkForm({ ...workForm, category: event.target.value })} />
                <input placeholder="Image URL" value={workForm.image_url} onChange={(event) => setWorkForm({ ...workForm, image_url: event.target.value })} />
                <input type="number" placeholder="Order" value={workForm.sort_order} onChange={(event) => setWorkForm({ ...workForm, sort_order: Number(event.target.value) })} />
              </div>
              <button className="button primary" type="submit"><Plus size={16} /> Add Work</button>
            </form>
            <ContentList items={filteredWorks} kind="work" onToggle={(id, active) => patch(`/api/admin/works/${id}`, { is_active: !active })} />
          </section>
        ) : null}
      </section>
    </main>
  );
}

function AdminTableHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="admin-table-head">
      <div>
        <span>Records</span>
        <h2>{title}</h2>
      </div>
      <strong>{count}</strong>
    </div>
  );
}

function ContentList({
  items,
  kind,
  onToggle
}: {
  items: Array<Role | Work>;
  kind: "role" | "work";
  onToggle: (id: string, active: boolean | null | undefined) => void;
}) {
  return (
    <div className="admin-content-list">
      {items.map((item) => (
        <article className="admin-content-item" key={item.id}>
          <div>
            <span>{kind === "role" ? ("department" in item ? item.department : "Role") : ("category" in item ? item.category : "Case study")}</span>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <small>{"location" in item ? item.location : "image_url" in item ? item.image_url : null}</small>
          </div>
          <button onClick={() => item.id && onToggle(item.id, item.is_active)}>
            {item.is_active ? "Published" : "Hidden"}
          </button>
        </article>
      ))}
    </div>
  );
}
