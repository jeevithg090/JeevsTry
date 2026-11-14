import { act, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import CommunityPage from "@/app/dashboard/community/page"
import { createDemoUser, USER_STORAGE_KEY } from "@/lib/auth"
import { UserProvider } from "@/lib/user-context"

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/dashboard/community",
  useSearchParams: () => new URLSearchParams(),
}))

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn()
  const user = createDemoUser({ name: "Ada Lovelace", email: "ada@example.com", role: "client" })
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
})

describe("Community chat", () => {
  it("sends, edits and deletes a message in a group", async () => {
    render(
      <UserProvider>
        <CommunityPage />
      </UserProvider>,
    )

    await userEvent.click(await screen.findByText("General Discussion"))
    const input = screen.getByRole("textbox", { name: "Message" })
    await userEvent.type(input, "Hello from the tests{Enter}")
    expect(screen.getByText("Hello from the tests")).toBeInTheDocument()
    expect(input).toHaveValue("")

    const bubble = screen.getByText("Hello from the tests").closest(".group\\/message") as HTMLElement
    await userEvent.click(within(bubble).getByRole("button", { name: "Edit message" }))
    const editor = within(bubble).getByRole("textbox", { name: "Edit message" })
    await userEvent.clear(editor)
    await userEvent.type(editor, "Edited text{Enter}")
    expect(screen.getByText("Edited text")).toBeInTheDocument()
    expect(screen.getByText("(edited)")).toBeInTheDocument()

    const edited = screen.getByText("Edited text").closest(".group\\/message") as HTMLElement
    await act(async () => {
      await userEvent.click(within(edited).getByRole("button", { name: "Delete message" }))
    })
    expect(screen.queryByText("Edited text")).not.toBeInTheDocument()
  })
})
