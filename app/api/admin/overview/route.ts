import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/admin-auth";
import { listRows, getSiteSettings } from "../../../../lib/supabase/rest";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const [inquiries, applications, roles, works, settings, campaigns, verifications] = await Promise.all([
      listRows("project_inquiries", "select=*&order=created_at.desc&limit=100"),
      listRows("career_applications", "select=*&order=created_at.desc&limit=100"),
      listRows("open_roles", "select=*&order=sort_order.asc.nullslast,title.asc"),
      listRows("case_studies", "select=*&order=sort_order.asc.nullslast,title.asc"),
      getSiteSettings(),
      listRows("campaigns", "select=*&order=sort_order.asc,created_at.desc"),
      listRows("verification_records", "select=*&order=created_at.desc")
    ]);

    return NextResponse.json({
      ok: true,
      data: { inquiries, applications, roles, works, settings, campaigns, verifications }
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Unable to load admin data. Check database configuration and migrations." },
      { status: 500 }
    );
  }
}
