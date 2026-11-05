import { getSiteSettings, isSupabaseConfigured, listRows, type OpenRole, type WorkItem } from "./supabase/rest";
import { isCurrentCampaign, type Campaign } from "./records";

export async function getOpenRoles() {
  if (!isSupabaseConfigured()) return [];
  try {
    return await listRows<OpenRole>(
      "open_roles",
      "select=*&is_active=eq.true&order=sort_order.asc.nullslast,title.asc"
    );
  } catch (error) {
    console.error("Error fetching open roles:", error);
    return [];
  }
}

export async function getCaseStudies() {
  if (!isSupabaseConfigured()) return null;
  try {
    return await listRows<WorkItem>(
      "case_studies",
      "select=*&is_active=eq.true&order=sort_order.asc.nullslast,title.asc"
    );
  } catch (error) {
    console.error("Error fetching case studies:", error);
    return null;
  }
}

export async function getCampaigns() {
  if (!isSupabaseConfigured()) return [];
  try {
    const rows = await listRows<Campaign>("campaigns", "select=*&is_active=eq.true&order=sort_order.asc,created_at.desc");
    return rows.filter(campaign => isCurrentCampaign(campaign));
  } catch (error) {
    console.error("Unable to load campaigns:", error);
    return [];
  }
}

export async function getPublicSettings() {
  if (!isSupabaseConfigured()) return {};
  try {
    const rows = await getSiteSettings();
    return Object.fromEntries(rows.map(row => [row.setting_key, row.setting_value])) as Record<string, Record<string, string>>;
  } catch (error) {
    console.error("Unable to load site settings:", error);
    return {};
  }
}
