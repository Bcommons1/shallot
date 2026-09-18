"use client";
import { useState, type FormEvent } from "react";

export function InquiryForm({ enabled }: { enabled: boolean }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        name: data.get("name"), email: data.get("email"), type: data.get("type"), message: data.get("message"),
        consent: data.get("consent") === "on", website: data.get("website") ?? "",
      }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We couldn't save your inquiry. Please try again.");
      setStatus("success");
      setMessage("Thank you. Your inquiry has been received. This is not a confirmed booking or order.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }
  return <form className="inquiry-form" onSubmit={submit} aria-describedby="inquiry-note">
    <p id="inquiry-note" className="form-note">{enabled ? "Have a question or a gathering in mind? Leave a note for Shallot." : "Preview form · Online inquiries are not available yet. Nothing entered here will be sent or saved."}</p>
    <fieldset disabled={!enabled || status === "sending"}>
      <legend className="sr-only">Contact Shallot</legend>
      <div className="form-row">
        <label>Your name<input autoComplete="name" name="name" required minLength={2} maxLength={100} placeholder="Name" /></label>
        <label>Email address<input autoComplete="email" name="email" type="email" required maxLength={254} placeholder="you@example.com" /></label>
      </div>
      <label>What’s on your mind?<select name="type"><option value="general">A general question</option><option value="catering">A catering inquiry</option></select></label>
      <label>Your message<textarea name="message" rows={4} required minLength={10} maxLength={3000} placeholder="Tell us a little about it…" /></label>
      <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <label className="consent"><input name="consent" type="checkbox" required /> <span>I agree to share my name, email, and message with Shallot so the team can reply.</span></label>
      <button className="button" type="submit">{status === "sending" ? "Sending…" : enabled ? "Send an inquiry ↗" : "Inquiries coming soon"}</button>
    </fieldset>
    <p className={`form-status ${status}`} role="status" aria-live="polite">{message}</p>
    <p className="fine-print">Inquiry details are used to respond to your request. Please don’t include payment details or other sensitive information.</p>
  </form>;
}
