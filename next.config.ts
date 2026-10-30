import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // 75 for most images; 90 for portraits, where softness shows (MediaImage `quality`)
  images: { qualities: [75, 90] },
  partialPrefetching: true,
  turbopack: {
    // Pin the root: a stray package-lock.json in the home folder otherwise
    // makes Next.js guess the wrong workspace root (and warn on every run).
    root: import.meta.dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
