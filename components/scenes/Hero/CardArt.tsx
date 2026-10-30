import type { HeroCard } from "@/content";

// Line drawings for the hero cover cards, one per destination, in the card's
// own ink (currentColor). Cards with a photo cover (`about`) draw nothing.
export function CardArt({ art }: { art: HeroCard["art"] }) {
  if (art === "about") return null;

  return (
    <svg viewBox="0 0 100 100" className="hero-card-svg" aria-hidden="true">
      {art === "journey" && (
        // A winding path past milestones to a graduation cap
        <>
          <path d="M10 88 C 34 88, 26 58, 48 58 S 66 36, 78 34" className="svg-dash" />
          <circle cx="10" cy="88" r="5" className="svg-fill" />
          <circle cx="48" cy="58" r="5" className="svg-fill" />
          <path d="M80 6 L98 15 L80 24 L62 15 Z" className="svg-fill" />
          <path d="M70 19 v8 c0 5 20 5 20 0 v-8" />
          <path d="M95 16 v12" />
          <circle cx="95" cy="30" r="2.6" className="svg-fill" />
        </>
      )}

      {art === "work" && (
        // A browser window with a code mark
        <>
          <rect x="6" y="14" width="88" height="70" rx="8" />
          <path d="M6 30 H94" />
          <circle cx="15" cy="22" r="2.4" className="svg-fill" />
          <circle cx="23" cy="22" r="2.4" className="svg-fill" />
          <circle cx="31" cy="22" r="2.4" className="svg-fill" />
          <path d="M36 46 l-11 11 l11 11" />
          <path d="M64 46 l11 11 l-11 11" />
          <path d="M55 42 l-10 30" />
        </>
      )}

      {art === "archive" && (
        // Stacked certificates with an award seal
        <>
          <rect x="24" y="8" width="62" height="72" rx="4" />
          <rect x="12" y="18" width="62" height="72" rx="4" className="svg-card" />
          <path d="M22 34 H58 M22 44 H64 M22 54 H50" />
          <path d="M52 78 l-5 18 l8 -5 l5 7 l3 -18" className="svg-fill" />
          <circle cx="58" cy="74" r="11" className="svg-fill" />
          <circle cx="58" cy="74" r="5.5" className="svg-hole" />
        </>
      )}

      {art === "skills" && (
        // The three crafts: code, cut (scissors), capture (camera)
        <>
          <path d="M16 14 l-10 9 l10 9 M34 14 l10 9 l-10 9 M28 10 l-6 26" />
          <circle cx="63" cy="36" r="6.5" />
          <circle cx="85" cy="36" r="6.5" />
          <path d="M67 31 L92 6 M81 31 L56 6" />
          <rect x="22" y="56" width="56" height="38" rx="6" />
          <path d="M36 56 l4 -8 h20 l4 8" />
          <circle cx="50" cy="75" r="10" />
          <circle cx="69" cy="64" r="2.4" className="svg-fill" />
        </>
      )}

      {art === "hello" && (
        // A speech bubble, someone typing
        <>
          <path d="M16 12 H84 a10 10 0 0 1 10 10 V60 a10 10 0 0 1 -10 10 H44 L26 88 V70 H16 a10 10 0 0 1 -10 -10 V22 a10 10 0 0 1 10 -10 Z" />
          <circle cx="32" cy="41" r="5" className="svg-fill" />
          <circle cx="50" cy="41" r="5" className="svg-fill" />
          <circle cx="68" cy="41" r="5" className="svg-fill" />
        </>
      )}

      {art === "resume" && (
        // A page with a folded corner and a PDF badge
        <>
          <path d="M22 6 H62 L82 26 V94 H22 Z" />
          <path d="M62 6 V26 H82" />
          <path d="M34 42 H70 M34 52 H70 M34 62 H58" />
          <rect x="10" y="68" width="46" height="22" rx="5" className="svg-fill" />
          <text x="33" y="83.5" textAnchor="middle" className="svg-label">
            PDF
          </text>
        </>
      )}
    </svg>
  );
}
