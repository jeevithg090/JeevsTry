import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = { title: "Event registration" }

export default function Layout({ children }: { children: ReactNode }) {
  return <main id="main-content">{children}</main>
}
