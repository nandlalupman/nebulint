import { NextResponse } from "next/server";
import { createAdminCookie, createAdminSession } from "../../../../lib/admin-auth";
import { supabaseRequest } from "../../../../lib/supabase/rest";
import { apiError } from "../../../../lib/api";
import { email as validEmail, record, text } from "../../../../lib/validation";

type LoginResult = {
  email: string;
  name: string | null;
};

export async function POST(request: Request) {
  try {
    const body = record(await request.json());
    const email = validEmail(body.email).toLowerCase();
    text(body.password, "Password", 256, true);
    const password = body.password as string;

    if (!email || !password) {
      return NextResponse.json({ ok: false, message: "Admin email and password are required." }, { status: 400 });
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

    const sessionToken = await createAdminSession(admin.email);
    const response = NextResponse.json({ ok: true, admin });
    response.headers.append("Set-Cookie", createAdminCookie(sessionToken));

    return response;
  } catch (error) {
    return apiError(error, "Unable to sign in. Please try again later.");
  }
}
