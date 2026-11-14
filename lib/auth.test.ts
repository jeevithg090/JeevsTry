import { describe, expect, it } from "vitest"
import {
  createDemoUser,
  getInitials,
  hasErrors,
  isValidEmail,
  nameFromEmail,
  parseStoredUser,
  safeRedirectPath,
  validateSignIn,
  validateSignUp,
  type SignUpInput,
} from "@/lib/auth"

const validSignUp: SignUpInput = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  password: "correct-horse",
  confirmPassword: "correct-horse",
  role: "freelancer",
  agreeToTerms: true,
}

describe("isValidEmail", () => {
  it.each(["a@b.co", "  jane.doe+tag@example.org  "])("accepts %s", (email) => {
    expect(isValidEmail(email)).toBe(true)
  })

  it.each(["", "plain", "a@b", "a b@c.com", "@example.com"])("rejects %j", (email) => {
    expect(isValidEmail(email)).toBe(false)
  })
})

describe("validateSignUp", () => {
  it("returns no errors for a complete form", () => {
    expect(validateSignUp(validSignUp)).toEqual({})
  })

  it("flags every missing or invalid field", () => {
    const errors = validateSignUp({
      firstName: " ",
      lastName: "",
      email: "nope",
      password: "short",
      confirmPassword: "different",
      role: "admin",
      agreeToTerms: false,
    })
    expect(Object.keys(errors).sort()).toEqual(
      ["agreeToTerms", "confirmPassword", "email", "firstName", "lastName", "password", "role"].sort(),
    )
  })

  it("requires matching passwords", () => {
    const errors = validateSignUp({ ...validSignUp, confirmPassword: "correct-horsE" })
    expect(errors).toEqual({ confirmPassword: "Passwords don't match." })
  })
})

describe("validateSignIn", () => {
  it("requires a valid email and a password", () => {
    expect(validateSignIn({ email: "x", password: "" })).toEqual({
      email: "Enter a valid email address.",
      password: "Password is required.",
    })
    expect(hasErrors(validateSignIn({ email: "x@y.io", password: "pw" }))).toBe(false)
  })
})

describe("parseStoredUser", () => {
  const user = createDemoUser({ name: "Ada Lovelace", email: "ada@example.com", role: "client" })

  it("round-trips a serialised user", () => {
    expect(parseStoredUser(JSON.stringify(user))).toEqual(user)
  })

  it.each([null, "", "{not json", "42", "null", JSON.stringify({ ...user, role: "admin" })])(
    "returns null for invalid input %j",
    (raw) => {
      expect(parseStoredUser(raw)).toBeNull()
    },
  )

  it("drops unexpected properties and coerces flags", () => {
    const parsed = parseStoredUser(JSON.stringify({ ...user, verified: "yes", isAdmin: true }))
    expect(parsed).not.toHaveProperty("isAdmin")
    expect(parsed?.verified).toBe(false)
  })
})

describe("createDemoUser", () => {
  it("normalises input and stamps the join date", () => {
    const now = new Date("2026-01-02T03:04:05.000Z")
    const user = createDemoUser(
      { name: "  Grace Hopper ", email: " Grace@Navy.MIL ", role: "startup", company: "  " },
      now,
    )
    expect(user).toMatchObject({
      name: "Grace Hopper",
      email: "grace@navy.mil",
      role: "startup",
      company: undefined,
      verified: false,
      joinedAt: "2026-01-02T03:04:05.000Z",
    })
    expect(user.id).toBeTruthy()
  })

  it("generates unique ids", () => {
    const input = { name: "A", email: "a@b.co", role: "client" as const }
    expect(createDemoUser(input).id).not.toBe(createDemoUser(input).id)
  })
})

describe("nameFromEmail", () => {
  it("title-cases the local part", () => {
    expect(nameFromEmail("jane.doe@example.com")).toBe("Jane Doe")
    expect(nameFromEmail("JOHN_smith-jr@example.com")).toBe("John Smith Jr")
  })

  it("falls back when there is no usable local part", () => {
    expect(nameFromEmail("@example.com")).toBe("TechCollab Member")
  })
})

describe("getInitials", () => {
  it.each([
    ["Ada Lovelace", "AL"],
    ["Grace Brewster Murray Hopper", "GH"],
    ["cher", "C"],
    ["   ", "?"],
  ])("%j -> %s", (name, initials) => {
    expect(getInitials(name)).toBe(initials)
  })
})

describe("safeRedirectPath", () => {
  it("allows app-relative paths", () => {
    expect(safeRedirectPath("/dashboard/events?tab=hosting")).toBe("/dashboard/events?tab=hosting")
  })

  it.each([null, "", "https://evil.example", "//evil.example", "/\\evil.example", "dashboard"])(
    "falls back for unsafe target %j",
    (target) => {
      expect(safeRedirectPath(target)).toBe("/dashboard")
    },
  )
})
