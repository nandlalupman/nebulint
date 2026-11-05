import { NextResponse } from "next/server";
import { ValidationError } from "./validation";

export function apiError(error: unknown, message: string) {
  if (error instanceof ValidationError || error instanceof SyntaxError) {
    return NextResponse.json({ ok: false, message: error instanceof SyntaxError ? "Invalid request body." : error.message }, { status: 400 });
  }
  console.error(message, error);
  const unavailable = error instanceof Error && error.message.includes("Supabase is not configured");
  return NextResponse.json({ ok: false, message: unavailable ? "This service is temporarily unavailable. Please contact NEBULINT directly." : message }, { status: unavailable ? 503 : 500 });
}
