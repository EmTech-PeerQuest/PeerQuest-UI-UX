"use client"
import { useState } from "react"
import type { Guild, User } from "@/lib/types"

interface GuildHallProps {
  guilds: Guild[]
  currentUser: User | null
  openCreateGuildModal: () => void
  handleApplyForGuild: (guildId: number, message: string) => void
}

export function GuildHall({ guilds, currentUser, openCreateGuildModal, handleApplyForGuild }: GuildHallProps) {
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [selectedGuildId, setSelectedGuildId] = useState<number | null>(null)
  const [joinMessage, setJoinMessage] = useState("")

  const handleJoinClick = (guildId: number) => {
    if (!currentUser) {
      // If there's a function to open auth modal, call it here
      if (window.openAuthModal) window.openAuthModal()
      return
    }

    const guild = guilds.find((g) => g.id === guildId)
    if (!guild) return

    if (guild.membersList && guild.membersList.includes(currentUser.id)) {
      // If there's a toast function, call it here
      if (window.showToast) window.showToast("You are already a member of this guild", "error")
      return
    }

    // Open the join modal
    setSelectedGuildId(guildId)
    setShowJoinModal(true)
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {guilds.map((guild) => (
            <div
              key={guild.id}
              className="bg-white border border-[#CDAA7D] rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Guild Header */}
              <div className="bg-[#CDAA7D] p-4 flex justify-between items-start">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{guild.emblem}</span>
                  <h3 className="font-bold text-[#2C1A1D] flex-1">{guild.name}</h3>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold text-white ${getSpecializationBadgeColor(guild.specialization)}`}
                >
                  {guild.specialization.toUpperCase()}
                </span>
              </div>

              {/* Guild Content */}
              <div className="p-4">
                <p className="text-[#2C1A1D] text-sm mb-4 line-clamp-3">{guild.description}</p>

                <div className="flex justify-between items-center mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[#8B75AA]">⚡</span>
                    <span className="text-[#8B75AA]">{guild.specialization.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#8B75AA]">👥</span>
                    <span className="text-[#2C1A1D] font-medium">{guild.members} MEMBERS</span>
                  </div>
                </div>
              </div>

              {/* Guild Footer */}
              <div className="border-t border-[#CDAA7D] p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#8B75AA] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {guild.poster.avatar}
                  </div>
                  <span className="text-[#2C1A1D] text-sm font-medium">{guild.poster.name}</span>
                </div>
                <button
                  onClick={() => handleJoinClick(guild.id)}
                  disabled={currentUser && guild.membersList && guild.membersList.includes(currentUser.id)}
                  className={`px-4 py-2 rounded font-medium transition-colors ${
                    currentUser && guild.membersList && guild.membersList.includes(currentUser.id)
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#8B75AA] text-white hover:bg-[#7A6699]"
                  }`}
                >
                  {currentUser && guild.membersList && guild.membersList.includes(currentUser.id)
                    ? "JOINED"
                    : "JOIN GUILD"}
                </button>
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
