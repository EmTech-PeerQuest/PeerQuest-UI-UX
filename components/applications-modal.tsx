"use client"

import { X, ScrollText, Users, CheckCircle, XCircle } from "lucide-react"
import type { Quest, User } from "@/lib/types"
import { getDifficultyClass } from "@/lib/utils"

interface ApplicationsModalProps {
  isOpen: boolean
  onClose: () => void
  quests: Quest[]
  currentUser: User | null
  setQuests: (quests: Quest[] | ((prev: Quest[]) => Quest[])) => void
}

export function ApplicationsModal({ isOpen, onClose, quests, currentUser, setQuests }: ApplicationsModalProps) {
  if (!isOpen || !currentUser) return null

  const myApplications = quests.filter((quest) => quest.applicants.some((app) => app.userId === currentUser.id))
  const myQuests = quests.filter((quest) => quest.poster.id === currentUser.id && quest.applicants.length > 0)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-tavern-brown/10">
          <h2 className="text-2xl font-bold font-medieval">Quest Applications</h2>
          <button onClick={onClose} className="p-1 hover:bg-tavern-brown/10 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* My Applications */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-medieval">My Applications</h3>
            <div className="space-y-3">
              {myApplications.length === 0 ? (
                <div className="empty-state py-5">
                  <ScrollText className="empty-state-icon w-12 h-12" />
                  <p>You haven't applied for any quests yet.</p>
                </div>
              ) : (
                myApplications.map((quest) => {
                  const myApplication = quest.applicants.find((app) => app.userId === currentUser.id)
                  return (
                    <div key={quest.id} className="card p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{quest.title}</h4>
                          <div className="text-sm text-tavern-brown/70 mb-2">
                            Applied {myApplication?.appliedAt.toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span className={`badge ${getDifficultyClass(quest.difficulty)}`}>{quest.difficulty}</span>
                            <span>{quest.reward} Gold</span>
                            <span>{quest.xp} XP</span>
                          </div>
                        </div>
                        <span
                          className={`badge ${
                            myApplication?.status === "pending"
                              ? "badge-status"
                              : myApplication?.status === "accepted"
                                ? "badge-easy"
                                : "badge-hard"
                          }`}
                        >
                          {myApplication?.status.charAt(0).toUpperCase() + myApplication?.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Applications to My Quests */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-medieval">Applications to My Quests</h3>
            <div className="space-y-4">
              {myQuests.length === 0 ? (
                <div className="empty-state py-5">
                  <Users className="empty-state-icon w-12 h-12" />
                  <p>No applications to your quests yet.</p>
                </div>
              ) : (
                myQuests.map((quest) => (
                  <div key={quest.id} className="card p-5">
                    <h4 className="text-lg font-semibold mb-3">{quest.title}</h4>
                    <div className="space-y-3">
                      {quest.applicants.map((applicant) => (
                        <div
                          key={applicant.id}
                          className="flex justify-between items-center p-3 bg-tavern-bronze/10 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="avatar avatar-sm">{applicant.avatar}</div>
                            <div>
                              <div className="font-semibold">{applicant.username}</div>
                              <div className="text-xs text-tavern-brown/70">
                                Applied {applicant.appliedAt.toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="btn btn-success text-xs px-3 py-1">
                              <CheckCircle size={14} className="mr-1" />
                              Accept
                            </button>
                            <button className="btn btn-danger text-xs px-3 py-1">
                              <XCircle size={14} className="mr-1" />
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
