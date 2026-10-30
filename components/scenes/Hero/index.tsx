"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import { heroCards, site, type HeroCard } from "@/content";
import { TransitionLink } from "@/components/system/TransitionLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { MediaImage } from "@/components/ui/MediaImage";
import { dur, ease, gsap, isReady, mq, onReady, stagger, useGSAP, whenIdle } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { CardArt } from "./CardArt";

const words = (text: string) => text.trim().split(/\s+/).filter(Boolean);

// Scene 0 — centered headline with an inline image, ringed by tilted cover
// cards. On load the cards rise from a stack at the bottom and fan out; on
// scroll they drift outward by depth. Static layout under reduced motion.
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [before, after = ""] = site.headline.split("[img]");

  useGSAP((_, contextSafe) => {
    const el = root.current!;
    const mm = gsap.matchMedia();
    mm.add(mq.motion, () => {
      // Resting geometry from offsets (unaffected by scroll or transforms), relative
      // to the section center. Hidden cards (this breakpoint) are skipped.
      const geometry = () => {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        return gsap.utils
          .toArray<HTMLElement>("[data-hero-card]", el)
          .filter((slot) => slot.offsetParent !== null)
          .map((slot) => ({
            slot,
            x: slot.offsetLeft + slot.offsetWidth / 2 - w / 2,
            y: slot.offsetTop + slot.offsetHeight / 2 - h / 2,
            w: slot.offsetWidth,
            h,
            depth: Number(slot.dataset.depth),
          }))
          .sort((p, q) => p.x - q.x); // fan out left to right
      };
      const cards = geometry();
      const mid = (cards.length - 1) / 2;

      const intro = gsap.timeline({ paused: !isReady() });
      intro
        .from(gsap.utils.toArray("[data-word]", el), {
          yPercent: 70,
          autoAlpha: 0,
          duration: dur.slow,
          ease: ease.reveal,
          stagger: stagger.words,
        })
        .from(
          gsap.utils.toArray("[data-fade]", el),
          { y: 16, autoAlpha: 0, duration: dur.base, ease: ease.reveal, stagger: stagger.items },
          0.35,
        );
      cards.forEach((c, i) => {
        intro.from(
          c.slot.querySelector("[data-card-intro]"),
          {
            // Stacked, fanned deck peeking up from the bottom edge (then out to rest)
            x: -c.x + (i - mid) * c.w * 0.42,
            y: c.h * 0.47 - c.y,
            rotation: (i - mid) * 7 - Number(c.slot.dataset.rotate),
            duration: dur.slow * 1.4,
            ease: ease.reveal,
          },
          0.2 + i * 0.05,
        );
      });

      // Scroll drift + cursor parallax aren't needed for first paint: set them
      // up after the intro starts, when the main thread is idle.
      let offMove = () => {};
      const setup = contextSafe!(() => {
        // Scroll: cards drift outward and up, nearer cards faster; the copy lags behind
        let live = cards; // re-measured on every refresh (resize)
        // Look a card up by its slot: after a resize the visible set (and order) can change
        const at = (c: (typeof cards)[number]) => live.find((l) => l.slot === c.slot) ?? c;
        const out = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
            onRefreshInit: () => {
              live = geometry();
            },
          },
        });
        cards.forEach((c) => {
          out.to(
            c.slot,
            {
              x: () => at(c).x * 0.35 * c.depth,
              y: () => at(c).y * 0.35 * c.depth - 160 * c.depth,
              rotation: () => Math.sign(at(c).x) * 8 * c.depth,
              ease: ease.scrub,
            },
            0,
          );
        });
        out.to(el.querySelector("[data-hero-copy]"), { y: 120, autoAlpha: 0, ease: ease.scrub }, 0);

        // Cursor parallax by depth (fine pointers only)
        if (!window.matchMedia(mq.finePointer).matches) return;
        const movers = cards.map((c) => ({
          depth: c.depth,
          x: gsap.quickTo(c.slot.querySelector("[data-card-float]"), "x", { duration: dur.slow, ease: ease.ui }),
          y: gsap.quickTo(c.slot.querySelector("[data-card-float]"), "y", { duration: dur.slow, ease: ease.ui }),
        }));
        const onMove = (e: PointerEvent) => {
          const dx = e.clientX / window.innerWidth - 0.5;
          const dy = e.clientY / window.innerHeight - 0.5;
          for (const m of movers) {
            m.x(dx * -36 * m.depth);
            m.y(dy * -36 * m.depth);
          }
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        offMove = () => window.removeEventListener("pointermove", onMove);
      });

      let cancelIdle = () => {};
      const offReady = onReady(() => {
        intro.play();
        cancelIdle = whenIdle(setup);
      });
      return () => {
        offReady();
        cancelIdle();
        offMove();
      };
    });
  });

  return (
    <section ref={root} data-scene="Intro" className="hero relative isolate h-svh min-h-[600px] overflow-hidden">
      <ul className="contents">
        {heroCards.map((card) => (
          <li
            key={card.href}
            data-hero-card
            data-depth={card.depth}
            data-rotate={card.rotate}
            className={cn("hero-card-slot", !card.mobile && "max-md:hidden")}
            style={card.place}
          >
            <div data-card-intro>
              <div data-card-float>
                <Cover card={card} />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div data-hero-copy className="hero-copy">
        <h1 className="font-display text-hero hero-title">
          {words(before).map((word, i) => (
            <span key={`b${i}`}>
              <span data-word className="inline-block">
                {word}
              </span>{" "}
            </span>
          ))}
          <Image
            data-word
            className="hero-pill"
            src={site.headlineImage.src}
            alt={site.headlineImage.alt}
            width={120}
            height={160}
            priority
            unoptimized={site.headlineImage.src.endsWith(".svg")}
          />{" "}
          {words(after).map((word, i) => (
            <span key={`a${i}`}>
              <span data-word className="inline-block">
                {word}
              </span>{" "}
            </span>
          ))}
        </h1>
        <p data-fade className="text-fg-muted">
          {site.name} — {site.role.toLowerCase()} based in {site.location}.
        </p>
        <div data-fade>
          <Magnetic>
            <TransitionLink href="/#work" className="btn-pill" data-magnetic-inner>
              View work
            </TransitionLink>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

function Cover({ card }: { card: HeroCard }) {
  const style = { "--card-bg": card.bg, "--card-fg": card.fg, "--card-rotate": `${card.rotate}deg` } as CSSProperties;

  return (
    <TransitionLink
      href={card.href}
      className={cn("hero-card", `art-${card.art}`, card.image && "has-image")}
      style={style}
      data-cursor="view"
    >
      {card.image && <MediaImage media={card.image} sizes="(min-width: 768px) 18vw, 30vw" quality={90} eager />}
      <span className="hero-card-kicker">{card.kicker}</span>
      <span className="hero-card-art">
        <CardArt art={card.art} />
      </span>
      <span className="hero-card-title">{card.title}</span>
    </TransitionLink>
  );
}
