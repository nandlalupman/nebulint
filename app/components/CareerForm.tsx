"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import type { OpenRole } from "../../lib/supabase/rest";

type SubmitState = "idle" | "sending" | "success" | "error";

export function CareerForm({ roles }: { roles: OpenRole[] }) {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setState("sending");
    setMessage("");

    try {
      const response = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "careers_page" })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Unable to submit profile.");
      }

      form.reset();
      setState("success");
      setMessage("Profile received. NEBULINT will review your engineering background and role fit.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Unable to submit profile.");
    }
  }

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <div>
        <h2>Talent Profile</h2>
        <p>Share your engineering focus, project history, and the systems you want to build.</p>
      </div>
      <label>
        Full name
        <input name="name" placeholder="Your name" required />
      </label>
      <label>
        Email
        <input name="email" type="email" placeholder="you@example.com" required />
      </label>
      <label>
        Role interest
        <select name="role" defaultValue="" required>
          <option value="" disabled>Select a role</option>
          {roles.map((role) => <option key={role.id || role.title}>{role.title}</option>)}
        </select>
      </label>
      <label>
        Portfolio / GitHub
        <input name="portfolio" placeholder="https://" />
      </label>
      <label>
        Engineering statement
        <textarea name="statement" placeholder="Tell us about systems, models, robotics, or infrastructure you have built." required />
      </label>
      <button type="submit" className="button primary" disabled={state === "sending"}>
        {state === "sending" ? "Submitting..." : "Submit Profile"} <Send size={16} />
      </button>
      {message ? <p className={`form-status ${state}`} role="status">{message}</p> : null}
    </form>
  );
}
