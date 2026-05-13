import { NextResponse } from "next/server";
import { createProjectInquiry, ProjectInquiry } from "../../../lib/supabase/rest";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const inquiry: ProjectInquiry = {
      name: clean(body.name),
      email: clean(body.email),
      company: clean(body.company),
      projectType: clean(body.projectType),
      timeline: clean(body.timeline),
      environment: clean(body.environment),
      brief: clean(body.brief),
      source: clean(body.source) || "website"
    };

    if (!inquiry.name || !inquiry.email || !inquiry.projectType || !inquiry.brief) {
      return NextResponse.json(
        { ok: false, message: "Name, work email, project type, and technical brief are required." },
        { status: 400 }
      );
    }

    const rows = await createProjectInquiry(inquiry);
    return NextResponse.json({ ok: true, inquiry: Array.isArray(rows) ? rows[0] : rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to process inquiry.";
    const status = message.includes("Supabase is not configured") ? 503 : 500;
    return NextResponse.json(
      {
        ok: false,
        message: status === 503
          ? "Inquiry backend is not configured yet. Add Supabase environment variables in Vercel."
          : message
      },
      { status }
    );
  }
}
