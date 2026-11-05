import { NextResponse } from "next/server";
import { requireAdmin, revokeAdminSession } from "../../../../lib/admin-auth";

function readCookie(request: Request, name: string) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  try { return match ? decodeURIComponent(match.slice(name.length + 1)) : ""; } catch { return ""; }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok && auth.response.status !== 401) return auth.response;
  const sessionToken = readCookie(request, "nebulint_admin_session");
  await revokeAdminSession(sessionToken);
  const response = NextResponse.json({ ok: true, message: "Signed out." });
  response.headers.set("Set-Cookie", "nebulint_admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
  return response;
}
