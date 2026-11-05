import { notFound } from "next/navigation";
import Link from "next/link";
import { getCampaigns } from "../../../lib/content";
import { displayDate } from "../../../lib/records";
import { SiteHeader } from "../../components/SiteHeader";
import { ContentImage } from "../../components/ContentImage";
import { safeUrl } from "../../../lib/validation";

export const dynamic = "force-dynamic";

export default async function CampaignDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = (await getCampaigns()).find(item => item.id === id);
  if (!campaign) notFound();
  let href = "";
  try { href = safeUrl(campaign.cta_url, "Campaign link", true); } catch { /* Hide invalid legacy links. */ }
  return <><SiteHeader /><main className="public-page campaign-detail">
    <Link href="/campaigns" className="campaign-link">← All campaigns</Link>
    <section className="public-page-intro"><div className="eyebrow"><span /> {campaign.category || "NEBULINT Campaign"}</div><h1>{campaign.title}</h1><p>{campaign.summary}</p><small>{campaign.start_date ? displayDate(campaign.start_date) : "Now"} — {displayDate(campaign.end_date)}</small></section>
    <ContentImage src={campaign.image_url} alt={campaign.title} />
    <section className="campaign-body"><h2>About this campaign</h2><p>{campaign.details}</p>{href ? <a className="button primary" href={href}>{campaign.cta_label || "Get involved"} →</a> : <Link className="button primary" href="/contact">Contact us about this campaign →</Link>}</section>
  </main></>;
}
