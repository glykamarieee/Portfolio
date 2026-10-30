// Prints /resume to public/resume/resume.pdf with headless Chrome, using the
// site's print stylesheet. Run it while the site is up (npm run dev or start):
//   npm run resume:pdf               (defaults to http://localhost:3000)
//   npm run resume:pdf -- <base-url>
// Set CHROME_PATH if Chrome isn't in the default Windows location.

import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

const base = process.argv[2] ?? "http://localhost:3000";
const out = fileURLToPath(new URL("../public/resume/resume.pdf", import.meta.url));
const chrome =
  process.env.CHROME_PATH ??
  [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
  ].find(existsSync);

if (!chrome) throw new Error("Chrome not found — set CHROME_PATH");

execFileSync(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--no-pdf-header-footer",
  "--virtual-time-budget=10000", // let fonts and the page settle before printing
  `--print-to-pdf=${out}`,
  `${base}/resume`,
]);

console.log(`wrote ${out} (${Math.round(statSync(out).size / 1024)} KB)`);
