"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Send, MoreVertical, Phone, Video, Info } from "lucide-react"
import type { User } from "@/lib/types"
import { mockUsers, mockMessages, mockConversations } from "@/lib/mock-data"

interface MessagingSystemProps {
  currentUser: User | null
  showToast: (message: string, type?: string) => void
}

export function MessagingSystem({ currentUser, showToast }: MessagingSystemProps) {
  const [conversations, setConversations] = useState(mockConversations)
  const [activeConversation, setActiveConversation] = useState<number | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Get the other participant in a conversation
  const getOtherParticipant = (conversation: any) => {
    if (!currentUser) return null
    const otherId = conversation.participants.find((id: number) => id !== currentUser.id)
    return otherId ? mockUsers.find((user) => user.id === otherId) : null
  }

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) => {
    const otherParticipant = getOtherParticipant(conversation)
    if (!otherParticipant) return false

    return otherParticipant.username.toLowerCase().includes(searchQuery.toLowerCase())
  })

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversation !== null && currentUser) {
      // Find messages for this conversation
      const conversationMessages = mockMessages.filter(
        (msg) =>
          (msg.senderId === currentUser.id &&
            msg.receiverId ===
              conversations
                .find((c) => c.id === activeConversation)
                ?.participants.find((id) => id !== currentUser.id)) ||
          (msg.receiverId === currentUser.id &&
            msg.senderId ===
              conversations.find((c) => c.id === activeConversation)?.participants.find((id) => id !== currentUser.id)),
      )

      setMessages(conversationMessages || [])

      // Mark messages as read
      const updatedConversations = conversations.map((conv) =>
        conv.id === activeConversation ? { ...conv, unreadCount: 0 } : conv,
      )
      setConversations(updatedConversations)
    }
  }, [activeConversation, currentUser, conversations])

  const handleSendMessage = () => {
    if (!newMessage.trim() || activeConversation === null || !currentUser) return

    const otherParticipantId = conversations
      .find((c) => c.id === activeConversation)
      ?.participants.find((id) => id !== currentUser.id)

    if (!otherParticipantId) return

    const newMsg = {
      id: Date.now(),
      senderId: currentUser.id,
      receiverId: otherParticipantId,
      content: newMessage,
      createdAt: new Date(),
      read: false,
    }

    // Add to messages
    setMessages((prev) => [...prev, newMsg])

    // Update conversation
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === activeConversation
          ? {
              ...conv,
              lastMessage: newMessage,
              lastMessageDate: new Date(),
            }
          : conv,
      ),
    )

    setNewMessage("")
    showToast("Message sent!", "success")
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  if (!currentUser) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-[#2C1A1D] mb-4">Please Log In</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to access the messaging system.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex h-[600px]">
          {/* Conversations Sidebar */}
          <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-[#2C1A1D]">Messages</h2>
              <div className="mt-2 relative">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-100 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B75AA]"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => {
                  const otherParticipant = getOtherParticipant(conversation)
                  if (!otherParticipant) return null

                  return (
                    <button
                      key={conversation.id}
                      onClick={() => setActiveConversation(conversation.id)}
                      className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        activeConversation === conversation.id ? "bg-gray-50" : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="w-12 h-12 bg-[#8B75AA] rounded-full flex items-center justify-center text-xl text-white">
                            {otherParticipant.avatar}
                          </div>
                          <div
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                              otherParticipant.isAdmin ? "bg-green-500" : "bg-gray-400"
                            }`}
                          ></div>
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium text-[#2C1A1D]">{otherParticipant.username}</h3>
                            <span className="text-xs text-gray-500">
                              {formatTime(new Date(conversation.lastMessageDate))}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-sm text-gray-600 truncate max-w-[180px]">{conversation.lastMessage}</p>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-[#8B75AA] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })
              ) : (
                <div className="p-4 text-center text-gray-500">No conversations found</div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="hidden md:flex flex-col w-2/3">
            {activeConversation !== null ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#8B75AA] rounded-full flex items-center justify-center text-lg text-white">
                      {getOtherParticipant(conversations.find((c) => c.id === activeConversation))?.avatar}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-[#2C1A1D]">
                        {getOtherParticipant(conversations.find((c) => c.id === activeConversation))?.username}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {getOtherParticipant(conversations.find((c) => c.id === activeConversation))?.isAdmin
                          ? "Online"
                          : "Offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="text-gray-500 hover:text-[#8B75AA]">
                      <Phone size={18} />
                    </button>
                    <button className="text-gray-500 hover:text-[#8B75AA]">
                      <Video size={18} />
                    </button>
                    <button className="text-gray-500 hover:text-[#8B75AA]">
                      <Info size={18} />
                    </button>
                    <button className="text-gray-500 hover:text-[#8B75AA]">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div ref={messagesContainerRef} className="flex-1 p-4 overflow-y-auto">
                  {messages.length > 0 ? (
                    messages
                      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                      .map((message) => (
                        <div
                          key={message.id}
                          className={`mb-4 flex ${
                            message.senderId === currentUser.id ? "justify-end" : "justify-start"
                          }`}
                        >
                          {message.senderId !== currentUser.id && (
                            <div className="w-8 h-8 bg-[#8B75AA] rounded-full flex items-center justify-center text-sm text-white mr-2 flex-shrink-0">
                              {getOtherParticipant(conversations.find((c) => c.id === activeConversation))?.avatar}
                            </div>
                          )}
                          <div
                            className={`max-w-[70%] px-4 py-2 rounded-lg ${
                              message.senderId === currentUser.id
                                ? "bg-[#8B75AA] text-white rounded-br-none"
                                : "bg-gray-100 text-[#2C1A1D] rounded-bl-none"
                            }`}
                          >
                            <p>{message.content}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-500">No messages yet. Start the conversation!</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleSendMessage()
                      }}
                      className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B75AA]"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center ${
                        newMessage.trim() ? "bg-[#8B75AA] text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#8B75AA] rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                    💬
                  </div>
                  <h3 className="text-xl font-bold text-[#2C1A1D] mb-2">Your Messages</h3>
                  <p className="text-gray-500 max-w-xs">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
