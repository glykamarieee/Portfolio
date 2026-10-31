"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ComponentProps, type FormEvent } from "react";
import { CurrentYear } from "@/components/system/FooterWordmark";
import { MediaImage } from "@/components/ui/MediaImage";
import { readBrief } from "@/lib/brief";
import { cn } from "@/lib/cn";

const TOPICS = ["Website", "Video edit", "Videography", "Something else"];
// The topic each craft from a "Let's work together" brief lands on
const CRAFT_TOPIC = { Code: "Website", Cut: "Video edit", Capture: "Videography" } as const;

const noop = () => () => {};

type ContactFormProps = {
  email: string;
  /** Printed in the postcard's address block. */
  to: string;
  location: string;
  portrait: ComponentProps<typeof MediaImage>["media"];
};

// The contact form as a postcard: the message on the left, the sender's
// address on the right, a postage stamp (my portrait) and a postmark. No
// backend: on submit it opens the visitor's email app with everything filled
// in (mailto) and a "Sent" postmark lands. Swap `onSubmit` for a form service
// or a server action (e.g. Resend) at deploy time to send directly.
export function ContactForm({ email, to, location, portrait }: ContactFormProps) {
  // Arriving from a "Let's work together" brief (?need=…&for=…): the topic
  // starts on the first craft picked and the message is started for them
  const search = useSyncExternalStore(
    noop,
    () => window.location.search,
    () => "",
  );
  const brief = readBrief(search);
  const [picked, setTopic] = useState<string>();
  const topic = picked ?? (brief?.need[0] ? CRAFT_TOPIC[brief.need[0]] : TOPICS[0]);
  const [sent, setSent] = useState(false);
  const messageField = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const brief = readBrief(search);
    const field = messageField.current;
    if (!brief || !field || field.value) return;
    const crafts = brief.need.length ? brief.need.join(" + ").toLowerCase() : "a hand";
    const purpose = brief.purpose ? ` for ${brief.purpose.toLowerCase()}` : "";
    field.value = `Hi! I'm looking for ${crafts}${purpose}. Here's the idea: `;
  }, [search]);

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
    <form data-postcard onSubmit={onSubmit} className="postcard" data-sent={sent || undefined}>
      <div className="postcard-top">
        <p className="postcard-title">Postcard</p>
        <div data-postage className="postage" aria-hidden="true">
          <span className="postage-photo">
            <MediaImage media={portrait} sizes="96px" quality={90} />
          </span>
          <span className="postage-value">Air mail</span>
        </div>
        <span data-postmark className="postmark" aria-hidden="true">
          <span>{location.split(",")[0]}</span>
          <span className="postmark-year">
            <CurrentYear />
          </span>
        </span>
      </div>

      <div className="postcard-body">
        <div className="postcard-write">
          <fieldset className="flex flex-col gap-3">
            <legend className="postcard-label mb-3">I&apos;m interested in</legend>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={cn("postcard-chip", t === topic && "is-active")}
                  aria-pressed={t === topic}
                  onClick={() => setTopic(t)}
                  data-cursor="link"
                >
                  {t}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-message" className="postcard-greeting">
              Dear {to.split(" ")[0]},
            </label>
            <textarea
              ref={messageField}
              id="contact-message"
              name="message"
              required
              rows={6}
              placeholder="Tell me about it…"
              className="postcard-field postcard-lines"
              data-cursor="text"
            />
          </div>
        </div>

        <div className="postcard-address">
          <Field label="From" name="name" placeholder="Your name" autoComplete="name" />
          <Field label="Reply to" name="email" type="email" placeholder="you@email.com" autoComplete="email" />
          <div className="postcard-to">
            <span className="postcard-label">To</span>
            <span className="postcard-strong">{to}</span>
            <span>{location}</span>
          </div>
        </div>
      </div>

      <div className="postcard-foot">
        <button type="submit" className="btn-pill" data-cursor="magnetic">
          Send postcard →
        </button>
        <p className="postcard-label" aria-live="polite">
          {sent ? `Opening your email app… or write to ${email}` : "Opens your email app, ready to send"}
        </p>
      </div>

      <span className="postcard-sent" aria-hidden="true">
        Sent ✓
      </span>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  autoComplete: string;
}) {
  const id = `contact-${name}`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="postcard-label">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="postcard-field"
        data-cursor="text"
      />
    </div>
  );
}
