"use client";

import { useEffect, useRef, useState } from "react";
import { interaction } from "@/lib/motion";
import { cn } from "@/lib/cn";

type CopyEmailProps = {
  email: string;
  className?: string;
};

// Copies the email; the label morphs to "Copied ✓" and back.
export function CopyEmail({ email, className }: CopyEmailProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      window.location.href = `mailto:${email}`;
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), interaction.copiedResetMs);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={cn("copy-email", className)}
      data-copied={copied || undefined}
      data-magnetic-inner
    >
      <span className="copy-email-track">
        <span className="copy-email-label">{email}</span>
        <span className="copy-email-label text-accent-fg" aria-hidden="true">
          Copied ✓
        </span>
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email copied to clipboard" : ""}
      </span>
    </button>
  );
}
