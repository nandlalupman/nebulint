import { NextResponse } from "next/server";
import { revokeAdminSession } from "../../../../lib/admin-auth";

function readCookie(request: Request, name: string) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
}

export async function POST(request: Request) {
  const sessionToken = readCookie(request, "nebulint_admin_session");
  await revokeAdminSession(sessionToken);
  const response = NextResponse.json({ ok: true, message: "Signed out." });
  response.headers.set("Set-Cookie", "nebulint_admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
  return response;
}
