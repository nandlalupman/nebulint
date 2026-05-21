export type ProjectInquiry = {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  timeline?: string;
  environment?: string;
  brief: string;
  source?: string;
};

export type CareerApplication = {
  name: string;
  email: string;
  role: string;
  portfolio?: string;
  statement: string;
  source?: string;
};

export type OpenRole = {
  id?: string;
  title: string;
  summary?: string | null;
  department?: string | null;
  location?: string | null;
  type?: string | null;
  sort_order?: number | null;
  is_active?: boolean | null;
  created_at?: string;
  updated_at?: string;
};

export type WorkItem = {
  id?: string;
  title: string;
  summary: string;
  category?: string | null;
  image_url?: string | null;
  sort_order?: number | null;
  is_active?: boolean | null;
  created_at?: string;
  updated_at?: string;
};

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertSupabaseConfig() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase is not configured. Please define SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.");
  }
}

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && serviceRoleKey);
}

export async function supabaseRequest<T>(path: string, init: RequestInit = {}) {
  assertSupabaseConfig();

  const endpoint = `${supabaseUrl!.replace(/\/$/, "")}/rest/v1/${path}`;
  const response = await fetch(endpoint, {
    headers: {
      apikey: serviceRoleKey!,
      Authorization: `Bearer ${serviceRoleKey}`,
      ...(init.headers || {})
    },
    ...init
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase request failed: ${detail || response.statusText}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

export async function listRows<T>(table: string, query = "select=*") {
  return supabaseRequest<T[]>(`${table}?${query}`, {
    method: "GET",
    cache: "no-store"
  });
}

export async function insertRow<T>(table: string, row: Record<string, unknown>) {
  return supabaseRequest<T[]>(table, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify(row)
  });
}

export async function updateRow<T>(table: string, id: string, row: Record<string, unknown>) {
  return supabaseRequest<T[]>(`${table}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify(row)
  });
}

export async function deleteRow(table: string, id: string) {
  return supabaseRequest<null>(`${table}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE"
  });
}

export type SiteSetting = {
  id?: string;
  setting_key: string;
  setting_value: Record<string, unknown>;
  updated_at?: string;
};

export async function getSiteSettings() {
  return await listRows<SiteSetting>("site_settings", "select=*");
}

export async function upsertSetting(key: string, value: Record<string, unknown>) {
  return supabaseRequest<SiteSetting[]>("site_settings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=representation,resolution=merge-duplicates"
    },
    body: JSON.stringify({
      setting_key: key,
      setting_value: value,
      updated_at: new Date().toISOString()
    })
  });
}

export async function createProjectInquiry(inquiry: ProjectInquiry) {
  return insertRow("project_inquiries", {
    name: inquiry.name,
    email: inquiry.email,
    company: inquiry.company || null,
    project_type: inquiry.projectType,
    timeline: inquiry.timeline || null,
    environment: inquiry.environment || null,
    brief: inquiry.brief,
    source: inquiry.source || "website"
  });
}

export async function createCareerApplication(application: CareerApplication) {
  return insertRow("career_applications", {
    name: application.name,
    email: application.email,
    role: application.role,
    portfolio: application.portfolio || null,
    statement: application.statement,
    source: application.source || "careers_page"
  });
}
