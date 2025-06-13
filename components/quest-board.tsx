"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import type { Quest } from "@/lib/types"
import { formatTimeRemaining } from "@/lib/utils"

interface QuestBoardProps {
  quests: Quest[]
  currentUser: any
  openQuestDetails: (quest: Quest) => void
  openPostQuestModal: () => void
  openApplications: (quest: Quest) => void
}

export function QuestBoard({
  quests,
  currentUser,
  openQuestDetails,
  openPostQuestModal,
  openApplications,
}: QuestBoardProps) {
  const [questFilters, setQuestFilters] = useState({
    search: "",
    category: "ALL CATEGORIES",
    difficulty: "ALL DIFFICULTIES",
    status: "ALL STATUSES",
  })

  const filteredQuests = quests.filter((quest) => {
    const matchesSearch =
      quest.title.toLowerCase().includes(questFilters.search.toLowerCase()) ||
      quest.description.toLowerCase().includes(questFilters.search.toLowerCase())
    const matchesCategory =
      questFilters.category === "ALL CATEGORIES" || quest.category.toUpperCase() === questFilters.category
    const matchesDifficulty =
      questFilters.difficulty === "ALL DIFFICULTIES" || quest.difficulty.toUpperCase() === questFilters.difficulty
    const matchesStatus = questFilters.status === "ALL STATUSES" || quest.status.toUpperCase() === questFilters.status

    return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500"
      case "medium":
        return "bg-orange-500"
      case "hard":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <section className="bg-[#F4F0E6] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-[#2C1A1D] font-serif">Latest Quests</h2>
          {currentUser && (
            <button
              onClick={openPostQuestModal}
              className="bg-[#8B75AA] text-white px-4 py-2 rounded hover:bg-[#7A6699] transition-colors"
            >
              Post a Quest
            </button>
          )}
        </div>
        <p className="text-center text-[#8B75AA] mb-8">
          DISCOVER OPPORTUNITIES TO SHOWCASE YOUR SKILLS AND HELP OTHERS ON THEIR JOURNEY.
        </p>

        {/* Filters */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="SEARCH QUESTS..."
              className="w-full px-4 py-3 pl-10 border border-[#CDAA7D] rounded bg-white text-[#2C1A1D] focus:outline-none focus:border-[#8B75AA]"
              value={questFilters.search}
              onChange={(e) => setQuestFilters((prev) => ({ ...prev, search: e.target.value }))}
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#CDAA7D]" />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <select
                className="w-full px-4 py-2 border border-[#CDAA7D] rounded bg-white text-[#2C1A1D] focus:outline-none focus:border-[#8B75AA]"
                value={questFilters.category}
                onChange={(e) => setQuestFilters((prev) => ({ ...prev, category: e.target.value }))}
              >
                <option>ALL CATEGORIES</option>
                <option>DESIGN</option>
                <option>DEVELOPMENT</option>
                <option>WRITING</option>
                <option>MUSIC</option>
                <option>ART</option>
              </select>
            </div>
            <div className="min-w-48">
              <select
                className="w-full px-4 py-2 border border-[#CDAA7D] rounded bg-white text-[#2C1A1D] focus:outline-none focus:border-[#8B75AA]"
                value={questFilters.difficulty}
                onChange={(e) => setQuestFilters((prev) => ({ ...prev, difficulty: e.target.value }))}
              >
                <option>ALL DIFFICULTIES</option>
                <option>EASY</option>
                <option>MEDIUM</option>
                <option>HARD</option>
              </select>
            </div>
            <div className="min-w-40">
              <select
                className="w-full px-4 py-2 border border-[#CDAA7D] rounded bg-white text-[#2C1A1D] focus:outline-none focus:border-[#8B75AA]"
                value={questFilters.status}
                onChange={(e) => setQuestFilters((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option>ALL STATUSES</option>
                <option>OPEN</option>
                <option>IN-PROGRESS</option>
                <option>COMPLETED</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quest Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuests.map((quest) => (
            <div
              key={quest.id}
              className="bg-white border border-[#CDAA7D] rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Quest Header */}
              <div className="bg-[#CDAA7D] p-4 flex justify-between items-start">
                <h3 className="font-bold text-[#2C1A1D] flex-1 mr-3">{quest.title}</h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold text-white ${getDifficultyColor(quest.difficulty)}`}
                >
                  {quest.difficulty.toUpperCase()}
                </span>
              </div>

              {/* Quest Content */}
              <div className="p-4">
                <p className="text-[#2C1A1D] text-sm mb-4 line-clamp-3">{quest.description}</p>

                <div className="flex justify-between items-center mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[#8B75AA]">💼</span>
                    <span className="text-[#8B75AA]">{quest.category.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-[#CDAA7D]">💰</span>
                      <span className="text-[#2C1A1D] font-medium">{quest.reward}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[#8B75AA]">⭐</span>
                      <span className="text-[#8B75AA] font-medium">{quest.xp}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-[#8B75AA] mb-4">
                  <span>⏰</span>
                  <span>DEADLINE: {formatTimeRemaining(quest.deadline).toUpperCase()}</span>
                </div>
              </div>

              {/* Quest Footer */}
              <div className="border-t border-[#CDAA7D] p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#8B75AA] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {quest.poster.avatar}
                  </div>
                  <span className="text-[#2C1A1D] text-sm font-medium">{quest.poster.name}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openQuestDetails(quest)}
                    className="p-2 border border-[#CDAA7D] rounded hover:bg-[#CDAA7D] hover:text-white transition-colors"
                    title="View Details"
                  >
                    👁️
                  </button>
                  {currentUser && quest.poster.id === currentUser.id && quest.status === "open" && (
                    <button
                      onClick={() => openApplications(quest)}
                      className="p-2 border border-[#CDAA7D] rounded hover:bg-[#CDAA7D] hover:text-white transition-colors"
                      title="View Applications"
                    >
                      📋
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <section className="mt-16">
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
