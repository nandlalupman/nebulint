import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../../lib/admin-auth";
import { isSupabaseConfigured, updateRow } from "../../../../../lib/supabase/rest";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const body = await request.json();
    const status = typeof body.status === "string" ? body.status.trim() : "";

    if (!status) {
      return NextResponse.json({ ok: false, message: "Status is required." }, { status: 400 });
    }

    if (!isSupabaseConfigured() && process.env.NODE_ENV !== "production") {
      return NextResponse.json({ ok: true, inquiry: [{ id, status }] });
    }

    const inquiry = await updateRow("project_inquiries", id, { status });
    return NextResponse.json({ ok: true, inquiry });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Unable to update inquiry." },
      { status: 500 }
    );
  }
}
