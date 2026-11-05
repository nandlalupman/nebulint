import { NextResponse } from "next/server";
import { createProjectInquiry, ProjectInquiry } from "../../../lib/supabase/rest";
import { apiError } from "../../../lib/api";
import { email, record, text } from "../../../lib/validation";

export async function POST(request: Request) {
  try {
    const body = record(await request.json());
    const inquiry: ProjectInquiry = {
      name: text(body.name, "Name", 160, true),
      email: email(body.email),
      company: text(body.company, "Company", 200),
      projectType: text(body.projectType, "Project type", 200, true),
      timeline: text(body.timeline, "Timeline", 200),
      environment: text(body.environment, "Environment", 200),
      brief: text(body.brief, "Technical brief", 15000, true),
      source: "contact_page"
    };

    if (!inquiry.name || !inquiry.email || !inquiry.projectType || !inquiry.brief) {
      return NextResponse.json(
        { ok: false, message: "Name, work email, project type, and technical brief are required." },
        { status: 400 }
      );
    }

    await createProjectInquiry(inquiry);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error, "Unable to send inquiry. Please try again later.");
  }
}
