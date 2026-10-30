"use client";

import { Fragment, useRef, type CSSProperties } from "react";
import { skillCategories, skills, type Skill, type SkillCategory } from "@/content";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { dur, ease, gsap, mq, stagger, useGSAP } from "@/lib/motion";
import { pad, timecode } from "@/lib/format";
import { sceneIndex } from "../registry";
import { Decor } from "@/components/ui/Decor";

const byCategory = (category: SkillCategory) => skills.filter((skill) => skill.category === category);

const TIMELINE_SECONDS = 48; // runtime shown on the Editing sequence
const FOCUS_HOLD = 1.6; // seconds the viewfinder stays on each skill
const STACK_TOP = 88; // px — mirrors .craft-card's sticky top in scenes.css
const STACK_STEP = 14; // px each later card sits lower, so earlier headers peek

// Scene 4 — three crafts as three tools. Each card pairs the category with a
// mock of where that craft happens: a code editor (Programming), an edit
// timeline (Editing) and a camera viewfinder (Videography). Cards stack as you
// scroll (CSS sticky); motion adds the scrubbed playhead, typed-in code and a
// rack-focus loop. The windows are decorative — each card has a real list.
export function Skills() {
  const section = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(mq.motion, () => {
      const el = section.current!;
      const cards = gsap.utils.toArray<HTMLElement>("[data-craft]", el);

      // Stack: the card underneath eases back as the next one slides over it
      if (window.matchMedia(mq.desktop).matches) {
        cards.slice(0, -1).forEach((card, i) => {
          gsap.to(card.querySelector("[data-craft-inner]"), {
            scale: 0.94,
            ease: ease.scrub,
            scrollTrigger: {
              trigger: cards[i + 1],
              start: "top bottom",
              end: `top ${STACK_TOP + (i + 1) * STACK_STEP}px`, // where the next card sticks
              scrub: true,
            },
          });
        });
      }

      // Code: lines type in when the editor arrives
      gsap.from(gsap.utils.toArray("[data-code-line]", el), {
        autoAlpha: 0,
        x: -10,
        duration: dur.fast,
        ease: ease.ui,
        stagger: stagger.chars * 3,
        scrollTrigger: { trigger: el.querySelector("[data-code]"), start: "top 75%", once: true },
      });

      // Timeline: the playhead scrubs with scroll; clips under it light up
      const track = el.querySelector<HTMLElement>("[data-tracks]")!;
      const head = el.querySelector<HTMLElement>("[data-playhead]")!;
      const clock = el.querySelector<HTMLElement>("[data-tl-clock]")!;
      const clips = gsap.utils.toArray<HTMLElement>("[data-clip]", el);
      gsap.fromTo(
        head,
        { x: 0 },
        {
          x: () => track.offsetWidth,
          ease: ease.scrub,
          scrollTrigger: {
            trigger: track,
            start: "top 85%",
            end: "bottom 15%",
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              clock.textContent = timecode(p * TIMELINE_SECONDS);
              for (const clip of clips) {
                clip.classList.toggle("is-live", p >= Number(clip.dataset.start) && p <= Number(clip.dataset.end));
              }
            },
          },
        },
      );

      // Viewfinder: rack focus from skill to skill; hovering pulls focus by hand.
      // Only the .is-focus class moves; CSS does the blur, so nothing tweens late.
      const shots = gsap.utils.toArray<HTMLElement>("[data-shot]", el);
      const finder = el.querySelector<HTMLElement>("[data-finder]")!;
      finder.dataset.racking = "on";
      const focus = (index: number) => shots.forEach((shot, i) => shot.classList.toggle("is-focus", i === index));
      let at = 0;
      const loop = gsap
        .timeline({ repeat: -1, paused: true })
        .call(() => {
          focus(at);
          at = (at + 1) % shots.length;
        })
        .to({}, { duration: FOCUS_HOLD });
      gsap.timeline({
        scrollTrigger: {
          trigger: finder,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
        },
      });
      const offs = shots.map((shot, i) => {
        const enter = () => {
          loop.pause();
          focus(i);
          at = (i + 1) % shots.length;
        };
        const leave = () => loop.play();
        shot.addEventListener("pointerenter", enter);
        shot.addEventListener("pointerleave", leave);
        return () => {
          shot.removeEventListener("pointerenter", enter);
          shot.removeEventListener("pointerleave", leave);
        };
      });

      return () => {
        offs.forEach((off) => off());
        delete finder.dataset.racking;
        shots.forEach((shot) => shot.classList.remove("is-focus"));
      };
    });
  });

  return (
    <section ref={section} id="skills" data-scene="Skills" className="skills relative isolate py-24">
      <Decor set="skills" />
      <header className="container-grid gap-y-4 pt-8 pb-16">
        <SceneHeader index={sceneIndex("Skills")} title="Skills" className="col-span-12" />
        <h2 className="font-display text-display col-span-12 md:col-span-8">Skills &amp; tools</h2>
        <p className="text-lead col-span-12 text-fg-muted md:col-span-6">
          Programming, editing and videography — the three crafts behind the work.
        </p>
      </header>

      <ol className="craft-stack">
        {skillCategories.map((category, i) => {
          const list = byCategory(category.name);
          return (
            <li
              key={category.name}
              data-craft
              className="craft-card"
              style={{ "--i": i } as CSSProperties}
              aria-labelledby={`craft-${i}`}
            >
              <div data-craft-inner className="craft-inner">
                <div className="craft-copy">
                  <span className="craft-num" aria-hidden="true">
                    {pad(i + 1)}
                  </span>
                  <h3 id={`craft-${i}`} className="font-display text-h2">
                    {category.name}
                  </h3>
                  <p className="text-lead text-fg-muted">{category.blurb}</p>
                  <ul className="craft-tags">
                    {list.map((skill) => (
                      <li key={skill.name}>{skill.name}</li>
                    ))}
                  </ul>
                </div>
                <div className="craft-window" aria-hidden="true">
                  {category.name === "Programming" && <CodeWindow skills={list} blurb={category.blurb} />}
                  {category.name === "Editing" && <TimelineWindow skills={list} />}
                  {category.name === "Videography" && <Viewfinder skills={list} />}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function WindowBar({ title }: { title: string }) {
  return (
    <div className="win-bar">
      <span className="win-dots">
        <span />
        <span />
        <span />
      </span>
      <span>{title}</span>
    </div>
  );
}

const meter = (level = 3) => "●".repeat(level) + "○".repeat(5 - level);

// Programming — the stack as a typed array in an editor
function CodeWindow({ skills: list, blurb }: { skills: Skill[]; blurb: string }) {
  const lines = [
    <span key="comment" className="tok-com">{`// ${blurb}`}</span>,
    <Fragment key="open">
      <span className="tok-kw">const</span> stack <span className="tok-kw">=</span> [
    </Fragment>,
    ...list.map((skill) => (
      <Fragment key={skill.name}>
        {"  "}
        <span className="tok-str">&quot;{skill.name}&quot;</span>,{" "}
        <span className="tok-com">{`// ${meter(skill.level)}`}</span>
      </Fragment>
    )),
    "];",
    "",
    <Fragment key="export">
      <span className="tok-kw">export default</span> stack;
      <span className="code-caret" />
    </Fragment>,
  ];

  return (
    <div data-code className="win">
      <WindowBar title="skills.ts — programming" />
      <ol className="code">
        {lines.map((line, i) => (
          <li key={i} data-code-line>
            <span className="code-ln">{i + 1}</span>
            <span className="code-text">{line}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// Editing — skills laid out as clips across a sequence's video tracks, over a
// soundtrack bed on A1
const TRACKS = ["V3", "V2", "V1"] as const;

function TimelineWindow({ skills: list }: { skills: Skill[] }) {
  // Round-robin onto tracks; each clip's length follows its level
  const ends = TRACKS.map((_, t) => t * 1.5);
  const placed = list.map((skill, i) => {
    const t = i % TRACKS.length;
    const start = ends[t];
    const length = 3 + (skill.level ?? 3) * 1.2;
    ends[t] = start + length + 0.6;
    return { skill, track: t, start, length };
  });
  const total = Math.max(...ends);

  return (
    <div className="win">
      <WindowBar title="Sequence 01 — editing" />
      <div className="tl">
        <div className="tl-ruler">
          <span data-tl-clock className="tl-clock">
            {timecode(0)}
          </span>
          <span className="tl-ticks" />
        </div>
        <div className="tl-body">
          <div className="tl-labels">
            {TRACKS.map((track) => (
              <span key={track}>{track}</span>
            ))}
            <span>A1</span>
          </div>
          <div data-tracks className="tl-tracks">
            {TRACKS.map((track, t) => (
              <div key={track} className="tl-track">
                {placed
                  .filter((clip) => clip.track === t)
                  .map(({ skill, start, length }) => (
                    <span
                      key={skill.name}
                      data-clip
                      data-start={start / total}
                      data-end={(start + length) / total}
                      className="tl-clip"
                      style={{ left: `${(start / total) * 100}%`, width: `${(length / total) * 100}%` }}
                    >
                      {skill.name}
                    </span>
                  ))}
              </div>
            ))}
            <div className="tl-track">
              <span
                data-clip
                data-start={0}
                data-end={1}
                className="tl-clip is-audio"
                style={{ left: "0%", width: "100%" }}
              >
                Soundtrack
              </span>
            </div>
            <span data-playhead className="tl-playhead" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Videography — skills framed in a camera viewfinder, pulled into focus in turn
function Viewfinder({ skills: list }: { skills: Skill[] }) {
  return (
    <div data-finder className="finder">
      <span className="finder-thirds" />
      <span className="finder-corners" />
      <div className="finder-hud">
        <span>
          <span className="finder-rec" /> Rec
        </span>
        <span>4K · 24p · 16:9</span>
      </div>
      <ul className="finder-shots">
        {list.map((skill) => (
          <li key={skill.name} data-shot className="finder-shot">
            {skill.name}
          </li>
        ))}
      </ul>
      <div className="finder-hud">
        <span>ISO 400 · 1/50 · f/2.8</span>
        <span>WB 5600K · AF-C</span>
      </div>
    </div>
  );
}
