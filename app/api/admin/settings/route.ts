import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/admin-auth";
import { getSiteSettings, upsertSetting } from "../../../../lib/supabase/rest";
import { apiError } from "../../../../lib/api";
import { email, record, safeUrl, text, ValidationError } from "../../../../lib/validation";

const defaultSettings: Record<string, Record<string, unknown>> = {
  company: {
    name: "NEBULINT",
    tagline: "Intelligent Infrastructure",
    description: "Enterprise AI infrastructure, robotics platforms, computer vision systems, and real-time operational technology.",
    email: "contact@nebulint.com",
    phone: ""
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
    const body = record(await request.json());
    const key = typeof body.key === "string" ? body.key.trim() : "";
    const value = record(body.value);

    if (!(Object.hasOwn(defaultSettings, key))) throw new ValidationError("Unknown setting group.");
    const clean: Record<string, string> = {};
    for (const field of Object.keys(defaultSettings[key])) {
      clean[field] = text(value[field], field, field === "description" || field === "subtitle" ? 2000 : 500);
      if (["linkedin", "github", "twitter"].includes(field)) clean[field] = safeUrl(clean[field], field);
      if (field === "cta_url") clean[field] = safeUrl(clean[field], field, true);
      if (field === "email" && clean[field]) clean[field] = email(clean[field]);
    }
    const result = await upsertSetting(key, clean);
    return NextResponse.json({ ok: true, setting: result });
  } catch (error) {
    return apiError(error, "Unable to save settings.");
  }
}
