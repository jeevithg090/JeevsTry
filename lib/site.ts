/**
 * Public base URL used for absolute metadata (Open Graph, canonical links).
 * Configure with NEXT_PUBLIC_SITE_URL; falls back to localhost in development.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "")
