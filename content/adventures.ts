import type { Adventure } from "./types";

// TODO: one entry per trip, in travel order. Compressed clips go in
// /public/media/adventures/<slug>/ (raw footage goes in
// /public/media/adventures/_raw/, which is git-ignored). Add `video` once
// a clip is ready, e.g.:
//   video: { src: "/media/adventures/trip-one/clip.mp4",
//            preview: "/media/adventures/trip-one/preview.mp4",
//            poster: "/media/adventures/trip-one/poster.jpg" },
const PLACEHOLDER = "/media/placeholder.svg";

export const adventures: Adventure[] = [
  {
    slug: "trip-one",
    place: "Place Name",
    country: "Philippines",
    date: "2025-04",
    coordinates: { lat: 11.9674, lng: 121.9248 },
    story: "One line about this trip.",
    cover: { src: PLACEHOLDER, alt: "Trip one" },
  },
  {
    slug: "trip-two",
    place: "Place Name",
    country: "Japan",
    date: "2024-11",
    coordinates: { lat: 35.0116, lng: 135.7681 },
    story: "One line about this trip.",
    cover: { src: PLACEHOLDER, alt: "Trip two" },
  },
  {
    slug: "trip-three",
    place: "Place Name",
    country: "Indonesia",
    date: "2024-06",
    coordinates: { lat: -8.4095, lng: 115.1889 },
    story: "One line about this trip.",
    cover: { src: PLACEHOLDER, alt: "Trip three" },
  },
  {
    slug: "trip-four",
    place: "Place Name",
    country: "South Korea",
    date: "2023-10",
    coordinates: { lat: 37.5665, lng: 126.978 },
    story: "One line about this trip.",
    cover: { src: PLACEHOLDER, alt: "Trip four" },
  },
];
