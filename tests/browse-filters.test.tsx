import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import FreelancingPage from "@/app/dashboard/freelancing/page"
import { createDemoUser, USER_STORAGE_KEY } from "@/lib/auth"
import { UserProvider } from "@/lib/user-context"

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/dashboard/freelancing",
  useSearchParams: () => new URLSearchParams(),
}))

beforeEach(() => {
  const user = createDemoUser({ name: "Ada Lovelace", email: "ada@example.com", role: "freelancer" })
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
})

describe("Find Work search", () => {
  it("filters projects, shows an empty state and can be reset", async () => {
    render(
      <UserProvider>
        <FreelancingPage />
      </UserProvider>,
    )
    expect(await screen.findByText("2 projects found")).toBeInTheDocument()

    const search = screen.getByRole("searchbox", { name: "Search projects" })
    await userEvent.type(search, "python")
    expect(screen.getByText("1 project found")).toBeInTheDocument()
    expect(screen.getByText("AI-Powered Data Analytics Dashboard")).toBeInTheDocument()
    expect(screen.queryByText("React Native E-commerce App Development")).not.toBeInTheDocument()

    await userEvent.clear(search)
    await userEvent.type(search, "cobol")
    expect(screen.getByText("No projects match your filters")).toBeInTheDocument()

    await userEvent.click(screen.getAllByRole("button", { name: "Clear filters" })[0])
    expect(search).toHaveValue("")
    expect(screen.getByText("2 projects found")).toBeInTheDocument()
  })
})
