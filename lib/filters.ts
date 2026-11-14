/**
 * Pure list filters for the freelancing and events browse views.
 */

import type { BudgetType } from "@/lib/format"

const normalize = (value: string) => value.trim().toLowerCase()

/** True when every whitespace-separated term appears in at least one field. */
export function matchesQuery(query: string, fields: Array<string | undefined>): boolean {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  if (terms.length === 0) return true
  const haystack = fields.filter(Boolean).join(" ").toLowerCase()
  return terms.every((term) => haystack.includes(term))
}

/** "Mobile Development" -> "mobile-development" */
export function slugify(value: string): string {
  return normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export interface FilterableGig {
  title: string
  description: string
  skills: readonly string[]
  category: string
  budget: number
  budgetType: BudgetType
}

export const BUDGET_FILTERS = ["all", "hourly", "under-1k", "1k-5k", "5k-10k", "over-10k"] as const
export type BudgetFilter = (typeof BUDGET_FILTERS)[number]

export interface GigFilters {
  query: string
  category: string
  budget: BudgetFilter
}

function matchesBudget(gig: FilterableGig, budget: BudgetFilter): boolean {
  if (budget === "all") return true
  if (budget === "hourly") return gig.budgetType === "hourly"
  // Price ranges refer to fixed-price projects.
  if (gig.budgetType !== "fixed") return false
  switch (budget) {
    case "under-1k":
      return gig.budget < 1000
    case "1k-5k":
      return gig.budget >= 1000 && gig.budget <= 5000
    case "5k-10k":
      return gig.budget > 5000 && gig.budget <= 10000
    case "over-10k":
      return gig.budget > 10000
  }
}

export function filterGigs<T extends FilterableGig>(gigs: readonly T[], filters: GigFilters): T[] {
  return gigs.filter(
    (gig) =>
      matchesQuery(filters.query, [gig.title, gig.description, gig.category, ...gig.skills]) &&
      (filters.category === "all" || slugify(gig.category) === filters.category) &&
      matchesBudget(gig, filters.budget),
  )
}

export interface FilterableEvent {
  title: string
  description: string
  type: string
  location: string
  isOnline: boolean
  price: string
  tags?: readonly string[]
}

export interface EventFilters {
  query: string
  type: string
  /** "all", "online", or a slugified location such as "new-york-ny". */
  location: string
  price: "all" | "free" | "paid"
}

export function isFreeEvent(event: Pick<FilterableEvent, "price">): boolean {
  return normalize(event.price) === "free"
}

export function filterEvents<T extends FilterableEvent>(events: readonly T[], filters: EventFilters): T[] {
  return events.filter((event) => {
    if (
      !matchesQuery(filters.query, [event.title, event.description, event.type, event.location, ...(event.tags ?? [])])
    )
      return false
    if (filters.type !== "all" && event.type !== filters.type) return false
    if (filters.location === "online" && !event.isOnline) return false
    if (filters.location !== "all" && filters.location !== "online" && slugify(event.location) !== filters.location)
      return false
    if (filters.price === "free" && !isFreeEvent(event)) return false
    if (filters.price === "paid" && isFreeEvent(event)) return false
    return true
  })
}

/** Distinct in-person locations, as select options. */
export function locationOptions(events: readonly Pick<FilterableEvent, "location" | "isOnline">[]) {
  const seen = new Map<string, string>()
  for (const event of events) {
    if (!event.isOnline && !seen.has(slugify(event.location))) seen.set(slugify(event.location), event.location)
  }
  return [...seen].map(([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label))
}
