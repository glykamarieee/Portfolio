import type { Certificate } from "./types";

// TODO: 6–15 certificates. Images go in /public/media/certificates/.
export const certificates: Certificate[] = [
  {
    id: "cert-one",
    title: "Certificate Title",
    issuer: "Issuer",
    date: "2026-01",
    credentialUrl: "https://example.com",
    image: { src: "/media/certificates/cert-one.jpg", alt: "Certificate Title by Issuer" },
  },
  {
    id: "cert-two",
    title: "Certificate Title",
    issuer: "Issuer",
    date: "2025-08",
    image: { src: "/media/certificates/cert-two.jpg", alt: "Certificate Title by Issuer" },
  },
];
