import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/admin-auth";
import { apiError } from "../../../../lib/api";
import { getSupabaseConfig } from "../../../../lib/supabase/rest";
import { ValidationError } from "../../../../lib/validation";

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;
    if (Number(request.headers.get("content-length")) > 4 * 1024 * 1024) throw new ValidationError("Image must be 3 MB or smaller.");
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || !file.size || file.size > 3 * 1024 * 1024) throw new ValidationError("Choose an image up to 3 MB.");
    const data = new Uint8Array(await file.arrayBuffer());
    let extension = "";
    if (file.type === "image/jpeg" && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) extension = "jpg";
    if (file.type === "image/png" && [137, 80, 78, 71, 13, 10, 26, 10].every((byte, i) => data[i] === byte)) extension = "png";
    if (file.type === "image/webp" && new TextDecoder().decode(data.slice(0, 4)) === "RIFF" && new TextDecoder().decode(data.slice(8, 12)) === "WEBP") extension = "webp";
    if (!extension) throw new ValidationError("Only valid JPG, PNG and WebP images are supported.");
    const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();
    const path = `images/${crypto.randomUUID()}.${extension}`;
    const base = `${supabaseUrl.replace(/\/$/, "")}/storage/v1`;
    const response = await fetch(`${base}/object/site-media/${path}`, {
      method: "POST",
      headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}`, "Content-Type": file.type, "x-upsert": "false" },
      body: data
    });
    if (!response.ok) throw new Error(`Storage upload failed (${response.status}).`);
    return NextResponse.json({ ok: true, url: `${base}/object/public/site-media/${path}` }, { status: 201 });
  } catch (error) { return apiError(error, "Image upload failed. Check the site-media storage bucket configuration."); }
}
