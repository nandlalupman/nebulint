import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/admin-auth";
import { getSiteSettings, upsertSetting } from "../../../../lib/supabase/rest";

const defaultSettings: Record<string, Record<string, unknown>> = {
  company: {
    name: "NEBULINT",
    tagline: "Intelligent Infrastructure",
    description: "Enterprise AI infrastructure, robotics platforms, computer vision systems, and real-time operational technology.",
    email: "contact@nebulint.com",
    phone: "+1 (555) 000-0000"
  },
  social: {
    linkedin: "",
    github: "",
    twitter: ""
  },
  hero: {
    title: "Engineering Intelligence For Real-World Systems",
    subtitle: "NEBULINT builds AI, robotics, and infrastructure platforms that monitor, analyze, and act.",
    cta_text: "Start a Project",
    cta_url: "/contact"
  }
};

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const settings = await getSiteSettings();
    const merged = Object.entries(defaultSettings).map(([key, defaults]) => {
      const existing = settings.find((s) => s.setting_key === key);
      return existing || { setting_key: key, setting_value: defaults };
    });

    return NextResponse.json({ ok: true, settings: merged });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Unable to load settings." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const key = typeof body.key === "string" ? body.key.trim() : "";
    const value = body.value;

    if (!key || typeof value !== "object") {
      return NextResponse.json({ ok: false, message: "Setting key and value object are required." }, { status: 400 });
    }

    const result = await upsertSetting(key, value);
    return NextResponse.json({ ok: true, setting: result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Unable to save settings." },
      { status: 500 }
    );
  }
}
