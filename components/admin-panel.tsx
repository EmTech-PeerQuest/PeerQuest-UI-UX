"use client"

import { useState } from "react"
import type { User, Quest, Guild } from "@/lib/types"
import { Users, FileText, Flag, Home } from "lucide-react"

interface AdminPanelProps {
  currentUser: User | null
  users: User[]
  quests: Quest[]
  guilds: Guild[]
  setUsers: (users: User[]) => void
  setQuests: (quests: Quest[]) => void
  setGuilds: (guilds: Guild[]) => void
  showToast: (message: string, type?: string) => void
}

export function AdminPanel({
  currentUser,
  users,
  quests,
  guilds,
  setUsers,
  setQuests,
  setGuilds,
  showToast,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "quests" | "guilds" | "reports">("overview")

  // Count active and banned users
  const activeUsers = users.filter((user) => !user.banned).length
  const bannedUsers = users.filter((user) => user.banned).length

  // Count open, completed quests
  const openQuests = quests.filter((quest) => quest.status === "open").length
  const completedQuests = quests.filter((quest) => quest.status === "completed").length

  // Mock reports data
  const reports = [
    {
      id: 1,
      type: "user",
      reportedId: users[2]?.id || 3,
      reason: "Inappropriate behavior",
      status: "pending",
      reportedBy: users[0]?.id || 1,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 2,
      type: "quest",
      reportedId: quests[0]?.id || 1,
      reason: "Misleading information",
      status: "pending",
      reportedBy: users[1]?.id || 2,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ]

  const handleBanUser = (userId: number) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, banned: true } : user)))
    showToast(`User has been banned.`, "success")
  }

  const handleUnbanUser = (userId: number) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, banned: false } : user)))
    showToast(`User has been unbanned.`, "success")
  }

  const handleDeleteQuest = (questId: number) => {
    setQuests(quests.filter((quest) => quest.id !== questId))
    showToast(`Quest has been deleted.`, "success")
  }

  const handleDeleteGuild = (guildId: number) => {
    setGuilds(guilds.filter((guild) => guild.id !== guildId))
    showToast(`Guild has been deleted.`, "success")
  }

  const handleResolveReport = (reportId: number) => {
    // In a real app, you would update the report status in your database
    showToast(`Report has been resolved.`, "success")
  }

  if (!currentUser || !currentUser.roles || !currentUser.roles.includes("admin")) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-[#2C1A1D] mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-6">You do not have permission to access the admin panel.</p>
      </div>
    )
  }

  return (
    <div className="bg-[#F4F0E6] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-[#8B75AA] rounded-t-lg p-6">
          <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
          <p className="text-[#F4F0E6] opacity-80">Manage users, quests, guilds, and reports</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 flex">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center px-6 py-4 text-sm font-medium ${
              activeTab === "overview"
                ? "border-b-2 border-[#8B75AA] text-[#8B75AA]"
                : "text-gray-500 hover:text-[#8B75AA]"
            }`}
          >
            <Home size={18} className="mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center px-6 py-4 text-sm font-medium ${
              activeTab === "users"
                ? "border-b-2 border-[#8B75AA] text-[#8B75AA]"
                : "text-gray-500 hover:text-[#8B75AA]"
            }`}
          >
            <Users size={18} className="mr-2" />
            Users
          </button>
          <button
            onClick={() => setActiveTab("quests")}
            className={`flex items-center px-6 py-4 text-sm font-medium ${
              activeTab === "quests"
                ? "border-b-2 border-[#8B75AA] text-[#8B75AA]"
                : "text-gray-500 hover:text-[#8B75AA]"
            }`}
          >
            <FileText size={18} className="mr-2" />
            Quests
          </button>
          <button
            onClick={() => setActiveTab("guilds")}
            className={`flex items-center px-6 py-4 text-sm font-medium ${
              activeTab === "guilds"
                ? "border-b-2 border-[#8B75AA] text-[#8B75AA]"
                : "text-gray-500 hover:text-[#8B75AA]"
            }`}
          >
            <Users size={18} className="mr-2" />
            Guilds
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center px-6 py-4 text-sm font-medium ${
              activeTab === "reports"
                ? "border-b-2 border-[#8B75AA] text-[#8B75AA]"
                : "text-gray-500 hover:text-[#8B75AA]"
            }`}
          >
            <Flag size={18} className="mr-2" />
            Reports
            <span className="ml-2 bg-red-500 text-white text-xs px-1.5 rounded-full">2</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-b-lg p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Users */}
                <div className="bg-[#F4F0E6] border border-[#CDAA7D] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-[#2C1A1D]">Total Users</h3>
                    <Users size={18} className="text-[#8B75AA]" />
                  </div>
                  <div className="text-3xl font-bold text-[#2C1A1D]">{users.length}</div>
                  <div className="text-sm text-[#8B75AA] mt-2">
                    <span className="font-medium">{activeUsers} active</span> •{" "}
                    <span className="text-red-500">{bannedUsers} banned</span>
                  </div>
                </div>

                {/* Total Quests */}
                <div className="bg-[#F4F0E6] border border-[#CDAA7D] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-[#2C1A1D]">Total Quests</h3>
                    <FileText size={18} className="text-[#8B75AA]" />
                  </div>
                  <div className="text-3xl font-bold text-[#2C1A1D]">{quests.length}</div>
                  <div className="text-sm text-[#8B75AA] mt-2">
                    <span className="font-medium">{openQuests} open</span> •{" "}
                    <span className="text-green-500">{completedQuests} completed</span>
                  </div>
                </div>

                {/* Total Guilds */}
                <div className="bg-[#F4F0E6] border border-[#CDAA7D] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-[#2C1A1D]">Total Guilds</h3>
                    <Users size={18} className="text-[#8B75AA]" />
                  </div>
                  <div className="text-3xl font-bold text-[#2C1A1D]">{guilds.length}</div>
                </div>

                {/* Pending Reports */}
                <div className="bg-[#F4F0E6] border border-[#CDAA7D] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-[#2C1A1D]">Pending Reports</h3>
                    <Flag size={18} className="text-[#8B75AA]" />
                  </div>
                  <div className="text-3xl font-bold text-[#2C1A1D]">{reports.length}</div>
                  <div className="text-sm text-[#8B75AA] mt-2">
                    <button onClick={() => setActiveTab("reports")} className="text-[#8B75AA] hover:underline">
                      View reports
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Users and Reports */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="bg-[#F4F0E6] border border-[#CDAA7D] rounded-lg p-4">
                  <h3 className="font-bold text-[#2C1A1D] mb-4">Recent Users</h3>
                  <div className="space-y-2">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between bg-white p-2 rounded">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#8B75AA] flex items-center justify-center text-white font-medium">
                            {user.avatar || user.username?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium text-[#2C1A1D]">{user.username}</div>
                            {user.roles?.includes("admin") && (
                              <span className="text-xs bg-[#8B75AA] text-white px-1.5 py-0.5 rounded">Admin</span>
                            )}
                            {user.banned && (
                              <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded ml-1">Banned</span>
                            )}
                          </div>
                        </div>
                        <button className="text-xs text-[#8B75AA] hover:underline">View</button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <button onClick={() => setActiveTab("users")} className="text-sm text-[#8B75AA] hover:underline">
                      View all users
                    </button>
                  </div>
                </div>

                {/* Recent Reports */}
                <div className="bg-[#F4F0E6] border border-[#CDAA7D] rounded-lg p-4">
                  <h3 className="font-bold text-[#2C1A1D] mb-4">Recent Reports</h3>
                  <div className="space-y-2">
                    {reports.map((report) => (
                      <div key={report.id} className="bg-white p-2 rounded">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                                report.type === "user" ? "bg-red-500" : "bg-orange-500"
                              }`}
                            >
                              {report.type === "user" ? "U" : "Q"}
                            </div>
                            <div className="ml-2 font-medium text-[#2C1A1D]">
                              {report.type === "user" ? "User Report" : "Quest Report"}
                            </div>
                          </div>
                          <button className="text-xs text-[#8B75AA] hover:underline">View</button>
                        </div>
                        <div className="text-xs text-[#8B75AA] mt-1">{report.reason}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <button onClick={() => setActiveTab("reports")} className="text-sm text-[#8B75AA] hover:underline">
                      View all reports
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div>
              <h3 className="text-xl font-bold text-[#2C1A1D] mb-4">Manage Users</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b text-left">User</th>
                      <th className="py-2 px-4 border-b text-left">Email</th>
                      <th className="py-2 px-4 border-b text-left">Role</th>
                      <th className="py-2 px-4 border-b text-left">Status</th>
                      <th className="py-2 px-4 border-b text-left">Joined</th>
                      <th className="py-2 px-4 border-b text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#8B75AA] flex items-center justify-center text-white font-medium">
                              {user.avatar || user.username?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <span className="ml-2 font-medium">{user.username}</span>
                          </div>
                        </td>
                        <td className="py-2 px-4 border-b">{user.email}</td>
                        <td className="py-2 px-4 border-b">
                          {user.roles?.includes("admin") ? (
                            <span className="bg-[#8B75AA] text-white text-xs px-2 py-1 rounded">Admin</span>
                          ) : (
                            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">User</span>
                          )}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {user.banned ? (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Banned</span>
                          ) : (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Active</span>
                          )}
                        </td>
                        <td className="py-2 px-4 border-b">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="py-2 px-4 border-b">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                            {user.banned ? (
                              <button
                                onClick={() => handleUnbanUser(user.id)}
                                className="text-green-600 hover:text-green-800 text-sm"
                              >
                                Unban
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBanUser(user.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Ban
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quests Tab */}
          {activeTab === "quests" && (
            <div>
              <h3 className="text-xl font-bold text-[#2C1A1D] mb-4">Manage Quests</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b text-left">Title</th>
                      <th className="py-2 px-4 border-b text-left">Posted By</th>
                      <th className="py-2 px-4 border-b text-left">Category</th>
                      <th className="py-2 px-4 border-b text-left">Status</th>
                      <th className="py-2 px-4 border-b text-left">Created</th>
                      <th className="py-2 px-4 border-b text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quests.map((quest) => (
                      <tr key={quest.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b font-medium">{quest.title}</td>
                        <td className="py-2 px-4 border-b">
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-[#8B75AA] flex items-center justify-center text-white text-xs">
                              {quest.poster.avatar}
                            </div>
                            <span className="ml-2">{quest.poster.name}</span>
                          </div>
                        </td>
                        <td className="py-2 px-4 border-b">
                          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">{quest.category}</span>
                        </td>
                        <td className="py-2 px-4 border-b">
                          {quest.status === "open" && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Open</span>
                          )}
                          {quest.status === "in-progress" && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">In Progress</span>
                          )}
                          {quest.status === "completed" && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Completed</span>
                          )}
                        </td>
                        <td className="py-2 px-4 border-b">{new Date(quest.createdAt).toLocaleDateString()}</td>
                        <td className="py-2 px-4 border-b">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                            <button
                              onClick={() => handleDeleteQuest(quest.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Guilds Tab */}
          {activeTab === "guilds" && (
            <div>
              <h3 className="text-xl font-bold text-[#2C1A1D] mb-4">Manage Guilds</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b text-left">Guild</th>
                      <th className="py-2 px-4 border-b text-left">Owner</th>
                      <th className="py-2 px-4 border-b text-left">Members</th>
                      <th className="py-2 px-4 border-b text-left">Specialization</th>
                      <th className="py-2 px-4 border-b text-left">Created</th>
                      <th className="py-2 px-4 border-b text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guilds.map((guild) => (
                      <tr key={guild.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">
                          <div className="flex items-center">
                            <span className="text-xl mr-2">{guild.emblem}</span>
                            <span className="font-medium">{guild.name}</span>
                          </div>
                        </td>
                        <td className="py-2 px-4 border-b">
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-[#8B75AA] flex items-center justify-center text-white text-xs">
                              {guild.poster.avatar}
                            </div>
                            <span className="ml-2">{guild.poster.name}</span>
                          </div>
                        </td>
                        <td className="py-2 px-4 border-b">{guild.members}</td>
                        <td className="py-2 px-4 border-b">
                          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                            {guild.specialization}
                          </span>
                        </td>
                        <td className="py-2 px-4 border-b">{new Date(guild.createdAt).toLocaleDateString()}</td>
                        <td className="py-2 px-4 border-b">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                            <button
                              onClick={() => handleDeleteGuild(guild.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div>
              <h3 className="text-xl font-bold text-[#2C1A1D] mb-4">Manage Reports</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b text-left">Type</th>
                      <th className="py-2 px-4 border-b text-left">Reported By</th>
                      <th className="py-2 px-4 border-b text-left">Reason</th>
                      <th className="py-2 px-4 border-b text-left">Status</th>
                      <th className="py-2 px-4 border-b text-left">Date</th>
                      <th className="py-2 px-4 border-b text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              report.type === "user" ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {report.type === "user" ? "User Report" : "Quest Report"}
                          </span>
                        </td>
                        <td className="py-2 px-4 border-b">
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-[#8B75AA] flex items-center justify-center text-white text-xs">
                              {users.find((u) => u.id === report.reportedBy)?.avatar || "U"}
                            </div>
                            <span className="ml-2">
                              {users.find((u) => u.id === report.reportedBy)?.username || "Unknown"}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-4 border-b">{report.reason}</td>
                        <td className="py-2 px-4 border-b">
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Pending</span>
                        </td>
                        <td className="py-2 px-4 border-b">{report.createdAt.toLocaleDateString()}</td>
                        <td className="py-2 px-4 border-b">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                            <button
                              onClick={() => handleResolveReport(report.id)}
                              className="text-green-600 hover:text-green-800 text-sm"
                            >
                              Resolve
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
