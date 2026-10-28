import type { Adventure } from "./types";

// TODO: one entry per trip. Compressed clips go in /public/media/adventures/<slug>/
// (raw footage goes in /public/media/adventures/_raw/, which is git-ignored).
export const adventures: Adventure[] = [
  {
    slug: "trip-one",
    place: "Place Name",
    country: "Philippines",
    date: "2025-04",
    coordinates: { lat: 11.9674, lng: 121.9248 },
    story: "One line about this trip.",
    video: {
      src: "/media/adventures/trip-one/clip.mp4",
      preview: "/media/adventures/trip-one/preview.mp4",
      poster: "/media/adventures/trip-one/poster.jpg",
    },
  },
  {
    slug: "trip-two",
    place: "Place Name",
    country: "Japan",
    date: "2024-11",
    coordinates: { lat: 35.0116, lng: 135.7681 },
    story: "One line about this trip.",
  },
];
