"use client"

import { useState } from "react"
import { Search, ChevronDown, ChevronUp, Edit, Trash, CheckCircle, XCircle, Users, Shield } from "lucide-react"
import type { Guild, User, GuildApplication } from "@/lib/types"

interface GuildManagementProps {
  guilds: Guild[]
  guildApplications: GuildApplication[]
  currentUser: User
  showToast: (message: string, type?: string) => void
  onViewGuild: (guild: Guild) => void
  onEditGuild: (guild: Guild) => void
  onDeleteGuild: (guildId: string) => void
  onApproveApplication: (applicationId: string) => void
  onRejectApplication: (applicationId: string) => void
  onManageMembers: (guild: Guild) => void
}

export function GuildManagement({
  guilds,
  guildApplications,
  currentUser,
  showToast,
  onViewGuild,
  onEditGuild,
  onDeleteGuild,
  onApproveApplication,
  onRejectApplication,
  onManageMembers,
}: GuildManagementProps) {
  const [activeTab, setActiveTab] = useState<"owned" | "member" | "applications">("owned")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedGuildId, setExpandedGuildId] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)

  // Get guilds where the current user is an admin
  const ownedGuilds = guilds.filter((guild) => guild.admins && guild.admins.includes(currentUser.id))

  // Get guilds where the current user is a member but not an admin
  const memberGuilds = guilds.filter(
    (guild) =>
      guild.membersList &&
      guild.membersList.includes(currentUser.id) &&
      (!guild.admins || !guild.admins.includes(currentUser.id)),
  )

  // Get applications for the current user's guilds
  const relevantApplications = guildApplications.filter((app) => {
    const guild = guilds.find((g) => g.id.toString() === app.guildId)
    return guild && guild.admins && guild.admins.includes(currentUser.id)
  })

  // Filter based on active tab and search query
  const getFilteredItems = () => {
    let items: (Guild | GuildApplication)[] = []

    if (activeTab === "owned") {
      items = ownedGuilds
    } else if (activeTab === "member") {
      items = memberGuilds
    } else {
      items = relevantApplications
    }

    // Apply search filter
    if (searchQuery) {
      if (activeTab === "applications") {
        return (items as GuildApplication[]).filter((app) => {
          const guild = guilds.find((g) => g.id.toString() === app.guildId)
          return (
            guild?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.applicant.username.toLowerCase().includes(searchQuery.toLowerCase())
          )
        })
      } else {
        return (items as Guild[]).filter((guild) => guild.name.toLowerCase().includes(searchQuery.toLowerCase()))
      }
    }

    return items
  }

  const filteredItems = getFilteredItems()

  const getApplicationStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      case "pending":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <section className="bg-[#F4F0E6] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-[#2C1A1D] font-serif mb-6">Guild Management</h2>

        {/* Tabs */}
        <div className="flex border-b border-[#CDAA7D] mb-6 overflow-x-auto">
          <button
            className={`px-6 py-3 font-medium whitespace-nowrap ${
              activeTab === "owned"
                ? "text-[#8B75AA] border-b-2 border-[#8B75AA]"
                : "text-[#2C1A1D] hover:text-[#8B75AA]"
            }`}
            onClick={() => setActiveTab("owned")}
          >
            Owned Guilds
          </button>
          <button
            className={`px-6 py-3 font-medium whitespace-nowrap ${
              activeTab === "member"
                ? "text-[#8B75AA] border-b-2 border-[#8B75AA]"
                : "text-[#2C1A1D] hover:text-[#8B75AA]"
            }`}
            onClick={() => setActiveTab("member")}
          >
            Member Guilds
          </button>
          <button
            className={`px-6 py-3 font-medium whitespace-nowrap ${
              activeTab === "applications"
                ? "text-[#8B75AA] border-b-2 border-[#8B75AA]"
                : "text-[#2C1A1D] hover:text-[#8B75AA]"
            }`}
            onClick={() => setActiveTab("applications")}
          >
            Guild Applications
            {relevantApplications.filter((app) => app.status === "pending").length > 0 && (
              <span className="ml-2 bg-[#8B75AA] text-white text-xs rounded-full px-2 py-1">
                {relevantApplications.filter((app) => app.status === "pending").length}
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder={activeTab === "applications" ? "Search applications..." : "Search guilds..."}
              className="w-full px-4 py-3 pl-10 border border-[#CDAA7D] rounded bg-white text-[#2C1A1D] focus:outline-none focus:border-[#8B75AA]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#CDAA7D]" />
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab !== "applications" ? (
          // Guilds List (Owned or Member)
          filteredItems.length > 0 ? (
            <div className="space-y-4">
              {(filteredItems as Guild[]).map((guild) => (
                <div key={guild.id} className="bg-white border border-[#CDAA7D] rounded-lg overflow-hidden">
                  {/* Guild Header */}
                  <div className="bg-[#CDAA7D] p-4 flex justify-between items-start">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{guild.emblem}</span>
                      <h3 className="font-bold text-[#2C1A1D]">{guild.name}</h3>
                    </div>

                    {activeTab === "owned" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEditGuild(guild)}
                          className="p-2 bg-[#8B75AA] text-white rounded hover:bg-[#7A6699] transition-colors"
                          title="Edit Guild"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(guild.id)}
                          className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          title="Delete Guild"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Guild Summary */}
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <span className="text-[#8B75AA]">⚡</span>
                          <span className="text-[#8B75AA] font-medium">{guild.specialization.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[#8B75AA]">👥</span>
                          <span className="text-[#2C1A1D] font-medium">{guild.members} MEMBERS</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setExpandedGuildId(expandedGuildId === guild.id ? null : guild.id)}
                        className="text-[#8B75AA] hover:text-[#7A6699]"
                      >
                        {expandedGuildId === guild.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>

                    {/* Expanded Content */}
                    {expandedGuildId === guild.id && (
                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <p className="text-[#2C1A1D] mb-4">{guild.description}</p>

                        {/* Action Buttons */}
                        <div className="mt-4 flex justify-end gap-3">
                          <button
                            onClick={() => onViewGuild(guild)}
                            className="px-4 py-2 border border-[#CDAA7D] rounded text-[#2C1A1D] hover:bg-[#CDAA7D] hover:text-white transition-colors"
                          >
                            View Details
                          </button>

                          {activeTab === "owned" && (
                            <button
                              onClick={() => onManageMembers(guild)}
                              className="px-4 py-2 bg-[#8B75AA] text-white rounded hover:bg-[#7A6699] transition-colors flex items-center gap-2"
                            >
                              <Users size={16} />
                              <span>Manage Members</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#CDAA7D] rounded-lg p-8 text-center">
              <Shield size={48} className="mx-auto mb-4 text-[#CDAA7D]" />
              <h3 className="text-xl font-bold text-[#2C1A1D] mb-2">No Guilds Found</h3>
              <p className="text-[#8B75AA]">
                {activeTab === "owned"
                  ? "You don't own any guilds yet. Create a new guild to get started!"
                  : "You're not a member of any guilds yet. Join a guild from the Guild Hall!"}
              </p>
            </div>
          )
        ) : // Applications List
        filteredItems.length > 0 ? (
          <div className="space-y-4">
            {(filteredItems as GuildApplication[]).map((application) => {
              const guild = guilds.find((g) => g.id.toString() === application.guildId)
              if (!guild) return null

              return (
                <div key={application.id} className="bg-white border border-[#CDAA7D] rounded-lg overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{guild.emblem}</span>
                          <h3 className="font-bold text-[#2C1A1D]">{guild.name}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold text-white ${getApplicationStatusBadgeColor(
                              application.status,
                            )}`}
                          >
                            {application.status.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            Applied: {new Date(application.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {application.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => onApproveApplication(application.id)}
                            className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                            title="Approve"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => onRejectApplication(application.id)}
                            className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                            title="Reject"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#8B75AA] rounded-full flex items-center justify-center text-white flex-shrink-0">
                        {application.applicant.profileImage || application.applicant.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-[#2C1A1D]">{application.applicant.displayName}</p>
                        <p className="text-sm text-gray-500">@{application.applicant.username}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded mb-3">
                      <p className="text-[#2C1A1D] text-sm">{application.message}</p>
                    </div>

                    {application.applicant.skills && application.applicant.skills.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-[#2C1A1D] mb-2">Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {application.applicant.skills.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-[#8B75AA]/10 text-[#8B75AA] rounded text-xs">
                              {skill.name} {skill.level && `(Lvl ${skill.level})`}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white border border-[#CDAA7D] rounded-lg p-8 text-center">
            <Shield size={48} className="mx-auto mb-4 text-[#CDAA7D]" />
            <h3 className="text-xl font-bold text-[#2C1A1D] mb-2">No Applications Found</h3>
            <p className="text-[#8B75AA]">There are no pending applications for your guilds at the moment.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-[#2C1A1D] mb-4">Confirm Deletion</h3>
            <p className="text-[#2C1A1D] mb-6">
              Are you sure you want to delete this guild? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-[#CDAA7D] rounded text-[#2C1A1D] hover:bg-[#CDAA7D] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteGuild(showDeleteConfirm.toString())
                  setShowDeleteConfirm(null)
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete Guild
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
