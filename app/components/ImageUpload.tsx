"use client";

import { useState } from "react";
import { ContentImage } from "./ContentImage";

export function ImageUpload({ value, onChange, onBusy }: { value: string; onChange: (url: string) => void; onBusy?: (busy: boolean) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  async function upload(file?: File) {
    if (!file) return;
    setError("");
    if (file.size > 3 * 1024 * 1024) { setError("Image must be 3 MB or smaller."); return; }
    setUploading(true); onBusy?.(true);
    try {
      const data = new FormData(); data.set("file", file);
      const response = await fetch("/api/admin/uploads", { method: "POST", body: data });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Upload failed.");
      onChange(payload.url);
    } catch (error) { setError(error instanceof Error ? error.message : "Upload failed."); }
    finally { setUploading(false); onBusy?.(false); }
  }
  return <div className="image-upload">
    <label>Image URL<input type="url" value={value} onChange={event => onChange(event.target.value)} placeholder="https://…" disabled={uploading} /></label>
    <label>Or upload an image<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={event => { void upload(event.target.files?.[0]); event.target.value = ""; }} /></label>
    <small>{uploading ? "Uploading…" : "JPG, PNG or WebP · up to 3 MB. Uploads are public; use approved images."}</small>
    {value ? <><ContentImage src={value} alt="Image preview" className="admin-upload-preview" /><button className="admin-cancel-edit-btn" type="button" disabled={uploading} onClick={() => onChange("")}>Remove image from record</button></> : null}
    {error ? <p role="alert" className="admin-message">{error}</p> : null}
  </div>;
}
