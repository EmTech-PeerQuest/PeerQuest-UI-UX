"use client"

import { useState } from "react"
import { X } from "lucide-react"
import type { User, Quest } from "@/lib/types"

interface PostQuestModalProps {
  isOpen: boolean
  onClose: () => void
  currentUser?: User | null
  onSubmit?: (questData: Partial<Quest>) => void
}

export function PostQuestModal({ isOpen, onClose, currentUser, onSubmit }: PostQuestModalProps) {
  const [questForm, setQuestForm] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: 2,
    reward: "",
    deadline: "",
    postAs: "",
  })

  if (!isOpen) return null

  const handleSubmit = () => {
    if (!currentUser) {
      alert("Please log in to post quests")
      return
    }

    if (!questForm.title || !questForm.description || !questForm.category || !questForm.reward || !questForm.deadline) {
      alert("Please fill in all required fields")
      return
    }

    const newQuest: Partial<Quest> = {
      title: questForm.title,
      description: questForm.description,
      category: questForm.category,
      difficulty: questForm.difficulty === 1 ? "easy" : questForm.difficulty === 2 ? "medium" : "hard",
      reward: Number.parseInt(questForm.reward),
      xp: questForm.difficulty === 1 ? 50 : questForm.difficulty === 2 ? 75 : 150,
      deadline: new Date(questForm.deadline),
      poster: currentUser,
    }

    if (onSubmit) {
      onSubmit(newQuest)
    }

    setQuestForm({
      title: "",
      description: "",
      category: "",
      difficulty: 2,
      reward: "",
      deadline: "",
      postAs: "",
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#F4F0E6] rounded-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#CDAA7D] px-6 py-4 rounded-t-lg flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-bold text-[#2C1A1D]">Post a New Quest</h2>
          <button onClick={onClose} className="text-[#2C1A1D] hover:text-[#8B75AA] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-4">
          {/* Quest Title */}
          <div>
            <label className="block text-sm font-medium text-[#2C1A1D] mb-2">QUEST TITLE</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-[#CDAA7D] rounded bg-white text-[#2C1A1D] placeholder-[#8B75AA] focus:outline-none focus:border-[#8B75AA]"
              placeholder="ENTER A TITLE FOR YOUR QUEST"
              value={questForm.title}
              onChange={(e) => setQuestForm((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          {/* Quest Description */}
          <div>
            <label className="block text-sm font-medium text-[#2C1A1D] mb-2">QUEST DESCRIPTION</label>
            <textarea
              className="w-full px-3 py-2 border border-[#CDAA7D] rounded bg-white text-[#2C1A1D] placeholder-[#8B75AA] focus:outline-none focus:border-[#8B75AA] h-24 resize-none"
              placeholder="DESCRIBE YOUR QUEST IN DETAIL"
              value={questForm.description}
              onChange={(e) => setQuestForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[#2C1A1D] mb-2">CATEGORY</label>
            <select
              className="w-full px-3 py-2 border border-[#CDAA7D] rounded bg-white text-[#2C1A1D] focus:outline-none focus:border-[#8B75AA]"
              value={questForm.category}
              onChange={(e) => setQuestForm((prev) => ({ ...prev, category: e.target.value }))}
            >
              <option value="">SELECT A CATEGORY</option>
              <option value="design">DESIGN</option>
              <option value="development">DEVELOPMENT</option>
              <option value="writing">WRITING</option>
              <option value="music">MUSIC</option>
              <option value="art">ART</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-[#2C1A1D] mb-2">DIFFICULTY</label>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-[#8B75AA]">
                <span>EASY</span>
                <span>MEDIUM</span>
                <span>HARD</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                value={questForm.difficulty}
                onChange={(e) => setQuestForm((prev) => ({ ...prev, difficulty: Number.parseInt(e.target.value) }))}
                className="w-full h-2 bg-gradient-to-r from-green-500 via-orange-500 to-red-500 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-center font-medium text-[#2C1A1D]">
                {questForm.difficulty === 1
                  ? "EASY (50 XP)"
                  : questForm.difficulty === 2
                    ? "MEDIUM (75 XP)"
                    : "HARD (150 XP)"}
              </div>
            </div>
          </div>

          {/* Reward */}
          <div>
            <label className="block text-sm font-medium text-[#2C1A1D] mb-2">REWARD (GOLD)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-[#CDAA7D] rounded bg-white text-[#2C1A1D] placeholder-[#8B75AA] focus:outline-none focus:border-[#8B75AA]"
              placeholder="ENTER REWARD AMOUNT"
              value={questForm.reward}
              onChange={(e) => setQuestForm((prev) => ({ ...prev, reward: e.target.value }))}
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-[#2C1A1D] mb-2">DEADLINE</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-[#CDAA7D] rounded bg-white text-[#2C1A1D] focus:outline-none focus:border-[#8B75AA]"
              value={questForm.deadline}
              onChange={(e) => setQuestForm((prev) => ({ ...prev, deadline: e.target.value }))}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Post As */}
          <div>
            <label className="block text-sm font-medium text-[#2C1A1D] mb-2">POST AS</label>
            <select
              className="w-full px-3 py-2 border border-[#CDAA7D] rounded bg-white text-[#2C1A1D] focus:outline-none focus:border-[#8B75AA]"
              value={questForm.postAs}
              onChange={(e) => setQuestForm((prev) => ({ ...prev, postAs: e.target.value }))}
            >
              <option value="">INDIVIDUAL (YOUR USERNAME)</option>
              <option value="guild">GUILD REPRESENTATIVE</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 border border-[#CDAA7D] py-3 rounded font-medium text-[#2C1A1D] hover:bg-[#CDAA7D] hover:text-white transition-colors"
            >
              CANCEL
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-[#8B75AA] text-white py-3 rounded font-medium hover:bg-[#7A6699] transition-colors"
            >
              POST QUEST
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
