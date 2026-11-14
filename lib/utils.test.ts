import { describe, expect, it } from "vitest"
import { formatBudget } from "@/lib/format"
import { cn, pickAllowed } from "@/lib/utils"

describe("pickAllowed", () => {
  const tabs = ["profile", "billing"] as const

  it("returns the value when allowed", () => {
    expect(pickAllowed("billing", tabs, "profile")).toBe("billing")
  })

  it.each([null, undefined, "", "admin"])("falls back for %j", (value) => {
    expect(pickAllowed(value, tabs, "profile")).toBe("profile")
  })
})

describe("cn", () => {
  it("merges conflicting tailwind classes", () => {
    expect(cn("px-2", false && "hidden", "px-4")).toBe("px-4")
  })
})

describe("formatBudget", () => {
  it("formats fixed and hourly budgets", () => {
    expect(formatBudget(5000, "fixed")).toBe("$5,000 fixed")
    expect(formatBudget(75, "hourly")).toBe("$75/hr")
  })
})
