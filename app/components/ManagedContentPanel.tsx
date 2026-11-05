"use client";

import { FormEvent, useState } from "react";
import { Edit3, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import type { Campaign, VerificationRecord } from "../../lib/records";
import { ContentImage } from "./ContentImage";
import { ImageUpload } from "./ImageUpload";

type Value = string | number | boolean;
type Field = { key: string; label: string; type?: string; required?: boolean; max?: number; options?: string[] };
const campaignFields: Field[] = [
  { key: "title", label: "Campaign title", required: true, max: 200 },
  { key: "summary", label: "Short summary", type: "textarea", required: true, max: 2000 },
  { key: "details", label: "Full campaign details", type: "textarea", required: true, max: 15000 },
  { key: "category", label: "Category", max: 100 },
  { key: "start_date", label: "Start date (UTC)", type: "date" },
  { key: "end_date", label: "End date (UTC, inclusive)", type: "date" },
  { key: "cta_label", label: "Action button label", max: 80 },
  { key: "cta_url", label: "Action URL or site path", max: 2048 },
  { key: "sort_order", label: "Display order (lower comes first)", type: "number" }
];
const verificationFields: Field[] = [
  { key: "verification_code", label: "Certificate / employee / verification ID", required: true, max: 80 },
  { key: "full_name", label: "Full name", required: true, max: 160 },
  { key: "record_type", label: "Association type", options: ["internship", "employment", "association"] },
  { key: "role", label: "Role / program", required: true, max: 200 },
  { key: "department", label: "Department", max: 160 },
  { key: "start_date", label: "Start date", type: "date", required: true },
  { key: "end_date", label: "End date (leave blank if ongoing)", type: "date" },
  { key: "status", label: "Record status", options: ["active", "completed", "revoked"] },
  { key: "description", label: "Approved public details", type: "textarea", max: 5000 }
];
const emptyCampaign = { title: "", summary: "", details: "", category: "", image_url: "", start_date: "", end_date: "", cta_label: "", cta_url: "", sort_order: 100, is_active: false };
const emptyVerification = { verification_code: "", full_name: "", record_type: "internship", role: "", department: "", start_date: "", end_date: "", status: "active", description: "", is_public: false };

export function ManagedContentPanel({ kind, items, query, refresh }: { kind: "campaigns" | "verifications"; items: Campaign[] | VerificationRecord[]; query: string; refresh: () => Promise<void> }) {
  const campaigns = kind === "campaigns";
  const defaults = campaigns ? emptyCampaign : emptyVerification;
  const [form, setForm] = useState<Record<string, Value>>({ ...defaults });
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const visibility = campaigns ? "is_active" : "is_public";
  const filtered = items.filter(item => Object.values(item).some(value => typeof value === "string" && value.toLowerCase().includes(query.toLowerCase())));
  const change = (key: string, value: Value) => setForm(previous => ({ ...previous, [key]: value }));
  async function mutate(method: string, id?: string, body?: Record<string, Value>, reset = false) {
    setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/admin/${kind}${id ? `/${id}` : ""}`, { method, headers: { "Content-Type": "application/json" }, ...(body ? { body: JSON.stringify(body) } : {}) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Unable to save record.");
      if (reset || id === editing && method === "DELETE") { setEditing(null); setForm({ ...defaults }); }
      setDeleting(null); await refresh(); setMessage(method === "DELETE" ? "Record deleted." : "Record saved.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Request failed."); }
    finally { setBusy(false); }
  }
  function edit(item: Campaign | VerificationRecord) {
    const next: Record<string, Value> = {};
    for (const key of Object.keys(defaults)) next[key] = (item as unknown as Record<string, Value | null>)[key] ?? "";
    setForm(next); setEditing(item.id); setMessage("");
  }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void mutate(editing ? "PATCH" : "POST", editing || undefined, form, true); }
  return <div>
    {message ? <p className="admin-message" role="status">{message}</p> : null}
    <section className="admin-editor-layout">
      <form className="admin-form-card managed-form" onSubmit={submit}>
        <h2>{editing ? "Edit" : "Add"} {campaigns ? "campaign" : "verification record"}</h2>
        {!campaigns ? <p>Publish only approved professional details. Public lookup shows these fields to anyone with the ID. Do not add private contact or identity information.</p> : <p>Published campaigns appear during their scheduled dates on the homepage and campaigns page.</p>}
        <fieldset disabled={busy || uploading}>
          {(campaigns ? campaignFields : verificationFields).map(field => <label key={field.key}>{field.label}
            {field.options ? <select value={String(form[field.key] ?? "")} onChange={event => change(field.key, event.target.value)}>{field.options.map(option => <option key={option}>{option}</option>)}</select> : field.type === "textarea" ? <textarea value={String(form[field.key] ?? "")} maxLength={field.max} required={field.required} onChange={event => change(field.key, event.target.value)} /> : <input type={field.type || "text"} value={String(form[field.key] ?? "")} maxLength={field.max} required={field.required} onChange={event => change(field.key, field.type === "number" ? Number(event.target.value) : event.target.value)} />}
          </label>)}
          <label className="admin-checkbox"><input type="checkbox" checked={Boolean(form[visibility])} onChange={event => change(visibility, event.target.checked)} />{campaigns ? "Publish campaign" : "Allow public verification of these details"}</label>
        </fieldset>
        {campaigns ? <ImageUpload value={String(form.image_url || "")} onChange={url => change("image_url", url)} onBusy={setUploading} /> : null}
        <button type="submit" className="button primary" disabled={busy || uploading}><Plus size={16} />{busy ? "Saving…" : editing ? "Save changes" : "Add record"}</button>
        {editing ? <button type="button" className="admin-cancel-edit-btn" disabled={busy || uploading} onClick={() => { setEditing(null); setForm({ ...defaults }); }}>Cancel editing</button> : null}
      </form>
      <div className="admin-content-list">
        {!filtered.length ? <div className="admin-system-card"><h3>No {kind} found</h3><p>{query ? "Try another search." : "Add the first record using the form."}</p></div> : null}
        {filtered.map(item => {
          const visible = "is_active" in item ? item.is_active : item.is_public;
          const title = "title" in item ? item.title : item.full_name;
          return <article className="admin-content-item" key={item.id}>
            <div>
              <span>{visible ? campaigns ? "Published (scheduled dates apply)" : "Public lookup enabled" : "Hidden / draft"}</span>
              <h3>{title}</h3>
              {"summary" in item ? <><p>{item.summary}</p>{item.image_url ? <ContentImage src={item.image_url} alt={item.title} className="admin-upload-preview" /> : null}</> : <><code>{item.verification_code}</code><p>{item.record_type} · {item.role} · {item.status}</p><small>{item.start_date} — {item.end_date || "Ongoing"}</small></>}
              {deleting === item.id ? <div className="delete-record-confirm" role="alert"><p>Delete this record permanently?</p><button className="admin-delete-btn" disabled={busy} onClick={() => void mutate("DELETE", item.id)}>Delete</button><button className="admin-cancel-edit-btn" disabled={busy} onClick={() => setDeleting(null)}>Cancel</button></div> : null}
            </div>
            <div className="admin-content-item-actions">
              <button disabled={busy || uploading} aria-label={visible ? `Hide ${title}` : `Publish ${title}`} onClick={() => void mutate("PATCH", item.id, { [visibility]: !visible })}>{visible ? <Eye size={16} /> : <EyeOff size={16} />}</button>
              <button disabled={busy || uploading} aria-label={`Edit ${title}`} onClick={() => edit(item)}><Edit3 size={16} /></button>
              <button disabled={busy || uploading} aria-label={`Delete ${title}`} onClick={() => setDeleting(item.id)}><Trash2 size={16} /></button>
            </div>
          </article>;
        })}
      </div>
    </section>
  </div>;
}
