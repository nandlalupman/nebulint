import { NextResponse } from "next/server";
import { createAdminCookie, createAdminSession } from "../../../../lib/admin-auth";
import { isSupabaseConfigured, supabaseRequest } from "../../../../lib/supabase/rest";

type LoginResult = {
  email: string;
  name: string | null;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = clean(body.email).toLowerCase();
    const password = clean(body.password);

    if (!email || !password) {
      return NextResponse.json({ ok: false, message: "Admin email and password are required." }, { status: 400 });
    }

    if (!isSupabaseConfigured() && process.env.NODE_ENV !== "production") {
      const demoEmail = (process.env.DEV_ADMIN_EMAIL || "admin@nebulint.local").toLowerCase();
      const demoPassword = process.env.DEV_ADMIN_PASSWORD || "NebulintAdmin123!";

      if (email !== demoEmail || password !== demoPassword) {
        return NextResponse.json({ ok: false, message: "Invalid local demo admin credentials." }, { status: 401 });
      }

      const sessionToken = createAdminSession(demoEmail);
      const response = NextResponse.json({ ok: true, admin: { email: demoEmail, name: "NEBULINT Demo Admin" } });
      response.headers.append("Set-Cookie", createAdminCookie(sessionToken));

      return response;
    }

    const result = await supabaseRequest<LoginResult[]>("rpc/verify_admin_login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        admin_email: email,
        admin_password: password
      })
    });

    const admin = result[0];
    if (!admin) {
      return NextResponse.json({ ok: false, message: "Invalid admin credentials." }, { status: 401 });
    }

    const sessionToken = createAdminSession(admin.email);
    const response = NextResponse.json({ ok: true, admin });
    response.headers.append("Set-Cookie", createAdminCookie(sessionToken));

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sign in.";
    const status = message.includes("Supabase is not configured") ? 503 : 500;

    return NextResponse.json({ ok: false, message }, { status });
  }
}
