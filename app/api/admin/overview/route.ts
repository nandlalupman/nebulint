import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/admin-auth";
import { listRows, getSiteSettings } from "../../../../lib/supabase/rest";

export async function GET(request: Request) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const [inquiries, applications, roles, works, settings] = await Promise.all([
      listRows("project_inquiries", "select=*&order=created_at.desc&limit=100"),
      listRows("career_applications", "select=*&order=created_at.desc&limit=100"),
      listRows("open_roles", "select=*&order=sort_order.asc.nullslast,title.asc"),
      listRows("case_studies", "select=*&order=sort_order.asc.nullslast,title.asc"),
      getSiteSettings()
    ]);

    return NextResponse.json({
      ok: true,
      data: { inquiries, applications, roles, works, settings }
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Unable to load admin data." },
      { status: 500 }
    );
  }
}
