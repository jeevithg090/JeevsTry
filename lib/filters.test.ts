import { describe, expect, it } from "vitest"
import {
  filterEvents,
  filterGigs,
  isFreeEvent,
  locationOptions,
  matchesQuery,
  slugify,
  type EventFilters,
  type FilterableEvent,
  type FilterableGig,
  type GigFilters,
} from "@/lib/filters"

describe("matchesQuery", () => {
  it("matches every term case-insensitively across fields", () => {
    expect(matchesQuery("react NATIVE", ["React Native App", undefined])).toBe(true)
    expect(matchesQuery("react stripe", ["React Native App", "Stripe"])).toBe(true)
    expect(matchesQuery("react vue", ["React Native App"])).toBe(false)
  })

  it("treats a blank query as a match", () => {
    expect(matchesQuery("   ", ["anything"])).toBe(true)
  })
})

describe("slugify", () => {
  it("creates url-safe keys", () => {
    expect(slugify("Mobile Development")).toBe("mobile-development")
    expect(slugify("  New York, NY ")).toBe("new-york-ny")
    expect(slugify("UI/UX Design")).toBe("ui-ux-design")
  })
})

const gigs: FilterableGig[] = [
  {
    title: "React Native app",
    description: "Cross-platform shop",
    skills: ["React Native", "Stripe"],
    category: "Mobile Development",
    budget: 5000,
    budgetType: "fixed",
  },
  {
    title: "Analytics dashboard",
    description: "ML insights",
    skills: ["Python"],
    category: "Data Science",
    budget: 75,
    budgetType: "hourly",
  },
  {
    title: "Landing page",
    description: "Marketing site",
    skills: ["HTML"],
    category: "Web Development",
    budget: 800,
    budgetType: "fixed",
  },
  {
    title: "Platform rebuild",
    description: "Large migration",
    skills: ["Go"],
    category: "Web Development",
    budget: 25000,
    budgetType: "fixed",
  },
]

const allGigs: GigFilters = { query: "", category: "all", budget: "all" }
const titles = (list: { title: string }[]) => list.map((item) => item.title)

describe("filterGigs", () => {
  it("returns everything with default filters", () => {
    expect(filterGigs(gigs, allGigs)).toHaveLength(4)
  })

  it("searches title, description, category and skills", () => {
    expect(titles(filterGigs(gigs, { ...allGigs, query: "stripe" }))).toEqual(["React Native app"])
    expect(titles(filterGigs(gigs, { ...allGigs, query: "data science" }))).toEqual(["Analytics dashboard"])
  })

  it("filters by category slug", () => {
    expect(titles(filterGigs(gigs, { ...allGigs, category: "web-development" }))).toEqual([
      "Landing page",
      "Platform rebuild",
    ])
  })

  it.each([
    ["hourly", ["Analytics dashboard"]],
    ["under-1k", ["Landing page"]],
    ["1k-5k", ["React Native app"]],
    ["5k-10k", []],
    ["over-10k", ["Platform rebuild"]],
  ] as const)("budget %s", (budget, expected) => {
    expect(titles(filterGigs(gigs, { ...allGigs, budget }))).toEqual(expected)
  })

  it("combines filters", () => {
    expect(filterGigs(gigs, { query: "react", category: "data-science", budget: "all" })).toEqual([])
  })
})

const events: FilterableEvent[] = [
  {
    title: "AI Hackathon",
    description: "Build for good",
    type: "hackathon",
    location: "San Francisco, CA",
    isOnline: false,
    price: "Free",
    tags: ["AI"],
  },
  {
    title: "React Workshop",
    description: "Advanced patterns",
    type: "workshop",
    location: "Online",
    isOnline: true,
    price: "$49",
  },
  {
    title: "Pitch Night",
    description: "Startups pitch",
    type: "networking",
    location: "New York, NY",
    isOnline: false,
    price: "$25",
  },
]

const allEvents: EventFilters = { query: "", type: "all", location: "all", price: "all" }

describe("filterEvents", () => {
  it("filters by query including tags", () => {
    expect(titles(filterEvents(events, { ...allEvents, query: "ai" }))).toEqual(["AI Hackathon"])
  })

  it("filters by type", () => {
    expect(titles(filterEvents(events, { ...allEvents, type: "workshop" }))).toEqual(["React Workshop"])
  })

  it("filters online and specific locations", () => {
    expect(titles(filterEvents(events, { ...allEvents, location: "online" }))).toEqual(["React Workshop"])
    expect(titles(filterEvents(events, { ...allEvents, location: "new-york-ny" }))).toEqual(["Pitch Night"])
  })

  it("filters free and paid", () => {
    expect(titles(filterEvents(events, { ...allEvents, price: "free" }))).toEqual(["AI Hackathon"])
    expect(titles(filterEvents(events, { ...allEvents, price: "paid" }))).toEqual(["React Workshop", "Pitch Night"])
  })
})

describe("event helpers", () => {
  it("detects free events regardless of case", () => {
    expect(isFreeEvent({ price: " free " })).toBe(true)
    expect(isFreeEvent({ price: "$0.99" })).toBe(false)
  })

  it("lists distinct in-person locations alphabetically", () => {
    expect(locationOptions([...events, events[0]])).toEqual([
      { value: "new-york-ny", label: "New York, NY" },
      { value: "san-francisco-ca", label: "San Francisco, CA" },
    ])
  })
})
