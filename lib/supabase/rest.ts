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

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertSupabaseConfig() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.");
  }
}

export async function createProjectInquiry(inquiry: ProjectInquiry) {
  assertSupabaseConfig();

  const endpoint = `${supabaseUrl!.replace(/\/$/, "")}/rest/v1/project_inquiries`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey!,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify({
      name: inquiry.name,
      email: inquiry.email,
      company: inquiry.company || null,
      project_type: inquiry.projectType,
      timeline: inquiry.timeline || null,
      environment: inquiry.environment || null,
      brief: inquiry.brief,
      source: inquiry.source || "website"
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase insert failed: ${detail || response.statusText}`);
  }

  return response.json();
}
