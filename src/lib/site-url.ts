const FALLBACK_SITE_URL = "https://vellum.app";

export function getSiteUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!rawUrl) return FALLBACK_SITE_URL;

  if (rawUrl.startsWith("//")) {
    return `https:${rawUrl}`;
  }

  if (!/^https?:\/\//i.test(rawUrl)) {
    return `https://${rawUrl}`;
  }

  return rawUrl.replace(/\/+$/, "");
}
