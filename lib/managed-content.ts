import { NextResponse } from "next/server";
import { requireAdmin } from "./admin-auth";
import { apiError } from "./api";
import { deleteRow, insertRow, listRows, updateRow } from "./supabase/rest";
import { boolean, choice, date, record, safeUrl, sortOrder, text, ValidationError } from "./validation";

export type ContentKind = "campaigns" | "verifications" | "roles" | "works";
const tables = { campaigns: "campaigns", verifications: "verification_records", roles: "open_roles", works: "case_studies" };

export function validateContent(kind: ContentKind, body: Record<string, unknown>) {
  if (kind === "verifications") {
    const code = text(body.verification_code, "Verification ID", 80, true).toUpperCase();
    if (!/^[A-Z0-9][A-Z0-9-]{5,79}$/.test(code)) throw new ValidationError("Verification ID must be 6–80 letters, numbers or hyphens.");
    const start = date(body.start_date, "Start date", true);
    const end = date(body.end_date, "End date");
    if (end && start && end < start) throw new ValidationError("End date cannot be before start date.");
    return {
      verification_code: code,
      full_name: text(body.full_name, "Full name", 160, true),
      record_type: choice(body.record_type, ["internship", "employment", "association"], "record type"),
      role: text(body.role, "Role / program", 200, true),
      department: text(body.department, "Department", 160) || null,
      start_date: start, end_date: end,
      status: choice(body.status, ["active", "completed", "revoked"], "record status"),
      description: text(body.description, "Public details", 5000) || null,
      is_public: boolean(body.is_public)
    };
  }
  const common = {
    title: text(body.title, "Title", 200, true),
    summary: text(body.summary, "Summary", 2000, kind !== "roles"),
    sort_order: sortOrder(body.sort_order),
    is_active: boolean(body.is_active, kind !== "campaigns")
  };
  if (kind === "roles") return { ...common, department: text(body.department, "Department", 160) || null, location: text(body.location, "Location", 200) || null, type: text(body.type, "Type", 100) || null };
  const visual = { ...common, category: text(body.category, "Category", 100) || null, image_url: safeUrl(body.image_url, "Image URL") || null };
  if (kind === "works") return visual;
  const start = date(body.start_date, "Start date");
  const end = date(body.end_date, "End date");
  if (start && end && end < start) throw new ValidationError("End date cannot be before start date.");
  return { ...visual, details: text(body.details, "Campaign details", 15000, true), start_date: start, end_date: end, cta_label: text(body.cta_label, "Button label", 80) || null, cta_url: safeUrl(body.cta_url, "Button URL", true) || null };
}

export async function createContent(request: Request, kind: ContentKind) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;
    const value = validateContent(kind, record(await request.json()));
    const rows = await insertRow(tables[kind], value);
    return NextResponse.json({ ok: true, rows }, { status: 201 });
  } catch (error) { return apiError(error, "Unable to create record. Check the fields and ensure verification IDs are unique."); }
}

export async function changeContent(request: Request, kind: ContentKind, params: Promise<{ id: string }>) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;
    const { id } = await params;
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new ValidationError("Invalid record ID.");
    const existing = await listRows<Record<string, unknown>>(tables[kind], `select=*&id=eq.${id}&limit=1`);
    if (!existing[0]) return NextResponse.json({ ok: false, message: "Record not found." }, { status: 404 });
    if (request.method === "DELETE") {
      await deleteRow(tables[kind], id);
      return NextResponse.json({ ok: true });
    }
    const value = validateContent(kind, { ...existing[0], ...record(await request.json()) });
    const rows = await updateRow(tables[kind], id, { ...value, updated_at: new Date().toISOString() });
    return NextResponse.json({ ok: true, rows });
  } catch (error) { return apiError(error, "Unable to change record. Check the fields and ensure verification IDs are unique."); }
}
