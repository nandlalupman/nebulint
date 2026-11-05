import { apiError } from "../../../../../lib/api";
import { choice, record } from "../../../../../lib/validation";
import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../../lib/admin-auth";
import { updateRow, deleteRow } from "../../../../../lib/supabase/rest";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const body = record(await request.json());
    const status = choice(body.status, ["new", "reviewing", "qualified", "contacted", "closed"], "review status");

    if (!status) {
      return NextResponse.json({ ok: false, message: "Status is required." }, { status: 400 });
    }

    const inquiry = await updateRow("project_inquiries", id, { status });
    return NextResponse.json({ ok: true, inquiry });
  } catch (error) {
    return apiError(error, "Unable to update inquiry.");
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;

    await deleteRow("project_inquiries", id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error, "Unable to delete inquiry.");
  }
}
