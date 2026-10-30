"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";

const TOPICS = ["Website", "Video edit", "Videography", "Something else"];

// Contact form without a backend: on submit it opens the visitor's email app
// with everything filled in (mailto). Swap `onSubmit` for a form service or a
// server action (e.g. Resend) at deploy time to send directly.
export function ContactForm({ email }: { email: string }) {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const from = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const subject = `${topic} — hello from ${name}`;
    const body = `${message}\n\n— ${name}${from ? ` (${from})` : ""}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-3">
        <legend className="meta mb-3">I&apos;m interested in</legend>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              className={cn("chip", t === topic && "is-active")}
              aria-pressed={t === topic}
              onClick={() => setTopic(t)}
              data-cursor="link"
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field label="Your name" name="name" autoComplete="name" />
        <Field label="Your email" name="email" type="email" autoComplete="email" />
      </div>
      <Field label="Tell me about it" name="message" multiline />

      <div className="flex flex-wrap items-center gap-6">
        <button type="submit" className="btn-pill" data-cursor="magnetic">
          Send message →
        </button>
        <p className="meta" aria-live="polite">
          {sent ? `Opening your email app… or write to ${email}` : "Opens your email app, ready to send"}
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  multiline,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
}) {
  const id = `contact-${name}`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="meta">
        {label}
      </label>
      {multiline ? (
        <textarea id={id} name={name} required rows={4} className="field" data-cursor="text" />
      ) : (
        <input id={id} name={name} type={type} required autoComplete={autoComplete} className="field" data-cursor="text" />
      )}
    </div>
  );
}
