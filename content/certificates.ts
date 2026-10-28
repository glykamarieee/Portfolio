import type { Certificate } from "./types";

// TODO: 6–15 certificates, most recent first. Images go in /public/media/certificates/.
const PLACEHOLDER = "/media/placeholder.svg";

const placeholder = (n: number, issuer: string, date: string): Certificate => ({
  id: `cert-${n}`,
  title: `Certificate Title ${n}`,
  issuer,
  date,
  credentialUrl: "https://example.com",
  image: { src: PLACEHOLDER, alt: `Certificate Title ${n} by ${issuer}` },
});

export const certificates: Certificate[] = [
  placeholder(1, "Issuer A", "2026-03"),
  placeholder(2, "Issuer B", "2026-01"),
  placeholder(3, "Issuer C", "2025-10"),
  placeholder(4, "Issuer A", "2025-07"),
  placeholder(5, "Issuer D", "2025-04"),
  placeholder(6, "Issuer B", "2025-01"),
  placeholder(7, "Issuer E", "2024-09"),
  placeholder(8, "Issuer C", "2024-05"),
];
