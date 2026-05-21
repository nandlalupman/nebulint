import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true, message: "Signed out." });
  response.headers.set(
    "Set-Cookie",
    "nebulint_admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
  );
  return response;
}
