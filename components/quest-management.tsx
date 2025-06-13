"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter, ChevronDown, ChevronUp, Edit, Trash, CheckCircle, XCircle, Clock } from "lucide-react"
import type { Quest, User } from "@/lib/types"

interface QuestManagementProps {
  quests: Quest[]
  currentUser: User
  onQuestStatusChange: (questId: number, newStatus: string) => void
  setQuests: React.Dispatch<React.SetStateAction<Quest[]>>
  showToast: (message: string, type?: string) => void
}

export function QuestManagement({
  quests,
  currentUser,
  onQuestStatusChange,
  setQuests,
  showToast,
}: QuestManagementProps) {
  const [activeTab, setActiveTab] = useState<"created" | "applied">("created")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<"createdAt" | "deadline" | "reward">("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [expandedQuestId, setExpandedQuestId] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)

  // Filter quests based on active tab and search query
  const filteredQuests = quests
    .filter((quest) => {
      // Filter by tab
      if (activeTab === "created") {
        return quest.poster.id === currentUser.id
      } else {
        return quest.applicants && quest.applicants.some((app) => app.userId === currentUser.id)
      }
    })
    .filter((quest) => {
      // Filter by search query
      if (!searchQuery) return true
      return (
        quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quest.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })

  // Sort quests
  const sortedQuests = [...filteredQuests].sort((a, b) => {
    let aValue, bValue

    if (sortField === "createdAt") {
      aValue = new Date(a.createdAt).getTime()
      bValue = new Date(b.createdAt).getTime()
    } else if (sortField === "deadline") {
      aValue = new Date(a.deadline).getTime()
      bValue = new Date(b.deadline).getTime()
    } else {
      aValue = a.reward
      bValue = b.reward
    }

    return sortDirection === "asc" ? aValue - bValue : bValue - aValue
  })

  const toggleSort = (field: "createdAt" | "deadline" | "reward") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const handleDeleteQuest = (questId: number) => {
    setQuests((prevQuests) => prevQuests.filter((q) => q.id !== questId))
    setShowDeleteConfirm(null)
    showToast("Quest deleted successfully", "success")
  }

  const handleApproveApplicant = (questId: number, applicantId: number) => {
    setQuests((prevQuests) =>
      prevQuests.map((q) => {
        if (q.id === questId) {
          return {
            ...q,
            status: "in-progress",
            applicants: q.applicants.map((app) => {
              if (app.userId === applicantId) {
                return { ...app, status: "accepted" }
              } else {
                return { ...app, status: "rejected" }
              }
            }),
            assignedTo: q.applicants.find((app) => app.userId === applicantId)?.username || "",
          }
        }
        return q
      }),
    )
    showToast("Applicant approved and quest status updated", "success")
  }

  const handleRejectApplicant = (questId: number, applicantId: number) => {
    setQuests((prevQuests) =>
      prevQuests.map((q) => {
        if (q.id === questId) {
          return {
            ...q,
            applicants: q.applicants.map((app) => {
              if (app.userId === applicantId) {
                return { ...app, status: "rejected" }
              }
              return app
            }),
          }
        }
        return q
      }),
    )
    showToast("Applicant rejected", "success")
  }

  const handleCompleteQuest = (questId: number) => {
    onQuestStatusChange(questId, "completed")
    showToast("Quest marked as completed", "success")
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      case "completed":
        return "bg-purple-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getApplicantStatusBadgeColor = (status: string) => {
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
        <h2 className="text-4xl font-bold text-[#2C1A1D] font-serif mb-6">Quest Management</h2>

        {/* Tabs */}
        <div className="flex border-b border-[#CDAA7D] mb-6">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "created"
                ? "text-[#8B75AA] border-b-2 border-[#8B75AA]"
                : "text-[#2C1A1D] hover:text-[#8B75AA]"
            }`}
            onClick={() => setActiveTab("created")}
          >
            Created Quests
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "applied"
                ? "text-[#8B75AA] border-b-2 border-[#8B75AA]"
                : "text-[#2C1A1D] hover:text-[#8B75AA]"
            }`}
            onClick={() => setActiveTab("applied")}
          >
            Applied Quests
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search quests..."
              className="w-full px-4 py-3 pl-10 border border-[#CDAA7D] rounded bg-white text-[#2C1A1D] focus:outline-none focus:border-[#8B75AA]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#CDAA7D]" />
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center">
              <Filter size={16} className="mr-2 text-[#8B75AA]" />
              <span className="text-[#2C1A1D] font-medium mr-2">Sort by:</span>
            </div>

            <button
              className="flex items-center px-3 py-1 border border-[#CDAA7D] rounded bg-white hover:bg-[#F4F0E6]"
              onClick={() => toggleSort("createdAt")}
            >
              <span className={sortField === "createdAt" ? "text-[#8B75AA] font-medium" : "text-[#2C1A1D]"}>
                Date Created
              </span>
              {sortField === "createdAt" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </span>
              )}
            </button>

            <button
              className="flex items-center px-3 py-1 border border-[#CDAA7D] rounded bg-white hover:bg-[#F4F0E6]"
              onClick={() => toggleSort("deadline")}
            >
              <span className={sortField === "deadline" ? "text-[#8B75AA] font-medium" : "text-[#2C1A1D]"}>
                Deadline
              </span>
              {sortField === "deadline" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </span>
              )}
            </button>

            <button
              className="flex items-center px-3 py-1 border border-[#CDAA7D] rounded bg-white hover:bg-[#F4F0E6]"
              onClick={() => toggleSort("reward")}
            >
              <span className={sortField === "reward" ? "text-[#8B75AA] font-medium" : "text-[#2C1A1D]"}>Reward</span>
              {sortField === "reward" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Quests List */}
        {sortedQuests && sortedQuests.length > 0 ? (
          <div className="space-y-4">
            {sortedQuests.map((quest) => (
              <div key={quest.id} className="bg-white border border-[#CDAA7D] rounded-lg overflow-hidden">
                {/* Quest Header */}
                <div className="bg-[#CDAA7D] p-4 flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-[#2C1A1D]">{quest.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold text-white ${getStatusBadgeColor(quest.status)}`}
                      >
                        {quest.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-[#2C1A1D]">
                        Created: {new Date(quest.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {activeTab === "created" && (
                    <div className="flex gap-2">
                      <button
                        className="p-2 bg-[#8B75AA] text-white rounded hover:bg-[#7A6699] transition-colors"
                        title="Edit Quest"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(quest.id)}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        title="Delete Quest"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Quest Summary */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <span className="text-[#CDAA7D]">💰</span>
                        <span className="text-[#2C1A1D] font-medium">{quest.reward}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[#8B75AA]">⭐</span>
                        <span className="text-[#8B75AA] font-medium">{quest.xp}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[#8B75AA]">⏰</span>
                        <span className="text-[#2C1A1D]">
                          Deadline: {new Date(quest.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedQuestId(expandedQuestId === quest.id ? null : quest.id)}
                      className="text-[#8B75AA] hover:text-[#7A6699]"
                    >
                      {expandedQuestId === quest.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>

                  {/* Expanded Content */}
                  {expandedQuestId === quest.id && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <p className="text-[#2C1A1D] mb-4">{quest.description}</p>

                      {/* For Created Quests - Show Applicants */}
                      {activeTab === "created" && quest.applicants && quest.applicants.length > 0 ? (
                        <div>
                          <h4 className="font-medium text-[#2C1A1D] mb-2">Applicants:</h4>
                          <div className="space-y-3">
                            {quest.applicants.map((applicant) => (
                              <div
                                key={applicant.id}
                                className="flex items-center justify-between bg-gray-50 p-3 rounded"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-[#8B75AA] rounded-full flex items-center justify-center text-white">
                                    {applicant.avatar}
                                  </div>
                                  <div>
                                    <p className="font-medium text-[#2C1A1D]">{applicant.username}</p>
                                    <p className="text-xs text-gray-500">
                                      Applied: {new Date(applicant.appliedAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-bold text-white ${getApplicantStatusBadgeColor(
                                      applicant.status,
                                    )}`}
                                  >
                                    {applicant.status.toUpperCase()}
                                  </span>

                                  {applicant.status === "pending" && quest.status === "open" && (
                                    <>
                                      <button
                                        onClick={() => handleApproveApplicant(quest.id, applicant.userId)}
                                        className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                                        title="Approve"
                                      >
                                        <CheckCircle size={16} />
                                      </button>
                                      <button
                                        onClick={() => handleRejectApplicant(quest.id, applicant.userId)}
                                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        title="Reject"
                                      >
                                        <XCircle size={16} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : activeTab === "created" ? (
                        <p className="text-gray-500 italic">No applicants yet</p>
                      ) : null}

                      {/* For Applied Quests - Show Status */}
                      {activeTab === "applied" && (
                        <div className="mt-2">
                          <p className="text-[#2C1A1D]">
                            <span className="font-medium">Posted by:</span> {quest.poster.username}
                          </p>
                          <p className="text-[#2C1A1D] mt-1">
                            <span className="font-medium">Application Status:</span>{" "}
                            <span
                              className={`px-2 py-1 rounded text-xs font-bold text-white ${getApplicantStatusBadgeColor(
                                quest.applicants.find((app) => app.userId === currentUser.id)?.status || "pending",
                              )}`}
                            >
                              {(
                                quest.applicants.find((app) => app.userId === currentUser.id)?.status || "PENDING"
                              ).toUpperCase()}
                            </span>
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="mt-4 flex justify-end">
                        {activeTab === "created" && quest.status === "in-progress" && (
                          <button
                            onClick={() => handleCompleteQuest(quest.id)}
                            className="px-4 py-2 bg-[#8B75AA] text-white rounded hover:bg-[#7A6699] transition-colors flex items-center gap-2"
                          >
                            <CheckCircle size={16} />
                            <span>Mark as Completed</span>
                          </button>
                        )}

                        {activeTab === "applied" &&
                          quest.status === "in-progress" &&
                          quest.applicants.find((app) => app.userId === currentUser.id)?.status === "accepted" && (
                            <button
                              onClick={() => {
                                // Submit work logic here
                                showToast("Work submitted successfully", "success")
                              }}
                              className="px-4 py-2 bg-[#8B75AA] text-white rounded hover:bg-[#7A6699] transition-colors"
                            >
                              Submit Work
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
            <Clock size={48} className="mx-auto mb-4 text-[#CDAA7D]" />
            <h3 className="text-xl font-bold text-[#2C1A1D] mb-2">No Quests Found</h3>
            <p className="text-[#8B75AA]">
              {activeTab === "created"
                ? "You haven't created any quests yet. Post a new quest to get started!"
                : "You haven't applied to any quests yet. Browse the Quest Board to find opportunities!"}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-[#2C1A1D] mb-4">Confirm Deletion</h3>
            <p className="text-[#2C1A1D] mb-6">
              Are you sure you want to delete this quest? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-[#CDAA7D] rounded text-[#2C1A1D] hover:bg-[#CDAA7D] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteQuest(showDeleteConfirm)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete Quest
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
