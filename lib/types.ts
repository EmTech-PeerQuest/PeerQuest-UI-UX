export interface User {
  id: number
  username: string
  email: string
  password: string
  avatar: string
  level: number
  xp: number
  gold: number
  bio: string
  completedQuests: number
  createdQuests: number
  joinedGuilds: number
  createdGuilds: number
  isAdmin?: boolean
  isBanned?: boolean
  createdAt: Date
  settings: UserSettings
}

export interface UserSettings {
  email: string
  username: string
  password: string
  avatar: string
  notifications: {
    questUpdates: boolean
    guildUpdates: boolean
    messages: boolean
    applicationUpdates: boolean
  }
  privacy: {
    showProfile: "everyone" | "friends" | "none"
    showActivity: boolean
    showGuilds: boolean
  }
  theme: "light" | "dark" | "system"
  language: string
}

export interface Quest {
  id: number
  title: string
  description: string
  poster: User
  reward: number
  xp: number
  deadline: Date
  category: string
  difficulty: "easy" | "medium" | "hard"
  status: "open" | "in-progress" | "completed"
  createdAt: Date
  completedAt?: Date
  assignedTo?: number
  applicants: QuestApplication[]
}

export interface QuestApplication {
  id: number
  userId: number
  username: string
  avatar: string
  message: string
  status: "pending" | "accepted" | "rejected"
  appliedAt: Date
}

export interface Guild {
  id: number
  name: string
  description: string
  emblem: string
  poster: User
  members: number
  membersList: number[]
  admins: number[]
  specialization: string
  category: string
  createdAt: Date
  applications: GuildApplication[]
}

export interface GuildApplication {
  id: number
  userId: number
  username: string
  avatar: string
  message: string
  status: "pending" | "accepted" | "rejected"
  appliedAt: Date
}

export interface Message {
  id: number
  senderId: number
  receiverId: number
  content: string
  read: boolean
  createdAt: Date
}

export interface Conversation {
  id: number
  participants: number[]
  lastMessage: string
  lastMessageDate: Date
  unreadCount: number
}

export interface Report {
  id: number
  type: "user" | "quest" | "guild"
  targetId: number
  targetName: string
  reason: string
  reportedBy: number
  reporterName: string
  status: "pending" | "resolved" | "dismissed"
  createdAt: Date
}
