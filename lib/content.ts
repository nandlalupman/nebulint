import { listRows, type OpenRole, type WorkItem } from "./supabase/rest";

export async function getOpenRoles() {
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
  try {
    return await listRows<WorkItem>(
      "case_studies",
      "select=*&is_active=eq.true&order=sort_order.asc.nullslast,title.asc"
    );
  } catch (error) {
    console.error("Error fetching case studies:", error);
    return [];
  }
}
