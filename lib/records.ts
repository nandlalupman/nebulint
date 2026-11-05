export type Campaign = {
  id: string;
  title: string;
  summary: string;
  details: string;
  category: string | null;
  image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  cta_label: string | null;
  cta_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export type VerificationRecord = {
  id: string;
  verification_code: string;
  full_name: string;
  record_type: "internship" | "employment" | "association";
  role: string;
  department: string | null;
  start_date: string;
  end_date: string | null;
  status: "active" | "completed" | "revoked";
  description: string | null;
  is_public: boolean;
};

export function isCurrentCampaign(campaign: Pick<Campaign, "is_active" | "start_date" | "end_date">, today = new Date().toISOString().slice(0, 10)) {
  return campaign.is_active && (!campaign.start_date || campaign.start_date <= today) && (!campaign.end_date || campaign.end_date >= today);
}

export function displayDate(value: string | null) {
  return value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)) : "Ongoing";
}
