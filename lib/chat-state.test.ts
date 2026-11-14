import { describe, expect, it } from "vitest"
import {
  addMember,
  appendMessage,
  createId,
  deleteMessage,
  editMessage,
  findDirectMessage,
  removeMember,
  toggleReaction,
  type ChatGroup,
  type Message,
  type MessagesByChannel,
} from "@/lib/chat-state"

function message(id: string, overrides: Partial<Message> = {}): Message {
  return {
    id,
    content: `message ${id}`,
    senderId: "alice",
    senderName: "Alice",
    timestamp: new Date(0),
    type: "text",
    ...overrides,
  }
}

const state: MessagesByChannel = {
  general: [message("1"), message("2", { reactions: { "👍": ["bob"] } })],
  random: [message("3")],
}

describe("appendMessage", () => {
  it("appends to an existing channel without mutating the input", () => {
    const next = appendMessage(state, "general", message("4"))
    expect(next.general.map((m) => m.id)).toEqual(["1", "2", "4"])
    expect(state.general).toHaveLength(2)
  })

  it("creates a channel on first message", () => {
    expect(appendMessage(state, "new", message("5")).new).toHaveLength(1)
  })
})

describe("editMessage", () => {
  it("updates content and marks the message as edited", () => {
    const next = editMessage(state, "3", "  updated  ")
    expect(next.random[0]).toMatchObject({ content: "updated", edited: true })
    expect(state.random[0].edited).toBeUndefined()
  })

  it("ignores blank edits", () => {
    expect(editMessage(state, "3", "   ")).toBe(state)
  })
})

describe("deleteMessage", () => {
  it("removes the message from whichever channel holds it", () => {
    const next = deleteMessage(state, "2")
    expect(next.general.map((m) => m.id)).toEqual(["1"])
    expect(next.random).toHaveLength(1)
  })
})

describe("toggleReaction", () => {
  it("adds a new reaction", () => {
    const next = toggleReaction(state, "1", "🎉", "me")
    expect(next.general[0].reactions).toEqual({ "🎉": ["me"] })
  })

  it("adds the user to an existing reaction without mutating previous state", () => {
    const next = toggleReaction(state, "2", "👍", "me")
    expect(next.general[1].reactions).toEqual({ "👍": ["bob", "me"] })
    expect(state.general[1].reactions).toEqual({ "👍": ["bob"] })
  })

  it("removes the user's reaction and drops empty emoji keys", () => {
    const once = toggleReaction(state, "1", "🎉", "me")
    const twice = toggleReaction(once, "1", "🎉", "me")
    expect(twice.general[0].reactions).toEqual({})
  })

  it("is stable when applied twice to the same input (React StrictMode double-invoke)", () => {
    const a = toggleReaction(state, "2", "👍", "me")
    const b = toggleReaction(state, "2", "👍", "me")
    expect(a).toEqual(b)
  })
})

describe("group membership", () => {
  const groups: ChatGroup[] = [
    {
      id: "g1",
      name: "Group",
      type: "public",
      members: ["alice", "me"],
      admins: ["me"],
      createdAt: new Date(0),
      unreadCount: 0,
    },
  ]

  it("does not add duplicate members", () => {
    expect(addMember(groups, "g1", "me")[0].members).toEqual(["alice", "me"])
    expect(addMember(groups, "g1", "bob")[0].members).toEqual(["alice", "me", "bob"])
  })

  it("removes the member and their admin role", () => {
    const [group] = removeMember(groups, "g1", "me")
    expect(group.members).toEqual(["alice"])
    expect(group.admins).toEqual([])
  })
})

describe("findDirectMessage", () => {
  const dms = [
    { id: "dm-1", participants: ["me", "alice"], unreadCount: 0, createdAt: new Date(0) },
    { id: "dm-2", participants: ["me", "alice", "bob"], unreadCount: 0, createdAt: new Date(0) },
  ]

  it("finds a one-to-one conversation regardless of participant order", () => {
    expect(findDirectMessage(dms, "alice", "me")?.id).toBe("dm-1")
  })

  it("returns undefined when none exists", () => {
    expect(findDirectMessage(dms, "me", "carol")).toBeUndefined()
  })
})

describe("createId", () => {
  it("is unique across rapid calls", () => {
    const ids = new Set(Array.from({ length: 100 }, () => createId("x-")))
    expect(ids.size).toBe(100)
  })
})
