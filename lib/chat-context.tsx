"use client"

import type { ReactNode } from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import * as chat from "@/lib/chat-state"
import type { ChatGroup, ChatUser, DirectMessage, Message, MessageType, MessagesByChannel } from "@/lib/chat-state"
import { getInitials } from "@/lib/auth"
import { CURRENT_USER_ID, createChatSeed } from "@/lib/mock/chat-data"
import { useUser } from "@/lib/user-context"

/** Simulated connection delay for the demo chat (there is no real-time backend yet). */
const CONNECT_DELAY_MS = 800

interface ChatContextType {
  isConnected: boolean

  messages: MessagesByChannel
  sendMessage: (content: string, channelId: string, type?: MessageType) => void
  editMessage: (messageId: string, content: string) => void
  deleteMessage: (messageId: string) => void
  addReaction: (messageId: string, emoji: string) => void

  groups: ChatGroup[]
  joinGroup: (groupId: string) => void
  leaveGroup: (groupId: string) => void
  createGroup: (name: string, description: string, type: "public" | "private") => void

  directMessages: DirectMessage[]
  startDirectMessage: (userId: string) => string

  users: Record<string, ChatUser>
  currentUser: ChatUser | null

  activeChannel: string | null
  setActiveChannel: (channelId: string) => void

  typingUsers: Record<string, string[]>
  setTyping: (channelId: string, isTyping: boolean) => void
}

const ChatContext = createContext<ChatContextType | null>(null)

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider")
  }
  return context
}

const NO_TYPING: Record<string, string[]> = {}

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useUser()
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<MessagesByChannel>({})
  const [groups, setGroups] = useState<ChatGroup[]>([])
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([])
  const [users, setUsers] = useState<Record<string, ChatUser>>({})
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null)
  const [activeChannel, setActiveChannel] = useState<string | null>(null)

  const userName = user?.name ?? "You"

  useEffect(() => {
    const me: ChatUser = {
      id: CURRENT_USER_ID,
      name: userName,
      avatar: getInitials(userName),
      status: "online",
    }
    const seed = createChatSeed(me)
    setCurrentUser(me)
    setUsers(seed.users)
    setGroups(seed.groups)
    setDirectMessages(seed.directMessages)
    setMessages(seed.messages)

    const timer = setTimeout(() => setIsConnected(true), CONNECT_DELAY_MS)
    return () => {
      clearTimeout(timer)
      setIsConnected(false)
    }
  }, [userName])

  const sendMessage = useCallback(
    (content: string, channelId: string, type: MessageType = "text") => {
      const text = content.trim()
      if (!currentUser || !text) return

      const message: Message = {
        id: chat.createId("msg-"),
        content: text,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        timestamp: new Date(),
        type,
      }
      setMessages((prev) => chat.appendMessage(prev, channelId, message))
    },
    [currentUser],
  )

  const editMessage = useCallback((messageId: string, content: string) => {
    setMessages((prev) => chat.editMessage(prev, messageId, content))
  }, [])

  const deleteMessage = useCallback((messageId: string) => {
    setMessages((prev) => chat.deleteMessage(prev, messageId))
  }, [])

  const addReaction = useCallback(
    (messageId: string, emoji: string) => {
      if (!currentUser) return
      setMessages((prev) => chat.toggleReaction(prev, messageId, emoji, currentUser.id))
    },
    [currentUser],
  )

  const joinGroup = useCallback(
    (groupId: string) => {
      if (!currentUser) return
      setGroups((prev) => chat.addMember(prev, groupId, currentUser.id))
    },
    [currentUser],
  )

  const leaveGroup = useCallback(
    (groupId: string) => {
      if (!currentUser) return
      setGroups((prev) => chat.removeMember(prev, groupId, currentUser.id))
    },
    [currentUser],
  )

  const createGroup = useCallback(
    (name: string, description: string, type: "public" | "private") => {
      if (!currentUser || !name.trim()) return
      const newGroup: ChatGroup = {
        id: chat.createId("group-"),
        name: name.trim(),
        description: description.trim(),
        type,
        members: [currentUser.id],
        admins: [currentUser.id],
        createdAt: new Date(),
        unreadCount: 0,
      }
      setGroups((prev) => [...prev, newGroup])
    },
    [currentUser],
  )

  const startDirectMessage = useCallback(
    (userId: string): string => {
      if (!currentUser) return ""
      const existing = chat.findDirectMessage(directMessages, currentUser.id, userId)
      if (existing) return existing.id

      const newDM: DirectMessage = {
        id: chat.createId("dm-"),
        participants: [currentUser.id, userId],
        unreadCount: 0,
        createdAt: new Date(),
      }
      setDirectMessages((prev) => [...prev, newDM])
      return newDM.id
    },
    [currentUser, directMessages],
  )

  // Typing indicators require a real-time backend; this is a no-op in the demo.
  const setTyping = useCallback(() => {}, [])

  const value = useMemo<ChatContextType>(
    () => ({
      isConnected,
      messages,
      sendMessage,
      editMessage,
      deleteMessage,
      addReaction,
      groups,
      joinGroup,
      leaveGroup,
      createGroup,
      directMessages,
      startDirectMessage,
      users,
      currentUser,
      activeChannel,
      setActiveChannel,
      typingUsers: NO_TYPING,
      setTyping,
    }),
    [
      isConnected,
      messages,
      sendMessage,
      editMessage,
      deleteMessage,
      addReaction,
      groups,
      joinGroup,
      leaveGroup,
      createGroup,
      directMessages,
      startDirectMessage,
      users,
      currentUser,
      activeChannel,
      setTyping,
    ],
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
