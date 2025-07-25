"use client"
import { useState } from "react"
import type { Guild, User } from "@/lib/types"
import { GuildOverviewModal } from "./guild-overview-modal"
import { GuildChatModal } from "./guild-chat-modal"

interface GuildHallProps {
  guilds: Guild[]
  currentUser: User | null
  openCreateGuildModal: () => void
  handleApplyForGuild: (guildId: number, message: string) => void
  showToast: (message: string, type?: string) => void
}

export function GuildHall({
  guilds,
  currentUser,
  openCreateGuildModal,
  handleApplyForGuild,
  showToast,
}: GuildHallProps) {
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [selectedGuildId, setSelectedGuildId] = useState<number | null>(null)
  const [joinMessage, setJoinMessage] = useState("")
  const [showOverviewModal, setShowOverviewModal] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null)

  const handleJoinClick = (guildId: number) => {
    if (!currentUser) {
      if (window.openAuthModal) window.openAuthModal()
      return
    }

    const guild = guilds.find((g) => g.id === guildId)
    if (!guild) return

    if (guild.membersList && guild.membersList.includes(currentUser.id)) {
      showToast("You are already a member of this guild", "error")
      return
    }

    // Open the join modal
    setSelectedGuildId(guildId)
    setShowJoinModal(true)
  }

  const handleGuildCardClick = (guild: Guild) => {
    setSelectedGuild(guild)
    setShowOverviewModal(true)
  }

  const handleOpenChat = (guildId: number) => {
    const guild = guilds.find((g) => g.id === guildId)
    if (guild) {
      setSelectedGuild(guild)
      setShowChatModal(true)
      setShowOverviewModal(false)
    }
  }

  const submitJoinRequest = () => {
    if (selectedGuildId && joinMessage.trim()) {
      handleApplyForGuild(selectedGuildId, joinMessage)
      setShowJoinModal(false)
      setJoinMessage("")
      setSelectedGuildId(null)
    }
  }

  const getSpecializationBadgeColor = (specialization: string) => {
    switch (specialization.toLowerCase()) {
      case "alchemy":
        return "bg-purple-500"
      case "development":
        return "bg-blue-500"
      case "writing":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <section className="bg-[#F4F0E6] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-[#2C1A1D] font-serif">Guild Hall</h2>
          {currentUser && (
            <button
              onClick={openCreateGuildModal}
              className="bg-[#8B75AA] text-white px-4 py-2 rounded hover:bg-[#7A6699] transition-colors"
            >
              Create a Guild
            </button>
          )}
        </div>
        <p className="text-center text-[#8B75AA] mb-8">
          JOIN OR CREATE A GUILD TO COLLABORATE WITH OTHER ADVENTURERS ON LARGER QUESTS.
        </p>

        {/* Guild Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {guilds.map((guild) => (
            <div
              key={guild.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#CDAA7D]/20 hover:border-[#8B75AA]/30 cursor-pointer group"
              onClick={() => handleGuildCardClick(guild)}
            >
              {/* Guild Header with Gradient */}
              <div className="bg-gradient-to-r from-[#CDAA7D] to-[#B8956D] p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl shadow-lg">
                      {guild.emblem}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-xl leading-tight font-serif mb-1">{guild.name}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${getSpecializationBadgeColor(guild.specialization)}`}
                      >
                        {guild.specialization.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guild Content */}
              <div className="p-6">
                <p className="text-[#2C1A1D] text-sm leading-relaxed mb-6 line-clamp-3">{guild.description}</p>

                {/* Guild Stats */}
                <div className="bg-gradient-to-r from-[#F4F0E6] to-[#F8F4EA] rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-[#8B75AA] text-lg">👥</span>
                        <span className="text-[#2C1A1D] font-bold text-lg">{guild.members}</span>
                      </div>
                      <span className="text-[#8B75AA] text-xs uppercase tracking-wide">Members</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-yellow-500 text-lg">💰</span>
                        <span className="text-[#2C1A1D] font-bold text-lg">{guild.funds || 0}</span>
                      </div>
                      <span className="text-[#8B75AA] text-xs uppercase tracking-wide">Guild Gold</span>
                    </div>
                  </div>
                </div>

                {/* Specialization */}
                <div className="flex items-center gap-2 text-sm text-[#8B75AA] mb-6 bg-[#8B75AA]/5 rounded-lg p-3">
                  <span className="text-lg">⚡</span>
                  <div>
                    <span className="font-medium">Specialization: </span>
                    <span className="font-bold uppercase">{guild.specialization}</span>
                  </div>
                </div>

                {/* Guild Master */}
                <div className="flex items-center gap-3 mb-6 p-3 bg-[#CDAA7D]/5 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#8B75AA] to-[#7A6699] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {guild.poster.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-[#2C1A1D]">{guild.poster.username}</div>
                    <div className="text-xs text-[#8B75AA] uppercase tracking-wide">Guild Master</div>
                  </div>
                </div>
              </div>

              {/* Guild Footer */}
              <div className="border-t border-[#CDAA7D]/20 p-6 bg-gradient-to-r from-[#F4F0E6] to-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-[#8B75AA]">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="font-medium">Active Guild</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleJoinClick(guild.id)
                    }}
                    disabled={currentUser && guild.membersList && guild.membersList.includes(currentUser.id)}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md ${
                      currentUser && guild.membersList && guild.membersList.includes(currentUser.id)
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-[#8B75AA] text-white hover:bg-[#7A6699] hover:shadow-lg transform hover:-translate-y-0.5"
                    }`}
                  >
                    {currentUser && guild.membersList && guild.membersList.includes(currentUser.id)
                      ? "✓ JOINED"
                      : "JOIN GUILD"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Join Guild Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#F4F0E6] rounded-lg w-full max-w-md p-6">
              <h3 className="text-xl font-bold text-[#2C1A1D] mb-4">Join Guild</h3>
              <p className="text-[#2C1A1D] mb-4">
                Why do you want to join this guild? Please provide a brief message to the guild admins.
              </p>
              <textarea
                className="w-full px-3 py-2 border border-[#CDAA7D] rounded bg-white text-[#2C1A1D] placeholder-[#8B75AA] focus:outline-none focus:border-[#8B75AA] h-24 resize-none mb-4"
                placeholder="I want to join because..."
                value={joinMessage}
                onChange={(e) => setJoinMessage(e.target.value)}
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 border border-[#CDAA7D] rounded text-[#2C1A1D] hover:bg-[#CDAA7D] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitJoinRequest}
                  className="px-4 py-2 bg-[#8B75AA] text-white rounded hover:bg-[#7A6699] transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Guild Overview Modal */}
        {selectedGuild && (
          <GuildOverviewModal
            isOpen={showOverviewModal}
            onClose={() => setShowOverviewModal(false)}
            guild={selectedGuild}
            currentUser={currentUser}
            onJoinGuild={handleApplyForGuild}
            onOpenChat={handleOpenChat}
            showToast={showToast}
          />
        )}

        {/* Guild Chat Modal */}
        {selectedGuild && (
          <GuildChatModal
            isOpen={showChatModal}
            onClose={() => setShowChatModal(false)}
            guild={selectedGuild}
            currentUser={currentUser}
            showToast={showToast}
          />
        )}

        {/* Features Section */}
        <section>
          <h2 className="text-4xl font-bold text-center mb-4 text-[#2C1A1D] font-serif">Why Join Our Tavern?</h2>
          <p className="text-center text-[#8B75AA] mb-12">
            PEERQUEST TAVERN OFFERS UNIQUE FEATURES TO ENHANCE YOUR COLLABORATIVE JOURNEY.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Skill Showcase */}
            <div className="bg-white border border-[#CDAA7D] rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-[#CDAA7D] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-[#2C1A1D]">Skill Showcase</h3>
              <p className="text-[#8B75AA] leading-relaxed">
                DISPLAY YOUR TALENTS THROUGH COMPLETED QUESTS AND BUILD A PORTFOLIO THAT SHOWCASES YOUR ABILITIES TO
                POTENTIAL COLLABORATORS.
              </p>
            </div>

            {/* Guild System */}
            <div className="bg-white border border-[#CDAA7D] rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-[#CDAA7D] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-[#2C1A1D]">Guild System</h3>
              <p className="text-[#8B75AA] leading-relaxed">
                JOIN SPECIALIZED GUILDS TO CONNECT WITH LIKE-MINDED INDIVIDUALS, SHARE RESOURCES, AND COLLABORATE ON
                LARGER PROJECTS.
              </p>
            </div>

            {/* Reputation System */}
            <div className="bg-white border border-[#CDAA7D] rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-[#CDAA7D] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-[#2C1A1D]">Reputation System</h3>
              <p className="text-[#8B75AA] leading-relaxed">
                EARN BADGES AND INCREASE YOUR REPUTATION BY SUCCESSFULLY COMPLETING QUESTS AND RECEIVING POSITIVE
                FEEDBACK FROM OTHER ADVENTURERS.
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}
