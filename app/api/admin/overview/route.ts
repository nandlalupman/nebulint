import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/admin-auth";
import { fallbackRoles, fallbackWorks } from "../../../../lib/content";
import { isSupabaseConfigured, listRows } from "../../../../lib/supabase/rest";

export async function GET(request: Request) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    if (!isSupabaseConfigured() && process.env.NODE_ENV !== "production") {
      return NextResponse.json({
        ok: true,
        data: {
          inquiries: [
            {
              id: "demo-inquiry-001",
              name: "Aarav Mehta",
              email: "aarav@example.com",
              company: "Demo Industrial Systems",
              project_type: "Computer Vision System",
              timeline: "30-60 days",
              environment: "Hybrid",
              brief: "Demo inquiry for inspection cameras, alert routing, edge inference, and operator dashboards.",
              status: "new",
              created_at: new Date().toISOString()
            }
          ],
          applications: [
            {
              id: "demo-application-001",
              name: "Maya Rao",
              email: "maya@example.com",
              role: "AI/ML Engineer",
              portfolio: "https://github.com/example",
              statement: "Demo application focused on inference APIs, model evaluation, and production ML systems.",
              status: "reviewing",
              created_at: new Date().toISOString()
            }
          ],
          roles: fallbackRoles.map((role, index) => ({ ...role, id: `demo-role-${index + 1}`, sort_order: (index + 1) * 10, is_active: true })),
          works: fallbackWorks.map((work, index) => ({ ...work, id: `demo-work-${index + 1}`, sort_order: (index + 1) * 10, is_active: true }))
        }
      });
    }

    const [inquiries, applications, roles, works] = await Promise.all([
      listRows("project_inquiries", "select=*&order=created_at.desc&limit=100"),
      listRows("career_applications", "select=*&order=created_at.desc&limit=100"),
      listRows("open_roles", "select=*&order=sort_order.asc.nullslast,title.asc"),
      listRows("case_studies", "select=*&order=sort_order.asc.nullslast,title.asc")
    ]);

    return NextResponse.json({
      ok: true,
      data: { inquiries, applications, roles, works }
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Unable to load admin data." },
      { status: 500 }
    );
  }
}
