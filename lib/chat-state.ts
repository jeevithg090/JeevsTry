/**
 * Pure state transitions for the community chat. Kept free of React so they
 * can be unit tested and reused by a real-time backend later.
 */

export type MessageType = "text" | "image" | "file" | "announcement"

export interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  senderAvatar?: string
  timestamp: Date
  type: MessageType
  edited?: boolean
  reactions?: Record<string, string[]>
  replyTo?: string
}

export type MessagesByChannel = Record<string, Message[]>

export interface ChatGroup {
  id: string
  name: string
  description?: string
  type: "public" | "private"
  avatar?: string
  members: string[]
  admins: string[]
  createdAt: Date
  lastMessage?: Message
  unreadCount: number
  category?: string
}

export interface DirectMessage {
  id: string
  participants: string[]
  lastMessage?: Message
  unreadCount: number
  createdAt: Date
}

export interface ChatUser {
  id: string
  name: string
  avatar?: string
  status: "online" | "away" | "offline"
  lastSeen?: Date
}

export function appendMessage(state: MessagesByChannel, channelId: string, message: Message): MessagesByChannel {
  return { ...state, [channelId]: [...(state[channelId] ?? []), message] }
}

function mapMessages(state: MessagesByChannel, fn: (messages: Message[]) => Message[]): MessagesByChannel {
  const next: MessagesByChannel = {}
  for (const [channelId, messages] of Object.entries(state)) {
    next[channelId] = fn(messages)
  }
  return next
}

export function editMessage(state: MessagesByChannel, messageId: string, content: string): MessagesByChannel {
  const trimmed = content.trim()
  if (!trimmed) return state
  return mapMessages(state, (messages) =>
    messages.map((msg) => (msg.id === messageId ? { ...msg, content: trimmed, edited: true } : msg)),
  )
}

export function deleteMessage(state: MessagesByChannel, messageId: string): MessagesByChannel {
  return mapMessages(state, (messages) => messages.filter((msg) => msg.id !== messageId))
}

/** Add the user's reaction, or remove it if they already reacted with that emoji. */
export function toggleReaction(
  state: MessagesByChannel,
  messageId: string,
  emoji: string,
  userId: string,
): MessagesByChannel {
  return mapMessages(state, (messages) =>
    messages.map((msg) => {
      if (msg.id !== messageId) return msg
      const reactions: Record<string, string[]> = { ...msg.reactions }
      const reactors = reactions[emoji] ?? []
      if (reactors.includes(userId)) {
        const remaining = reactors.filter((id) => id !== userId)
        if (remaining.length > 0) {
          reactions[emoji] = remaining
        } else {
          delete reactions[emoji]
        }
      } else {
        reactions[emoji] = [...reactors, userId]
      }
      return { ...msg, reactions }
    }),
  )
}

export function addMember(groups: ChatGroup[], groupId: string, userId: string): ChatGroup[] {
  return groups.map((group) =>
    group.id === groupId && !group.members.includes(userId) ? { ...group, members: [...group.members, userId] } : group,
  )
}

export function removeMember(groups: ChatGroup[], groupId: string, userId: string): ChatGroup[] {
  return groups.map((group) =>
    group.id === groupId
      ? {
          ...group,
          members: group.members.filter((id) => id !== userId),
          admins: group.admins.filter((id) => id !== userId),
        }
      : group,
  )
}

export function findDirectMessage(
  directMessages: DirectMessage[],
  userA: string,
  userB: string,
): DirectMessage | undefined {
  return directMessages.find(
    (dm) => dm.participants.length === 2 && dm.participants.includes(userA) && dm.participants.includes(userB),
  )
}

let idCounter = 0

/** Unique-enough id for client-side records (monotonic within a session). */
export function createId(prefix = ""): string {
  idCounter += 1
  return `${prefix}${Date.now().toString(36)}${idCounter.toString(36)}`
}
