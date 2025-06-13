"use client"

import { useState } from "react"
import { X } from "lucide-react"
import type { User, Guild } from "@/lib/types"

interface CreateGuildModalProps {
  isOpen: boolean
  onClose: () => void
  currentUser?: User | null
  onSubmit?: (guildData: Partial<Guild>) => void
}

export function CreateGuildModal({ isOpen, onClose, currentUser, onSubmit }: CreateGuildModalProps) {
  const [guildForm, setGuildForm] = useState({
    name: "",
    description: "",
    emblem: "🧪",
    specialization: "",
    privacy: "public",
    customEmblem: false,
  })

  const emblems = ["🧪", "🌙", "🔥", "🌿", "🥕", "🍂", "🔮", "💎"]

  if (!isOpen) return null

  const handleSubmit = () => {
    if (!currentUser) {
      alert("Please log in to create a guild")
      return
    }

    if (!guildForm.name || !guildForm.description || !guildForm.specialization) {
      alert("Please fill in all required fields")
      return
    }

    const newGuild: Partial<Guild> = {
      name: guildForm.name,
      description: guildForm.description,
      emblem: guildForm.emblem,
      specialization: guildForm.specialization,
      privacy: guildForm.privacy,
      poster: currentUser,
      members: 1,
      membersList: [currentUser.id],
    }

    if (onSubmit) {
      onSubmit(newGuild)
    }

    setGuildForm({
      name: "",
      description: "",
      emblem: "🧪",
      specialization: "",
      privacy: "public",
      customEmblem: false,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#F4F0E6] rounded-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#CDAA7D] px-6 py-4 rounded-t-lg flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-bold text-[#2C1A1D]">Create a New Guild</h2>
          <button onClick={onClose} className="text-[#2C1A1D] hover:text-[#8B75AA] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-4">
          {/* Guild Name */}
          <div>
            <label className="block text-sm font-medium text-[#2C1A1D] mb-2">GUILD NAME</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-[#CDAA7D] rounded bg-white text-[#2C1A1D] placeholder-[#8B75AA] focus:outline-none focus:border-[#8B75AA]"
              placeholder="ENTER A NAME FOR YOUR GUILD"
              value={guildForm.name}
              onChange={(e) => setGuildForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>

          {/* Guild Description */}
          <div>
            <label className="block text-sm font-medium text-[#2C1A1D] mb-2">GUILD DESCRIPTION</label>
            <textarea
              className="w-full px-3 py-2 border border-[#CDAA7D] rounded bg-white text-[#2C1A1D] placeholder-[#8B75AA] focus:outline-none focus:border-[#8B75AA] h-24 resize-none"
              placeholder="DESCRIBE YOUR GUILD'S PURPOSE AND GOALS..."
              value={guildForm.description}
              onChange={(e) => setGuildForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* Guild Emblem */}
          <div>
            <label className="block text-sm font-medium text-[#2C1A1D] mb-2">GUILD EMBLEM</label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {emblems.map((emblem) => (
                <button
                  key={emblem}
                  type="button"
                  onClick={() => setGuildForm((prev) => ({ ...prev, emblem }))}
                  className={`h-12 flex items-center justify-center text-xl border rounded ${
                    guildForm.emblem === emblem
                      ? "border-[#8B75AA] bg-[#8B75AA]/10"
                      : "border-[#CDAA7D] hover:bg-[#CDAA7D]/10"
                  }`}
                >
                  {emblem}
                </button>
              ))}
            </div>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="customEmblem"
                checked={guildForm.customEmblem}
                onChange={(e) => setGuildForm((prev) => ({ ...prev, customEmblem: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="customEmblem" className="text-sm text-[#2C1A1D]">
                UPLOAD CUSTOM EMBLEM
              </label>
            </div>
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-medium text-[#2C1A1D] mb-2">SPECIALIZATION</label>
            <select
              className="w-full px-3 py-2 border border-[#CDAA7D] rounded bg-white text-[#2C1A1D] focus:outline-none focus:border-[#8B75AA]"
              value={guildForm.specialization}
              onChange={(e) => setGuildForm((prev) => ({ ...prev, specialization: e.target.value }))}
            >
              <option value="">SELECT A SPECIALIZATION</option>
              <option value="alchemy">ALCHEMY</option>
              <option value="protection">PROTECTION</option>
              <option value="design">ART & DESIGN</option>
              <option value="development">DEVELOPMENT</option>
              <option value="writing">WRITING</option>
              <option value="music">MUSIC</option>
            </select>
          </div>

          {/* Privacy */}
          <div>
            <label className="block text-sm font-medium text-[#2C1A1D] mb-2">PRIVACY</label>
            <select
              className="w-full px-3 py-2 border border-[#CDAA7D] rounded bg-white text-[#2C1A1D] focus:outline-none focus:border-[#8B75AA]"
              value={guildForm.privacy}
              onChange={(e) => setGuildForm((prev) => ({ ...prev, privacy: e.target.value }))}
            >
              <option value="public">PUBLIC (ANYONE CAN JOIN)</option>
              <option value="private">PRIVATE (INVITATION ONLY)</option>
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
              CREATE GUILD
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
