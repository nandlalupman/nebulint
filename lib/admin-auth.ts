import { NextResponse } from "next/server";

export function requireAdmin(request: Request) {
  const expected = process.env.ADMIN_TOKEN;
  const authorization = request.headers.get("authorization") || "";
  const bearer = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const token = request.headers.get("x-admin-token") || bearer;

  if (!expected) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { ok: false, message: "ADMIN_TOKEN is not configured in the deployment environment." },
        { status: 503 }
      )
    };
  }

  if (token !== expected) {
    return {
      ok: false as const,
      response: NextResponse.json({ ok: false, message: "Unauthorized admin request." }, { status: 401 })
    };
  }

  return { ok: true as const };
}
