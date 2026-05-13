"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";

const projectTypes = [
  "Custom AI Development",
  "Computer Vision System",
  "Robotics Platform",
  "AI Automation",
  "Monitoring Dashboard",
  "Backend Infrastructure"
];

type SubmitState = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setState("sending");
    setMessage("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "contact_page" })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Unable to send inquiry.");
      }

      form.reset();
      setState("success");
      setMessage("Inquiry received. NEBULINT will review your technical context and respond within one business day.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Unable to send inquiry.");
    }
  }

  return (
    <form id="project-inquiry" className="contact-form" onSubmit={handleSubmit}>
      <div>
        <span className="form-kicker">Primary client intake</span>
        <h2>Project Inquiry</h2>
        <p>Tell us what you are building. The more technical context you share, the faster we can route it.</p>
      </div>
      <label>
        Name
        <input name="name" placeholder="Your name" required />
      </label>
      <label>
        Work email
        <input name="email" type="email" placeholder="name@company.com" required />
      </label>
      <label>
        Company
        <input name="company" placeholder="Company / organization" />
      </label>
      <label>
        Project type
        <select name="projectType" defaultValue="" required>
          <option value="" disabled>Select project type</option>
          {projectTypes.map((type) => <option key={type}>{type}</option>)}
        </select>
      </label>
      <div className="form-grid">
        <label>
          Timeline
          <select name="timeline" defaultValue="">
            <option value="" disabled>Select timeline</option>
            <option>Immediate evaluation</option>
            <option>30-60 days</option>
            <option>Quarter planning</option>
            <option>Research phase</option>
          </select>
        </label>
        <label>
          Deployment environment
          <select name="environment" defaultValue="">
            <option value="" disabled>Select environment</option>
            <option>Cloud</option>
            <option>On-prem</option>
            <option>Edge / device</option>
            <option>Hybrid</option>
          </select>
        </label>
      </div>
      <label>
        Technical brief
        <textarea name="brief" placeholder="Describe the system, data sources, models, robotics hardware, dashboards, integrations, constraints, or goals." required />
      </label>
      <button type="submit" className="button primary" disabled={state === "sending"}>
        {state === "sending" ? "Sending..." : "Send Inquiry"} <Send size={16} />
      </button>
      {message ? <p className={`form-status ${state}`} role="status">{message}</p> : null}
    </form>
  );
}
