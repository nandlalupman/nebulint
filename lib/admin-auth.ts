import { NextResponse } from "next/server";
import { deleteRowByColumn, insertRow, listRows } from "./supabase/rest";

const cookieName = "nebulint_admin_session";
const sessionDurationMs = 1000 * 60 * 60 * 12;

function readCookie(request: Request, name: string) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
}

function makeSessionToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function createAdminSession(email: string) {
  const token = makeSessionToken();
  const expiresAt = new Date(Date.now() + sessionDurationMs).toISOString();

  await insertRow("admin_sessions", {
    token,
    email: email.toLowerCase(),
    expires_at: expiresAt
  });

  return token;
}

export function createAdminCookie(sessionToken: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${cookieName}=${encodeURIComponent(sessionToken)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 12}${secure}`;
}

async function verifyAdminSession(sessionToken: string) {
  if (!sessionToken) return false;

  const sessions = await listRows<{ token: string; email: string; expires_at: string }>(
    "admin_sessions",
    `select=token,email,expires_at&token=eq.${encodeURIComponent(sessionToken)}&limit=1`
  );

  const session = sessions[0];
  if (!session) return false;

  return new Date(session.expires_at).getTime() > Date.now();
}

async function clearExpiredAdminSessions() {
  const now = new Date().toISOString();
  try {
    const sessions = await listRows<{ token: string }>(
      "admin_sessions",
      `select=token&expires_at=lt.${encodeURIComponent(now)}`
    );

    await Promise.all(sessions.map((session) => deleteRowByColumn("admin_sessions", "token", session.token)));
  } catch {
    // Best-effort cleanup only.
  }
}

export async function requireAdmin(request: Request) {
  const sessionToken = readCookie(request, cookieName);

  await clearExpiredAdminSessions();

  if (await verifyAdminSession(sessionToken)) {
    return { ok: true as const };
  }

  return {
    ok: false as const,
    response: NextResponse.json(
      { ok: false, message: "Admin session is missing. Sign in with Supabase admin credentials." },
      { status: 401 }
    )
  };
}

export async function revokeAdminSession(sessionToken: string) {
  if (!sessionToken) return;
  await deleteRowByColumn("admin_sessions", "token", sessionToken);
}
