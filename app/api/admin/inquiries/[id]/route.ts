import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../../lib/admin-auth";
import { updateRow, deleteRow } from "../../../../../lib/supabase/rest";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const body = await request.json();
    const status = typeof body.status === "string" ? body.status.trim() : "";

    if (!status) {
      return NextResponse.json({ ok: false, message: "Status is required." }, { status: 400 });
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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;

    await deleteRow("project_inquiries", id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Unable to delete inquiry." },
      { status: 500 }
    );
  }
}
