import type { User, Quest, Guild, Message, Conversation } from "./types"

export const mockUsers: User[] = [
  {
    id: 1,
    username: "HeroicAdventurer",
    displayName: "HeroicAdventurer",
    email: "hero@example.com",
    password: "password123", // In a real app, this would be hashed
    gold: 1200,
    xp: 5600,
    level: 10,
    joinDate: "2023-01-15",
    completedQuests: 1,
    activeQuests: 0,
    guilds: ["Mystic Brewers Guild", "Tavern Defenders", "Creative Crafters"],
    guildIds: [1, 2, 3],
    avatar: "H",
    bio: "Experienced adventurer looking for challenging quests.",
    skills: ["Combat", "Alchemy", "Negotiation"],
    role: "user",
    settings: {
      theme: "dark",
      language: "en",
      privacy: {
        showBirthday: false,
        showGender: true,
        showEmail: false,
      },
      security: {
        twoFactorEnabled: false,
        twoFactorMethod: null,
        backupCodesGenerated: false,
      },
      notifications: {
        newQuests: true,
        questApplications: true,
        guildAnnouncements: true,
        directMessages: true,
        newsletter: false,
      },
    },
  },
  {
    id: 2,
    username: "QuestMaster",
    displayName: "Quest Master",
    email: "admin@example.com",
    password: "admin123", // In a real app, this would be hashed
    gold: 5000,
    xp: 15000,
    level: 25,
    joinDate: "2022-11-05",
    completedQuests: 45,
    activeQuests: 2,
    guilds: ["Tavern Defenders"],
    guildIds: [2],
    avatar: "Q",
    bio: "I create the most challenging quests for worthy adventurers.",
    skills: ["Leadership", "Strategy", "Lore"],
    role: "admin",
    settings: {
      theme: "light",
      language: "en",
      privacy: {
        showBirthday: true,
        showGender: true,
        showEmail: true,
      },
      security: {
        twoFactorEnabled: true,
        twoFactorMethod: "app",
        backupCodesGenerated: true,
      },
      notifications: {
        newQuests: true,
        questApplications: true,
        guildAnnouncements: true,
        directMessages: true,
        newsletter: true,
      },
    },
  },
  {
    id: 3,
    username: "MysticBrewer",
    displayName: "Mystic Brewer",
    email: "brewer@example.com",
    password: "brew123", // In a real app, this would be hashed
    gold: 800,
    xp: 3200,
    level: 7,
    joinDate: "2023-03-20",
    completedQuests: 12,
    activeQuests: 1,
    guilds: ["Mystic Brewers Guild"],
    guildIds: [1],
    avatar: "M",
    bio: "Specializing in rare and magical potions.",
    skills: ["Alchemy", "Herbalism", "Research"],
    role: "user",
    settings: {
      theme: "dark",
      language: "en",
      privacy: {
        showBirthday: false,
        showGender: false,
        showEmail: false,
      },
      security: {
        twoFactorEnabled: false,
        twoFactorMethod: null,
        backupCodesGenerated: false,
      },
      notifications: {
        newQuests: true,
        questApplications: true,
        guildAnnouncements: true,
        directMessages: true,
        newsletter: false,
      },
    },
  },
  {
    id: 4,
    username: "TavernKeeper",
    email: "keeper@example.com",
    password: "secure456",
    avatar: "T",
    level: 15,
    xp: 8900,
    gold: 3500,
    bio: "Owner of the PeerQuest Tavern. Always looking for talented individuals.",
    completedQuests: 42,
    activeQuests: 0,
    guilds: ["Tavern Defenders", "Creative Crafters"],
    guildIds: [2, 3],
    isAdmin: true,
    isBanned: false,
    createdAt: new Date(2022, 10, 5),
    settings: {
      email: "keeper@example.com",
      username: "TavernKeeper",
      password: "secure456",
      avatar: "T",
      notifications: {
        questUpdates: true,
        guildUpdates: true,
        messages: true,
        applicationUpdates: true,
      },
      privacy: {
        showProfile: "everyone",
        showActivity: true,
        showGuilds: true,
      },
      theme: "dark",
      language: "en",
    },
    roles: ["admin"],
  },
  {
    id: 5,
    username: "BannedUser",
    email: "banned@example.com",
    password: "banned123",
    avatar: "B",
    level: 3,
    xp: 1200,
    gold: 100,
    bio: "This account has been banned for violating community guidelines.",
    completedQuests: 2,
    activeQuests: 0,
    guilds: [],
    guildIds: [],
    isAdmin: false,
    isBanned: true,
    createdAt: new Date(2023, 6, 5),
    settings: {
      email: "banned@example.com",
      username: "BannedUser",
      password: "banned123",
      avatar: "B",
      notifications: {
        questUpdates: true,
        guildUpdates: true,
        messages: true,
        applicationUpdates: true,
      },
      privacy: {
        showProfile: "everyone",
        showActivity: true,
        showGuilds: true,
      },
      theme: "light",
      language: "en",
    },
    roles: ["user"],
  },
]

export const mockQuests: Quest[] = [
  {
    id: 1,
    title: "Create a Website for the Tavern",
    description: "We need a new website for the PeerQuest Tavern. Looking for someone with web development skills.",
    poster: mockUsers[1], // TavernKeeper
    reward: 500,
    xp: 300,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    category: "development",
    difficulty: "medium",
    status: "open",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    applicants: [
      {
        id: 1,
        userId: 3,
        username: "QuestSeeker",
        avatar: "Q",
        message: "I have experience with web development and would love to help create a website for the tavern!",
        status: "pending",
        appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    ],
  },
  {
    id: 2,
    title: "Design a Tavern Logo",
    description: "Looking for a creative artist to design a new logo for the PeerQuest Tavern.",
    poster: mockUsers[1], // TavernKeeper
    reward: 300,
    xp: 200,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    category: "design",
    difficulty: "easy",
    status: "in-progress",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    assignedTo: 4, // MysticBrewer
    applicants: [
      {
        id: 2,
        userId: 4,
        username: "MysticBrewer",
        avatar: "M",
        message: "I'm a skilled artist and would love to design a logo for the tavern!",
        status: "accepted",
        appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        id: 3,
        userId: 3,
        username: "QuestSeeker",
        avatar: "Q",
        message: "I have some design experience and would like to try creating a logo for you.",
        status: "rejected",
        appliedAt: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000), // 3.5 days ago
      },
    ],
  },
  {
    id: 3,
    title: "Develop a Potion Recipe",
    description: "Need an experienced alchemist to develop a new potion recipe for health regeneration.",
    poster: mockUsers[3], // MysticBrewer
    reward: 800,
    xp: 400,
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    category: "alchemy",
    difficulty: "hard",
    status: "open",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    applicants: [],
  },
  {
    id: 4,
    title: "Write Tavern Lore",
    description: "Looking for a skilled writer to create lore and stories about the PeerQuest Tavern's history.",
    poster: mockUsers[1], // TavernKeeper
    reward: 400,
    xp: 250,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    category: "writing",
    difficulty: "medium",
    status: "completed",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    assignedTo: 1, // HeroicAdventurer
    applicants: [
      {
        id: 4,
        userId: 1,
        username: "HeroicAdventurer",
        avatar: "H",
        message: "I'm a storyteller at heart and would love to craft the history of the tavern!",
        status: "accepted",
        appliedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), // 28 days ago
      },
    ],
  },
  {
    id: 5,
    title: "Create Tavern Music",
    description: "Seeking a musician to compose a theme song for the PeerQuest Tavern.",
    poster: mockUsers[1], // TavernKeeper
    reward: 600,
    xp: 350,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    category: "music",
    difficulty: "medium",
    status: "open",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    applicants: [
      {
        id: 5,
        userId: 1,
        username: "HeroicAdventurer",
        avatar: "H",
        message: "I play the lute and would love to compose a theme for the tavern!",
        status: "pending",
        appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
    ],
  },
]

export const mockGuilds: Guild[] = [
  {
    id: 1,
    name: "Mystic Brewers Guild",
    description:
      "A guild dedicated to the art of potion-making and alchemy. We share recipes, techniques, and collaborate on complex brewing projects.",
    emblem: "🧪",
    poster: mockUsers[3], // MysticBrewer
    members: 3,
    membersList: [1, 3, 4], // HeroicAdventurer, QuestSeeker, MysticBrewer
    admins: [4], // MysticBrewer
    specialization: "Alchemy",
    category: "Alchemists",
    createdAt: new Date(2023, 3, 15),
    applications: [],
  },
  {
    id: 2,
    name: "Tavern Defenders",
    description:
      "The official guild for those who help protect and maintain the PeerQuest Tavern. Members get priority on tavern-related quests.",
    emblem: "🛡️",
    poster: mockUsers[1], // TavernKeeper
    members: 2,
    membersList: [1, 2], // HeroicAdventurer, TavernKeeper
    admins: [1], // HeroicAdventurer
    specialization: "Protection",
    category: "Warriors",
    createdAt: new Date(2023, 1, 10),
    applications: [
      {
        id: 1,
        userId: 3,
        username: "QuestSeeker",
        avatar: "Q",
        message: "I would like to join the Tavern Defenders to help protect this wonderful establishment!",
        status: "pending",
        appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
    ],
  },
  {
    id: 3,
    name: "Creative Crafters",
    description:
      "A guild for artists, designers, and creators of all kinds. We collaborate on creative projects and share techniques.",
    emblem: "🎨",
    poster: mockUsers[0], // HeroicAdventurer
    members: 1,
    membersList: [1], // HeroicAdventurer
    admins: [],
    specialization: "Art & Design",
    category: "Artists",
    createdAt: new Date(2023, 5, 20),
    applications: [
      {
        id: 2,
        userId: 4,
        username: "MysticBrewer",
        avatar: "M",
        message: "I have a passion for art and would love to join your creative guild!",
        status: "pending",
        appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    ],
  },
]

export const mockMessages: Message[] = [
  {
    id: 1,
    senderId: 1, // HeroicAdventurer
    receiverId: 2, // TavernKeeper
    content: "Hello! I'm interested in taking on more quests at the tavern.",
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: 2,
    senderId: 2, // TavernKeeper
    receiverId: 1, // HeroicAdventurer
    content: "Great to hear! I've just posted a new quest for designing a tavern logo. Would you be interested?",
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // 3 days ago + 30 minutes
  },
  {
    id: 3,
    senderId: 1, // HeroicAdventurer
    receiverId: 2, // TavernKeeper
    content: "I'll check it out! My design skills aren't the best, but I might know someone who could help.",
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000), // 3 days ago + 45 minutes
  },
  {
    id: 4,
    senderId: 2, // TavernKeeper
    receiverId: 1, // HeroicAdventurer
    content: "That would be wonderful! Let me know if you find someone suitable.",
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 3 days ago + 60 minutes
  },
  {
    id: 5,
    senderId: 1, // HeroicAdventurer
    receiverId: 2, // TavernKeeper
    content: "By the way, I completed the tavern lore quest. The documents should be on your desk.",
    read: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
  },
  {
    id: 6,
    senderId: 2, // TavernKeeper
    receiverId: 1, // HeroicAdventurer
    content: "I just read through them. Excellent work! Your reward has been processed.",
    read: true,
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
  },
  {
    id: 7,
    senderId: 2, // TavernKeeper
    receiverId: 1, // HeroicAdventurer
    content: "Are you available to discuss a new special quest? It's something that requires your expertise.",
    read: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: 8,
    senderId: 3, // QuestSeeker
    receiverId: 1, // HeroicAdventurer
    content:
      "Hello! I'm new to the tavern and was hoping to get some advice from an experienced adventurer like yourself.",
    read: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: 9,
    senderId: 4, // MysticBrewer
    receiverId: 1, // HeroicAdventurer
    content: "I saw your application for the music quest. I'm also a musician! Perhaps we could collaborate sometime?",
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: 10,
    senderId: 1, // HeroicAdventurer
    receiverId: 4, // MysticBrewer
    content: "That sounds like a great idea! What instruments do you play?",
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // 2 days ago + 30 minutes
  },
]

export const mockConversations: Conversation[] = [
  {
    id: 1,
    participants: [1, 2], // HeroicAdventurer, TavernKeeper
    lastMessage: "Are you available to discuss a new special quest? It's something that requires your expertise.",
    lastMessageDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    unreadCount: 1,
  },
  {
    id: 2,
    participants: [1, 3], // HeroicAdventurer, QuestSeeker
    lastMessage:
      "Hello! I'm new to the tavern and was hoping to get some advice from an experienced adventurer like yourself.",
    lastMessageDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    unreadCount: 1,
  },
  {
    id: 3,
    participants: [1, 4], // HeroicAdventurer, MysticBrewer
    lastMessage: "That sounds like a great idea! What instruments do you play?",
    lastMessageDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // 2 days ago + 30 minutes
    unreadCount: 0,
  },
]
