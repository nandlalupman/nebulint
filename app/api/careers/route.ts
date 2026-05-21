import { NextResponse } from "next/server";
import { createCareerApplication } from "../../../lib/supabase/rest";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = clean(body.name);
    const email = clean(body.email);
    const role = clean(body.role);
    const portfolio = clean(body.portfolio);
    const statement = clean(body.statement);

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
      source: clean(body.source) || "careers_page"
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit application.";
    const status = message.includes("Supabase is not configured") ? 503 : 500;

    return NextResponse.json(
      {
        ok: false,
        message:
          status === 503
            ? "Career intake is ready, but Supabase environment variables are not configured yet."
            : message
      },
      { status }
    );
  }
}
