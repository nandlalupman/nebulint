import { NextResponse } from "next/server";
import { listRows } from "../../../lib/supabase/rest";
import { apiError } from "../../../lib/api";
import { record, text, ValidationError } from "../../../lib/validation";

export async function POST(request: Request) {
  try {
    const body = record(await request.json());
    const code = text(body.code, "Verification ID", 80, true).toUpperCase();
    if (!/^[A-Z0-9][A-Z0-9-]{5,79}$/.test(code)) throw new ValidationError("Enter a valid verification ID (6–80 letters, numbers or hyphens).");
    const rows = await listRows("verification_records", `select=verification_code,full_name,record_type,role,department,start_date,end_date,status,description&verification_code=eq.${encodeURIComponent(code)}&is_public=eq.true&limit=1`);
    const response = NextResponse.json({ ok: true, record: rows[0] || null });
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  } catch (error) { return apiError(error, "Verification is temporarily unavailable. Please contact NEBULINT to verify this record."); }
}
