"use client"

import { X, CircleDollarSign, Star, Clock, Palette, Code, PenTool } from "lucide-react"
import type { Quest, User } from "@/lib/types"
import { formatTimeRemaining, getDifficultyClass } from "@/lib/utils"

interface QuestDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  quest: Quest | null
  currentUser: User | null
  isAuthenticated: boolean
  setQuests: (quests: Quest[] | ((prev: Quest[]) => Quest[])) => void
  showToast: (message: string, type?: string) => void
  setAuthModalOpen: (open: boolean) => void
}

export function QuestDetailsModal({
  isOpen,
  onClose,
  quest,
  currentUser,
  isAuthenticated,
  setQuests,
  showToast,
  setAuthModalOpen,
}: QuestDetailsModalProps) {
  if (!isOpen || !quest) return null

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "design":
        return <Palette size={16} />
      case "development":
        return <Code size={16} />
      case "writing":
        return <PenTool size={16} />
      default:
        return <Palette size={16} />
    }
  }

  const applyForQuest = (questId: number) => {
    if (!isAuthenticated) {
      showToast("Please log in to apply for quests", "error")
      setAuthModalOpen(true)
      return
    }

    if (!currentUser) return

    if (quest.applicants.some((app) => app.userId === currentUser.id)) {
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
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-tavern-brown/10">
          <h2 className="text-2xl font-bold font-medieval">Quest Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-tavern-brown/10 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-3xl font-bold font-medieval flex-1 mr-4">{quest.title}</h3>
              <span className={`badge ${getDifficultyClass(quest.difficulty)}`}>
                {quest.difficulty.charAt(0).toUpperCase() + quest.difficulty.slice(1)}
              </span>
            </div>

            <div className="flex flex-wrap gap-6 mb-5 text-sm text-tavern-brown/80">
              <div className="flex items-center gap-2">
                {getCategoryIcon(quest.category)}
                <span>{quest.category.charAt(0).toUpperCase() + quest.category.slice(1)}</span>
              </div>
              <div className="flex items-center gap-2">
                <CircleDollarSign size={16} />
                <span>{quest.reward} Gold</span>
              </div>
              <div className="flex items-center gap-2 text-tavern-purple">
                <Star size={16} />
                <span>{quest.xp} XP</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{formatTimeRemaining(quest.deadline)}</span>
              </div>
            </div>

            <p className="leading-relaxed mb-6">{quest.description}</p>

            {quest.requirements && quest.requirements.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-bold mb-3 font-medieval">Requirements</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {quest.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-tavern-bronze/10 p-4 rounded-lg flex items-center gap-3">
              <div className="avatar">{quest.poster.avatar}</div>
              <div>
                <div className="font-semibold">Posted by {quest.poster.name}</div>
                <div className="text-sm text-tavern-brown/70">Quest Giver</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-tavern-brown/10">
          <button onClick={onClose} className="btn btn-outline">
            Close
          </button>
          <button
            onClick={() => applyForQuest(quest.id)}
            className="btn btn-primary"
            disabled={!isAuthenticated || quest.applicants.some((app) => app.userId === currentUser?.id)}
          >
            {!isAuthenticated
              ? "Login to Apply"
              : quest.applicants.some((app) => app.userId === currentUser?.id)
                ? "Already Applied"
                : "Apply for Quest"}
          </button>
        </div>
      </div>
    </div>
  )
}
