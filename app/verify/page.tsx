import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { SiteHeader } from "../components/SiteHeader";
import { VerificationForm } from "../components/VerificationForm";

export const metadata: Metadata = { title: "Verify a record | NEBULINT", description: "Verify a NEBULINT internship, employment or association record using its official verification ID.", robots: { index: false, follow: false } };

export default function VerifyPage() {
  return <><SiteHeader /><main className="public-page verification-page">
    <section className="public-page-intro"><div className="eyebrow"><span /> Official verification</div><h1>TRUST STARTS WITH VERIFICATION.</h1><p>Confirm a NEBULINT internship, employment or association using the verification ID provided on the official document.</p></section>
    <div className="verification-layout"><VerificationForm /><aside className="verification-guide"><ShieldCheck size={32} /><h2>Check the details.</h2><p>Match the name, role, dates and status against the document you received.</p><p>An active or completed record confirms the recorded association. A revoked record is no longer valid.</p><p>Only details approved for verification are shown here. For a missing record or a discrepancy, contact <a href="mailto:contact@nebulint.com">contact@nebulint.com</a>.</p></aside></div>
  </main></>;
}
