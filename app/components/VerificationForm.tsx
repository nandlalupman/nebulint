"use client";

import { FormEvent, useState } from "react";
import { Loader2, Search, ShieldCheck, ShieldX } from "lucide-react";
import { displayDate, type VerificationRecord } from "../../lib/records";

export function VerificationForm() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<VerificationRecord | null | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError(""); setResult(undefined);
    try {
      const response = await fetch("/api/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Unable to verify this record.");
      setResult(payload.record);
    } catch (error) { setError(error instanceof Error ? error.message : "Verification failed. Please try again."); }
    finally { setLoading(false); }
  }
  return <div><form className="verification-form" onSubmit={submit}>
    <h2>Verify a record</h2><label htmlFor="verification-code">Verification / certificate / employee ID</label>
    <input id="verification-code" value={code} disabled={loading} onChange={event => { setCode(event.target.value); setResult(undefined); setError(""); }} placeholder="Enter the ID on your document" minLength={6} maxLength={80} pattern="[A-Za-z0-9][A-Za-z0-9-]{5,79}" required autoComplete="off" spellCheck={false} />
    <small>Enter the complete ID. Letters are not case sensitive.</small>
    <button className="button primary" type="submit" disabled={loading}>{loading ? <Loader2 size={17} className="spin" /> : <Search size={17} />}{loading ? "Checking…" : "Verify record"}</button>
    {error ? <p className="form-status error" role="alert">{error}</p> : null}
  </form>
    <div aria-live="polite" aria-atomic="true">
      {result === null ? <section className="verification-result"><ShieldX size={28} /><h2>No public record found</h2><p>Check the ID and try again. A missing result does not establish that a document is valid or invalid. Contact NEBULINT for confirmation.</p></section> : null}
      {result ? <section className={`verification-result ${result.status === "revoked" ? "revoked" : "verified"}`}>
        {result.status === "revoked" ? <ShieldX size={30} /> : <ShieldCheck size={30} />}<h2>{result.status === "revoked" ? "Record revoked" : "Record verified"}</h2>
        <p>{result.status === "revoked" ? "This record has been revoked by NEBULINT and is no longer valid." : "This record matches an official NEBULINT record."}</p>
        <dl>{[["Verification ID", result.verification_code], ["Name", result.full_name], ["Association", result.record_type], ["Role / program", result.role], ["Department", result.department], ["Start date", displayDate(result.start_date)], ["End date", displayDate(result.end_date)], ["Status", result.status]].filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        {result.description ? <p className="public-details">{result.description}</p> : null}
      </section> : null}
    </div>
  </div>;
}
