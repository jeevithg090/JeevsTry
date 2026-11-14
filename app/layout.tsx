import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { siteUrl } from "@/lib/site"

const inter = Inter({ subsets: ["latin"] })

const description =
  "Connect, collaborate, and grow with freelancers, tech events, and developer communities — all in one place."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TechCollab — All-in-One Tech Collaboration Platform",
    template: "%s · TechCollab",
  },
  description,
  applicationName: "TechCollab",
  openGraph: {
    type: "website",
    siteName: "TechCollab",
    title: "TechCollab — All-in-One Tech Collaboration Platform",
    description,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
