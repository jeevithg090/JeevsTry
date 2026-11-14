import type { ChatGroup, ChatUser, DirectMessage, MessagesByChannel } from "@/lib/chat-state"

/** Placeholder id for the signed-in member in the seeded demo conversations. */
export const CURRENT_USER_ID = "current-user"

export interface ChatSeed {
  users: Record<string, ChatUser>
  groups: ChatGroup[]
  directMessages: DirectMessage[]
  messages: MessagesByChannel
}

/** Seed data for the demo community chat (there is no chat backend yet). */
export function createChatSeed(currentUser: ChatUser, now: number = Date.now()): ChatSeed {
  const users: Record<string, ChatUser> = {
    [CURRENT_USER_ID]: currentUser,
    alice: {
      id: "alice",
      name: "Alice Johnson",
      avatar: "AJ",
      status: "online",
    },
    bob: {
      id: "bob",
      name: "Bob Smith",
      avatar: "BS",
      status: "away",
    },
    carol: {
      id: "carol",
      name: "Carol Davis",
      avatar: "CD",
      status: "offline",
      lastSeen: new Date(now - 3600000),
    },
  }

  const groups: ChatGroup[] = [
    {
      id: "general",
      name: "General Discussion",
      description: "General chat for all members",
      type: "public",
      members: [CURRENT_USER_ID, "alice", "bob", "carol"],
      admins: [CURRENT_USER_ID],
      createdAt: new Date(),
      unreadCount: 5,
      category: "general",
    },
    {
      id: "frontend",
      name: "Frontend Developers",
      description: "Discussion about frontend technologies",
      type: "public",
      members: [CURRENT_USER_ID, "alice", "bob"],
      admins: ["alice"],
      createdAt: new Date(),
      unreadCount: 2,
      category: "development",
    },
    {
      id: "private-team",
      name: "Project Alpha Team",
      description: "Private team discussion",
      type: "private",
      members: [CURRENT_USER_ID, "alice"],
      admins: [CURRENT_USER_ID],
      createdAt: new Date(),
      unreadCount: 0,
      category: "projects",
    },
  ]

  const directMessages: DirectMessage[] = [
    {
      id: "dm-alice",
      participants: [CURRENT_USER_ID, "alice"],
      unreadCount: 3,
      createdAt: new Date(),
    },
    {
      id: "dm-bob",
      participants: [CURRENT_USER_ID, "bob"],
      unreadCount: 0,
      createdAt: new Date(),
    },
  ]

  const messages: MessagesByChannel = {
    general: [
      {
        id: "1",
        content: "Hey everyone! Just deployed our new React app to production 🚀",
        senderId: "alice",
        senderName: "Alice Johnson",
        senderAvatar: "AJ",
        timestamp: new Date(now - 3600000),
        type: "text",
        reactions: { "🚀": ["bob", "carol"], "👏": [CURRENT_USER_ID] },
      },
      {
        id: "2",
        content: "Congrats Alice! How was the deployment process?",
        senderId: "bob",
        senderName: "Bob Smith",
        senderAvatar: "BS",
        timestamp: new Date(now - 3500000),
        type: "text",
      },
      {
        id: "3",
        content: "That's awesome! Would love to hear about any challenges you faced",
        senderId: "carol",
        senderName: "Carol Davis",
        senderAvatar: "CD",
        timestamp: new Date(now - 3400000),
        type: "text",
      },
    ],
    "dm-alice": [
      {
        id: "4",
        content: "Hey, can we schedule a call to discuss the new project?",
        senderId: "alice",
        senderName: "Alice Johnson",
        senderAvatar: "AJ",
        timestamp: new Date(now - 1800000),
        type: "text",
      },
      {
        id: "5",
        content: "How about tomorrow at 2 PM?",
        senderId: CURRENT_USER_ID,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        timestamp: new Date(now - 1700000),
        type: "text",
      },
    ],
  }

  return { users, groups, directMessages, messages }
}
