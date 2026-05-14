import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../../lib/admin-auth";
import { isSupabaseConfigured, updateRow } from "../../../../../lib/supabase/rest";

const allowedFields = ["title", "summary", "category", "image_url", "sort_order", "is_active"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const body = await request.json();
    const update: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (field in body) update[field] = body[field];
    }

    update.updated_at = new Date().toISOString();

    if (!isSupabaseConfigured() && process.env.NODE_ENV !== "production") {
      return NextResponse.json({ ok: true, work: [{ id, ...update }] });
    }

    const work = await updateRow("case_studies", id, update);
    return NextResponse.json({ ok: true, work });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Unable to update work item." },
      { status: 500 }
    );
  }
}
