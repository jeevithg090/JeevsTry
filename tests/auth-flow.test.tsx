import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import SignInPage from "@/app/auth/signin/page"
import SignUpPage from "@/app/auth/signup/page"
import { DashboardShell } from "@/components/dashboard-shell"
import { createDemoUser, USER_STORAGE_KEY } from "@/lib/auth"
import { UserProvider, useUser } from "@/lib/user-context"

const push = vi.fn()
const replace = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace, prefetch: vi.fn(), back: vi.fn() }),
  usePathname: () => "/dashboard/events",
  useSearchParams: () => new URLSearchParams(),
}))

// The full sidebar/header pull in theme and settings providers; they are not under test here.
vi.mock("@/components/app-sidebar", () => ({ AppSidebar: () => <nav>sidebar</nav> }))
vi.mock("@/components/dashboard-header", () => ({ DashboardHeader: () => <header>header</header> }))
vi.mock("@/components/ui/sidebar", () => ({
  SidebarProvider: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SidebarInset: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

function CurrentUser() {
  const { user } = useUser()
  return <output data-testid="current-user">{user ? `${user.name}|${user.email}|${user.role}` : "none"}</output>
}

function renderWithUser(ui: ReactNode) {
  return render(
    <UserProvider>
      {ui}
      <CurrentUser />
    </UserProvider>,
  )
}

beforeEach(() => {
  push.mockReset()
  replace.mockReset()
  window.history.replaceState(null, "", "/auth/signin")
})

describe("UserProvider", () => {
  it("restores a valid stored session", async () => {
    const user = createDemoUser({ name: "Ada Lovelace", email: "ada@example.com", role: "client" })
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    renderWithUser(null)
    expect(await screen.findByText("Ada Lovelace|ada@example.com|client")).toBeInTheDocument()
  })

  it("ignores corrupted storage instead of crashing", async () => {
    window.localStorage.setItem(USER_STORAGE_KEY, "{oops")
    renderWithUser(null)
    await waitFor(() => expect(screen.getByTestId("current-user")).toHaveTextContent("none"))
  })
})

describe("SignInPage", () => {
  it("shows validation errors and does not navigate", async () => {
    renderWithUser(<SignInPage />)
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }))
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument()
    expect(screen.getByText("Password is required.")).toBeInTheDocument()
    expect(push).not.toHaveBeenCalled()
  })

  it("signs in, persists the session and honours a safe ?next= redirect", async () => {
    window.history.replaceState(null, "", "/auth/signin?next=%2Fdashboard%2Fevents")
    renderWithUser(<SignInPage />)
    await userEvent.type(screen.getByLabelText("Email"), "jane.doe@example.com")
    await userEvent.type(screen.getByLabelText("Password"), "secret")
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }))

    expect(push).toHaveBeenCalledWith("/dashboard/events")
    expect(screen.getByTestId("current-user")).toHaveTextContent("Jane Doe|jane.doe@example.com|freelancer")
    expect(JSON.parse(window.localStorage.getItem(USER_STORAGE_KEY) ?? "{}").email).toBe("jane.doe@example.com")
  })

  it("rejects an off-site ?next= redirect", async () => {
    window.history.replaceState(null, "", "/auth/signin?next=https%3A%2F%2Fevil.example")
    renderWithUser(<SignInPage />)
    await userEvent.type(screen.getByLabelText("Email"), "a@b.co")
    await userEvent.type(screen.getByLabelText("Password"), "x")
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }))
    expect(push).toHaveBeenCalledWith("/dashboard")
  })
})

describe("SignUpPage", () => {
  it("creates an account with the selected role", async () => {
    renderWithUser(<SignUpPage />)
    await userEvent.click(screen.getByRole("button", { name: /Startup/ }))
    await userEvent.type(screen.getByLabelText("First Name *"), "Grace")
    await userEvent.type(screen.getByLabelText("Last Name *"), "Hopper")
    await userEvent.type(screen.getByLabelText("Email Address *"), "grace@example.com")
    await userEvent.type(screen.getByLabelText("Startup Name *"), "Compilers Inc")
    await userEvent.type(screen.getByLabelText("Password *"), "longenough")
    await userEvent.type(screen.getByLabelText("Confirm Password *"), "longenough")
    await userEvent.click(screen.getByRole("checkbox", { name: /Terms of Service/ }))
    await userEvent.click(screen.getByRole("button", { name: "Create Startup Account" }))

    expect(push).toHaveBeenCalledWith("/dashboard")
    expect(screen.getByTestId("current-user")).toHaveTextContent("Grace Hopper|grace@example.com|startup")
  })

  it("blocks submission when passwords differ or terms are not accepted", async () => {
    renderWithUser(<SignUpPage />)
    await userEvent.click(screen.getByRole("button", { name: /Freelancer/ }))
    await userEvent.type(screen.getByLabelText("First Name *"), "Ada")
    await userEvent.type(screen.getByLabelText("Last Name *"), "Lovelace")
    await userEvent.type(screen.getByLabelText("Email Address *"), "ada@example.com")
    await userEvent.type(screen.getByLabelText("Password *"), "longenough")
    await userEvent.type(screen.getByLabelText("Confirm Password *"), "different1")
    await userEvent.click(screen.getByRole("button", { name: "Create Freelancer Account" }))

    expect(screen.getByText("Passwords don't match.")).toBeInTheDocument()
    expect(screen.getByText("You must accept the terms to continue.")).toBeInTheDocument()
    expect(push).not.toHaveBeenCalled()
    expect(screen.getByTestId("current-user")).toHaveTextContent("none")
  })
})

describe("DashboardShell", () => {
  it("redirects visitors without a session to sign-in", async () => {
    render(
      <UserProvider>
        <DashboardShell>secret dashboard</DashboardShell>
      </UserProvider>,
    )
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/auth/signin?next=%2Fdashboard%2Fevents"))
    expect(screen.queryByText("secret dashboard")).not.toBeInTheDocument()
  })

  it("renders the dashboard for a signed-in user", async () => {
    const user = createDemoUser({ name: "Ada", email: "ada@example.com", role: "freelancer" })
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    render(
      <UserProvider>
        <DashboardShell>secret dashboard</DashboardShell>
      </UserProvider>,
    )
    expect(await screen.findByText("secret dashboard")).toBeInTheDocument()
    expect(replace).not.toHaveBeenCalled()
  })
})
