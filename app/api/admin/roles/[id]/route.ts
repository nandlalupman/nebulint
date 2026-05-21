import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../../lib/admin-auth";
import { updateRow, deleteRow } from "../../../../../lib/supabase/rest";

const allowedFields = ["title", "summary", "department", "location", "type", "sort_order", "is_active"];

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

    const role = await updateRow("open_roles", id, update);
    return NextResponse.json({ ok: true, role });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Unable to update role." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;

    await deleteRow("open_roles", id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Unable to delete role." },
      { status: 500 }
    );
  }
}
