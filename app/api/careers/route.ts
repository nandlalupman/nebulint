import { NextResponse } from "next/server";
import { createCareerApplication } from "../../../lib/supabase/rest";
import { apiError } from "../../../lib/api";
import { email as validEmail, record, safeUrl, text } from "../../../lib/validation";

export async function POST(request: Request) {
  try {
    const body = record(await request.json());
    const name = text(body.name, "Name", 160, true);
    const email = validEmail(body.email);
    const role = text(body.role, "Role", 200, true);
    const portfolio = safeUrl(body.portfolio, "Portfolio");
    const statement = text(body.statement, "Engineering statement", 15000, true);

    if (!name || !email || !role || !statement) {
      return NextResponse.json(
        { ok: false, message: "Name, email, role, and engineering statement are required." },
        { status: 400 }
      );
    }

    await createCareerApplication({
      name,
      email,
      role,
      portfolio,
      statement,
      source: "careers_page"
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error, "Unable to submit application. Please try again later.");
  }
}
