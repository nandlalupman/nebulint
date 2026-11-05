import type { Metadata } from "next";
import Link from "next/link";
import { getCampaigns } from "../../lib/content";
import { CampaignCard } from "../components/CampaignCard";
import { SiteHeader } from "../components/SiteHeader";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Campaigns | NEBULINT", description: "Explore current NEBULINT programs, campaigns and opportunities." };

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();
  return <><SiteHeader /><main className="public-page">
    <section className="public-page-intro"><div className="eyebrow"><span /> What’s happening</div><h1>CURRENT CAMPAIGNS.</h1><p>Discover the programs, initiatives and opportunities running at NEBULINT.</p></section>
    {campaigns.length ? <div className="campaign-grid">{campaigns.map(campaign => <CampaignCard campaign={campaign} key={campaign.id} />)}</div> : <div className="public-empty"><h2>More opportunities are on the way.</h2><p>There are no ongoing campaigns right now. Check back soon or get in touch with our team.</p><Link className="button secondary" href="/contact">Contact NEBULINT</Link></div>}
  </main></>;
}
