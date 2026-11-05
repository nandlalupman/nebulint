import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Campaign } from "../../lib/records";
import { displayDate } from "../../lib/records";
import { ContentImage } from "./ContentImage";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  return <article className="campaign-card">
    <Link href={`/campaigns/${campaign.id}`} aria-label={`View ${campaign.title}`}><ContentImage src={campaign.image_url} alt={campaign.title} /></Link>
    <div className="campaign-card-copy">
      <div className="campaign-meta"><span>{campaign.category || "Campaign"}</span><span className="live-dot">Ongoing</span></div>
      <h3><Link href={`/campaigns/${campaign.id}`}>{campaign.title}</Link></h3>
      <p>{campaign.summary}</p>
      {campaign.start_date || campaign.end_date ? <small>{campaign.start_date ? displayDate(campaign.start_date) : "Now"} — {displayDate(campaign.end_date)}</small> : null}
      <Link href={`/campaigns/${campaign.id}`} className="campaign-link">View campaign <ArrowUpRight size={17} /></Link>
    </div>
  </article>;
}
