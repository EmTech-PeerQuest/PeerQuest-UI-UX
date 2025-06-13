"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { QuestBoard } from "@/components/quest-board"
import { GuildHall } from "@/components/guild-hall"
import { Settings } from "@/components/settings"
import { About } from "@/components/about"
import { AuthModal } from "@/components/auth-modal"
import { PostQuestModal } from "@/components/post-quest-modal"
import { CreateGuildModal } from "@/components/create-guild-modal"
import { QuestDetailsModal } from "@/components/quest-details-modal"
import { ApplicationsModal } from "@/components/applications-modal"
import { GoldSystemModal } from "@/components/gold-system-modal"
import { Toast } from "@/components/toast"
import { Footer } from "@/components/footer"
import { Profile } from "@/components/profile"
import { UserSearch } from "@/components/user-search"
import { MessagingSystem } from "@/components/messaging-system"
import { QuestManagement } from "@/components/quest-management"
import { GuildManagement } from "@/components/guild-management"
import { AdminPanel } from "@/components/admin-panel"
import type { User, Quest, Guild, GuildApplication } from "@/lib/types"
import { mockUsers, mockQuests, mockGuilds } from "@/lib/mock-data"
import { authService } from "@/lib/auth-service"

declare global {
  interface Window {
    openPostQuestModal?: () => void
    openCreateGuildModal?: () => void
    openGoldPurchaseModal?: () => void
    openAuthModal?: () => void
    showToast?: (message: string, type?: string) => void
    updateCompletedQuests?: (quest: Quest) => void
    joinGuildTest?: (userId: number, guildName: string) => void
  }
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("home")
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false)
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot">("login")
  const [showPostQuestModal, setShowPostQuestModal] = useState<boolean>(false)
  const [showCreateGuildModal, setShowCreateGuildModal] = useState<boolean>(false)
  const [showQuestDetailsModal, setShowQuestDetailsModal] = useState<boolean>(false)
  const [showApplicationsModal, setShowApplicationsModal] = useState<boolean>(false)
  const [showGoldPurchaseModal, setShowGoldPurchaseModal] = useState<boolean>(false)
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null)
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null)
  const [users, setUsers] = useState<User[]>(mockUsers || [])
  const [quests, setQuests] = useState<Quest[]>(mockQuests || [])
  const [guilds, setGuilds] = useState<Guild[]>(mockGuilds || [])
  const [guildApplications, setGuildApplications] = useState<GuildApplication[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Expose modal functions to window
  useEffect(() => {
    window.openPostQuestModal = () => setShowPostQuestModal(true)
    window.openCreateGuildModal = () => setShowCreateGuildModal(true)
    window.openGoldPurchaseModal = () => setShowGoldPurchaseModal(true)
    window.openAuthModal = () => {
      setAuthMode("login")
      setShowAuthModal(true)
    }
    window.showToast = showToast

    return () => {
      // Clean up
      window.openPostQuestModal = undefined
      window.openCreateGuildModal = undefined
      window.openGoldPurchaseModal = undefined
      window.openAuthModal = undefined
      window.showToast = undefined
    }
  }, [])

  // Check for existing login
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser()
        if (user) {
          setCurrentUser(user)
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
      }
    }
    checkAuth()
  }, [])

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      setIsLoading(true)
      const user = await authService.login(credentials.email, credentials.password)
      setCurrentUser(user)
      setShowAuthModal(false)
      showToast("Welcome back to the PeerQuest Tavern!", "success")
    } catch (error: any) {
      showToast(error.message || "Login failed. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (userData: {
    username: string
    email: string
    password: string
    confirmPassword: string
  }) => {
    try {
      setIsLoading(true)
      const user = await authService.register(userData.username, userData.email, userData.password)
      setCurrentUser(user)
      setShowAuthModal(false)
      showToast("Welcome to the PeerQuest Tavern! Your account has been created.", "success")
    } catch (error: any) {
      showToast(error.message || "Registration failed. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (email: string) => {
    try {
      setIsLoading(true)
      await authService.forgotPassword(email)
      showToast("Password reset instructions have been sent to your email.", "success")
      setAuthMode("login")
    } catch (error: any) {
      showToast(error.message || "Failed to send reset instructions. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    authService.logout()
    setCurrentUser(null)
    setActiveSection("home")
    showToast("You have been logged out.", "info")
  }

  const showToast = (message: string, type = "info") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }

  const handleQuestSubmit = (questData: Partial<Quest>) => {
    if (!currentUser) return

    const newQuest: Quest = {
      id: Date.now(),
      title: questData.title || "Untitled Quest",
      description: questData.description || "",
      category: questData.category || "misc",
      difficulty: questData.difficulty || "medium",
      reward: questData.reward || 100,
      xp: questData.xp || 50,
      status: "open",
      poster: currentUser,
      createdAt: new Date(),
      deadline: questData.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      applicants: [],
    }

    setQuests([newQuest, ...quests])
    setShowPostQuestModal(false)
    showToast("Your quest has been posted!", "success")
  }

  const handleGuildSubmit = (guildData: Partial<Guild>) => {
    if (!currentUser) return

    const newGuild: Guild = {
      id: Date.now(),
      name: guildData.name || "Untitled Guild",
      description: guildData.description || "",
      emblem: guildData.emblem || "🏆",
      specialization: guildData.specialization || "general",
      category: guildData.category || "Other",
      members: 1,
      membersList: [currentUser.id],
      poster: currentUser,
      admins: [currentUser.id],
      createdAt: new Date(),
      applications: [],
    }

    setGuilds([newGuild, ...guilds])
    setShowCreateGuildModal(false)
    showToast("Your guild has been created!", "success")
  }

  const handleQuestClick = (quest: Quest) => {
    setSelectedQuest(quest)
    setShowQuestDetailsModal(true)
  }

  const handleApplyForGuild = (guildId: number, message: string) => {
    if (!currentUser) {
      showToast("Please log in to apply for guilds", "error")
      setShowAuthModal(true)
      return
    }

    const newApplication: GuildApplication = {
      id: Date.now().toString(),
      guildId: guildId.toString(),
      applicant: {
        id: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.displayName || currentUser.username,
        profileImage: currentUser.avatar,
        skills: currentUser.skills?.map((skill) => ({ name: skill, level: 1 })) || [],
      },
      message,
      status: "pending",
      createdAt: new Date(),
    }

    setGuildApplications([...guildApplications, newApplication])
    showToast("Guild application submitted successfully!", "success")
  }

  const handleGoldPurchase = (amount: number) => {
    if (!currentUser) return

    const updatedUser = {
      ...currentUser,
      gold: (currentUser.gold || 0) + amount,
    }

    setCurrentUser(updatedUser)
    setShowGoldPurchaseModal(false)
    showToast(`Successfully purchased ${amount} gold!`, "success")
  }

  const handleApplyForQuest = (questId: number) => {
    if (!currentUser) {
      showToast("Please log in to apply for quests", "error")
      setShowAuthModal(true)
      return
    }

    if (!selectedQuest) return

    if (selectedQuest.applicants.some((app) => app.userId === currentUser.id)) {
      showToast("You have already applied for this quest", "error")
      return
    }

    const application = {
      id: Date.now(),
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      appliedAt: new Date(),
      status: "pending" as const,
      message: "I'm interested in this quest and believe I have the skills to complete it successfully.",
    }

    setQuests((prev) => prev.map((q) => (q.id === questId ? { ...q, applicants: [...q.applicants, application] } : q)))

    showToast("Application submitted successfully!")
    setShowQuestDetailsModal(false)
  }

  return (
    <main className="min-h-screen bg-[#F4F0E6]">
      <Navbar
        currentUser={currentUser}
        setActiveSection={setActiveSection}
        handleLogout={handleLogout}
        openAuthModal={() => {
          setAuthMode("login")
          setShowAuthModal(true)
        }}
        openGoldPurchaseModal={() => setShowGoldPurchaseModal(true)}
        openPostQuestModal={() => setShowPostQuestModal(true)}
        openCreateGuildModal={() => setShowCreateGuildModal(true)}
      />

      {activeSection === "home" && (
        <Hero
          currentUser={currentUser}
          openAuthModal={() => {
            setAuthMode("login")
            setShowAuthModal(true)
          }}
          openRegisterModal={() => {
            setAuthMode("register")
            setShowAuthModal(true)
          }}
          navigateToSection={setActiveSection}
        />
      )}

      {activeSection === "quest-board" && (
        <QuestBoard
          quests={quests}
          currentUser={currentUser}
          openQuestDetails={handleQuestClick}
          openPostQuestModal={() => setShowPostQuestModal(true)}
          openApplications={(quest) => {
            setSelectedQuest(quest)
            setShowApplicationsModal(true)
          }}
        />
      )}

      {activeSection === "guild-hall" && (
        <GuildHall
          guilds={guilds}
          currentUser={currentUser}
          openCreateGuildModal={() => setShowCreateGuildModal(true)}
          handleApplyForGuild={handleApplyForGuild}
        />
      )}

      {activeSection === "profile" && currentUser && (
        <Profile currentUser={currentUser} quests={quests} guilds={guilds} navigateToSection={setActiveSection} />
      )}

      {activeSection === "settings" && currentUser && (
        <Settings
          user={currentUser}
          updateSettings={(updatedUser) => setCurrentUser(updatedUser)}
          showToast={showToast}
        />
      )}

      {activeSection === "about" && <About />}

      {activeSection === "search" && <UserSearch users={users} />}

      {activeSection === "messages" && currentUser && (
        <MessagingSystem currentUser={currentUser} showToast={showToast} />
      )}

      {activeSection === "quest-management" && currentUser && (
        <QuestManagement
          quests={quests}
          currentUser={currentUser}
          onQuestStatusChange={(questId, newStatus) => {
            const updatedQuests = quests.map((q) => (q.id === questId ? { ...q, status: newStatus } : q))
            setQuests(updatedQuests)
            showToast(`Quest status updated to ${newStatus}`, "success")
          }}
          setQuests={setQuests}
          showToast={showToast}
        />
      )}

      {activeSection === "guild-management" && currentUser && (
        <GuildManagement
          guilds={guilds}
          guildApplications={guildApplications}
          currentUser={currentUser}
          showToast={showToast}
          onViewGuild={(guild) => {
            // Handle view guild
            showToast(`Viewing guild: ${guild.name}`, "info")
          }}
          onEditGuild={(guild) => {
            // Handle edit guild
            showToast(`Editing guild: ${guild.name}`, "info")
          }}
          onDeleteGuild={(guildId) => {
            // Handle delete guild
            setGuilds(guilds.filter((g) => g.id !== Number.parseInt(guildId)))
            showToast("Guild deleted successfully", "success")
          }}
          onApproveApplication={(applicationId) => {
            // Handle approve application
            const application = guildApplications.find((app) => app.id === applicationId)
            if (application) {
              const updatedApplications = guildApplications.map((app) =>
                app.id === applicationId ? { ...app, status: "accepted" } : app,
              )
              setGuildApplications(updatedApplications)

              // Add user to guild members
              const guildId = Number.parseInt(application.guildId)
              const updatedGuilds = guilds.map((guild) => {
                if (guild.id === guildId) {
                  const membersList = guild.membersList || []
                  if (!membersList.includes(application.applicant.id)) {
                    return {
                      ...guild,
                      members: (guild.members || 0) + 1,
                      membersList: [...membersList, application.applicant.id],
                    }
                  }
                }
                return guild
              })
              setGuilds(updatedGuilds)

              showToast("Application approved", "success")
            }
          }}
          onRejectApplication={(applicationId) => {
            // Handle reject application
            const updatedApplications = guildApplications.map((app) =>
              app.id === applicationId ? { ...app, status: "rejected" } : app,
            )
            setGuildApplications(updatedApplications)
            showToast("Application rejected", "success")
          }}
          onManageMembers={(guild) => {
            // Handle manage members
            showToast(`Managing members for guild: ${guild.name}`, "info")
          }}
        />
      )}

      {activeSection === "admin" && currentUser && currentUser.roles && currentUser.roles.includes("admin") && (
        <AdminPanel
          currentUser={currentUser}
          users={users}
          quests={quests}
          guilds={guilds}
          setUsers={setUsers}
          setQuests={setQuests}
          setGuilds={setGuilds}
          showToast={showToast}
        />
      )}

      <Footer />

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        setMode={setAuthMode}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onForgotPassword={handleForgotPassword}
      />

      <PostQuestModal
        isOpen={showPostQuestModal}
        onClose={() => setShowPostQuestModal(false)}
        currentUser={currentUser}
        onSubmit={handleQuestSubmit}
      />

      <CreateGuildModal
        isOpen={showCreateGuildModal}
        onClose={() => setShowCreateGuildModal(false)}
        currentUser={currentUser}
        onSubmit={handleGuildSubmit}
      />

      {selectedQuest && (
        <QuestDetailsModal
          isOpen={showQuestDetailsModal}
          onClose={() => setShowQuestDetailsModal(false)}
          quest={selectedQuest}
          currentUser={currentUser}
          isAuthenticated={!!currentUser}
          setQuests={setQuests}
          showToast={showToast}
          setAuthModalOpen={setShowAuthModal}
        />
      )}

      <ApplicationsModal
        isOpen={showApplicationsModal}
        onClose={() => setShowApplicationsModal(false)}
        quests={quests}
        currentUser={currentUser}
        setQuests={setQuests}
      />

      <GoldSystemModal
        isOpen={showGoldPurchaseModal}
        onClose={() => setShowGoldPurchaseModal(false)}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        showToast={showToast}
      />

      {/* Toast Notifications */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </main>
  )
}
