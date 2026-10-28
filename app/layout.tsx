import type { Metadata, Viewport } from "next";
import { site } from "@/content";
import { Cursor } from "@/components/system/Cursor";
import { Footer } from "@/components/system/Footer";
import { Grain } from "@/components/system/Grain";
import { Nav } from "@/components/system/Nav";
import { Preloader } from "@/components/system/Preloader";
import { SmoothScroll } from "@/components/system/SmoothScroll";
import { displayFont, monoFont, sansFont } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.positioning,
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${sansFont.variable} ${monoFont.variable}`}
    >
      <body>
        <noscript>
          <style>{".preloader{display:none}"}</style>
        </noscript>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {/* SmoothScroll must mount before Preloader, which pauses it */}
        <SmoothScroll />
        <Preloader />
        <Nav />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <Grain />
        <Cursor />
      </body>
    </html>
  );
}
