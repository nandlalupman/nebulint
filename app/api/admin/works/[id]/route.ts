import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../../lib/admin-auth";
import { updateRow } from "../../../../../lib/supabase/rest";

const allowedFields = ["title", "summary", "category", "image_url", "sort_order", "is_active"];

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const update: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (field in body) update[field] = body[field];
    }

    update.updated_at = new Date().toISOString();

    const work = await updateRow("case_studies", params.id, update);
    return NextResponse.json({ ok: true, work });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Unable to update work item." },
      { status: 500 }
    );
  }
}
