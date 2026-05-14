import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/admin-auth";
import { insertRow } from "../../../../lib/supabase/rest";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const title = clean(body.title);
    const summary = clean(body.summary);

    if (!title || !summary) {
      return NextResponse.json({ ok: false, message: "Work title and summary are required." }, { status: 400 });
    }

    const work = await insertRow("case_studies", {
      title,
      summary,
      category: clean(body.category) || null,
      image_url: clean(body.image_url) || null,
      sort_order: Number(body.sort_order || 100),
      is_active: body.is_active !== false
    });

    return NextResponse.json({ ok: true, work });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Unable to create work item." },
      { status: 500 }
    );
  }
}
