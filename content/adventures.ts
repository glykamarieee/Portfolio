import type { Adventure } from "./types";

// Films from days out around Cebu with friends, newest first. The places below
// are placeholders: swap in your own spots, dates, crew and one-liners.
// Compressed clips go in /public/media/adventures/<slug>/ (raw footage goes in
// /public/media/adventures/_raw/, which is git-ignored). Add `video` once a
// clip is ready, e.g.:
//   video: { src: "/media/adventures/kawasan/clip.mp4",
//            preview: "/media/adventures/kawasan/preview.mp4",
//            poster: "/media/adventures/kawasan/poster.jpg" },
const PLACEHOLDER = "/media/placeholder.svg";

export const adventures: Adventure[] = [
  {
    slug: "kawasan",
    place: "Kawasan Falls",
    area: "Badian",
    date: "2025-04",
    story: "Canyoneering all morning, turquoise water all afternoon.",
    crew: ["Friend", "Friend"],
    tags: ["Cinematic"],
    cover: { src: PLACEHOLDER, alt: "Kawasan Falls" },
  },
  {
    slug: "osmena-peak",
    place: "Osmeña Peak",
    area: "Dalaguete",
    date: "2025-01",
    story: "A 4 a.m. climb for ten minutes of sunrise over the hills.",
    crew: ["Friend", "Friend", "Friend"],
    tags: ["Cinematic", "Sunrise"],
    cover: { src: PLACEHOLDER, alt: "Osmeña Peak" },
  },
  {
    slug: "moalboal",
    place: "Sardine run",
    area: "Moalboal",
    date: "2024-10",
    story: "Snorkels on, cameras under, a million fish in one shot.",
    crew: ["Friend", "Friend"],
    tags: ["Underwater"],
    cover: { src: PLACEHOLDER, alt: "Moalboal sardine run" },
  },
  {
    slug: "sirao",
    place: "Sirao",
    area: "Cebu City",
    date: "2024-06",
    story: "Mountain roads, fog and a car full of friends.",
    crew: ["Friend", "Friend", "Friend"],
    tags: ["Road trip"],
    cover: { src: PLACEHOLDER, alt: "Sirao" },
  },
];
