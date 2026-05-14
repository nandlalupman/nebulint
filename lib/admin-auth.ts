import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

const cookieName = "nebulint_admin_session";
const sessionDurationMs = 1000 * 60 * 60 * 12;

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_TOKEN || "";
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

function readCookie(request: Request, name: string) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
}

export function createAdminSession(email: string) {
  if (!getSecret()) {
    throw new Error("ADMIN_SESSION_SECRET or ADMIN_TOKEN is required for admin sessions.");
  }

  const payload = Buffer.from(
    JSON.stringify({ email, exp: Date.now() + sessionDurationMs }),
    "utf8"
  ).toString("base64url");
  const signature = sign(payload);

  return `${payload}.${signature}`;
}

export function createAdminCookie(sessionToken: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${cookieName}=${encodeURIComponent(sessionToken)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 12}${secure}`;
}

function verifyAdminSession(sessionToken: string) {
  if (!sessionToken || !getSecret()) return false;

  const [payload, signature] = sessionToken.split(".");
  if (!payload || !signature || !safeEqual(sign(payload), signature)) return false;

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: number };
    return Boolean(decoded.exp && decoded.exp > Date.now());
  } catch {
    return false;
  }
}

export function requireAdmin(request: Request) {
  const expected = process.env.ADMIN_TOKEN;
  const authorization = request.headers.get("authorization") || "";
  const bearer = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const token = request.headers.get("x-admin-token") || bearer;
  const sessionToken = readCookie(request, cookieName);

  if (verifyAdminSession(sessionToken)) {
    return { ok: true as const };
  }

  if (!expected) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { ok: false, message: "Admin session is missing. Sign in with Supabase admin credentials." },
        { status: getSecret() ? 401 : 503 }
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
