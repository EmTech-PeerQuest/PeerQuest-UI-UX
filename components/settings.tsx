"use client"

import { useState } from "react"
import { Eye, EyeOff, Save, AlertCircle } from "lucide-react"

interface SettingsProps {
  user: any
  updateSettings: (settings: any) => void
  showToast: (message: string, type?: string) => void
}

export function Settings({ user, updateSettings, showToast }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<
    "account" | "security" | "privacy" | "notifications" | "payment" | "subscriptions" | "parental" | "app"
  >("account")

  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Initialize with safe defaults if properties are undefined
  const [accountForm, setAccountForm] = useState({
    displayName: user?.displayName || user?.username || "",
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    birthday: user?.birthday || "",
    gender: user?.gender || "prefer-not-to-say",
    location: user?.location || "",
    language: user?.settings?.language || "English",
    theme: user?.settings?.theme || "dark",
    socialLinks: {
      facebook: user?.socialLinks?.facebook || "",
      twitter: user?.socialLinks?.twitter || "",
      youtube: user?.socialLinks?.youtube || "",
      twitch: user?.socialLinks?.twitch || "",
      github: user?.socialLinks?.github || "",
      linkedin: user?.socialLinks?.linkedin || "",
      website: user?.socialLinks?.website || "",
    },
  })

  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: user?.settings?.security?.twoFactorEnabled || false,
    twoFactorMethod: user?.settings?.security?.twoFactorMethod || "email",
  })

  const [privacyForm, setPrivacyForm] = useState({
    showBirthday: user?.settings?.privacy?.showBirthday || false,
    showGender: user?.settings?.privacy?.showGender || false,
    showEmail: user?.settings?.privacy?.showEmail || false,
  })

  const [notificationsForm, setNotificationsForm] = useState({
    newQuests: user?.settings?.notifications?.newQuests || true,
    questApplications: user?.settings?.notifications?.questApplications || true,
    guildAnnouncements: user?.settings?.notifications?.guildAnnouncements || true,
    directMessages: user?.settings?.notifications?.directMessages || true,
    newsletter: user?.settings?.notifications?.newsletter || false,
  })

  const saveAccountSettings = () => {
    updateSettings({
      displayName: accountForm.displayName,
      username: accountForm.username,
      email: accountForm.email,
      bio: accountForm.bio,
      birthday: accountForm.birthday,
      gender: accountForm.gender,
      location: accountForm.location,
      socialLinks: accountForm.socialLinks,
      settings: {
        ...user?.settings,
        language: accountForm.language,
        theme: accountForm.theme,
      },
    })
    showToast("Account settings saved successfully!")
  }

  const saveSecuritySettings = () => {
    // In a real app, we would verify the current password
    if (securityForm.newPassword && securityForm.newPassword !== securityForm.confirmPassword) {
      showToast("New passwords do not match", "error")
      return
    }

    updateSettings({
      settings: {
        ...user?.settings,
        security: {
          ...user?.settings?.security,
          twoFactorEnabled: securityForm.twoFactorEnabled,
          twoFactorMethod: securityForm.twoFactorMethod,
        },
      },
    })

    showToast("Security settings saved successfully!")

    // Clear password fields
    setSecurityForm({
      ...securityForm,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const savePrivacySettings = () => {
    updateSettings({
      settings: {
        ...user?.settings,
        privacy: privacyForm,
      },
    })
    showToast("Privacy settings saved successfully!")
  }

  const saveNotificationSettings = () => {
    updateSettings({
      settings: {
        ...user?.settings,
        notifications: notificationsForm,
      },
    })
    showToast("Notification settings saved successfully!")
  }

  const generateBackupCodes = () => {
    updateSettings({
      settings: {
        ...user?.settings,
        security: {
          ...user?.settings?.security,
          backupCodesGenerated: true,
        },
      },
    })
    showToast("Backup codes generated successfully!")
  }

  return (
    <section className="bg-[#F4F0E6] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-4 text-[#2C1A1D] font-serif">Settings</h2>
        <p className="text-center text-[#8B75AA] mb-8">CUSTOMIZE YOUR PEERQUEST TAVERN EXPERIENCE.</p>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-64 bg-[#2C1A1D] text-[#F4F0E6] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#CDAA7D]/30">
              <h3 className="font-bold text-lg">Settings</h3>
            </div>
            <div className="p-2">
              <button
                onClick={() => setActiveTab("account")}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeTab === "account" ? "bg-[#CDAA7D] text-[#2C1A1D]" : "hover:bg-[#CDAA7D]/20"
                }`}
              >
                Account Info
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeTab === "security" ? "bg-[#CDAA7D] text-[#2C1A1D]" : "hover:bg-[#CDAA7D]/20"
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab("privacy")}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeTab === "privacy" ? "bg-[#CDAA7D] text-[#2C1A1D]" : "hover:bg-[#CDAA7D]/20"
                }`}
              >
                Privacy & Content Restrictions
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeTab === "notifications" ? "bg-[#CDAA7D] text-[#2C1A1D]" : "hover:bg-[#CDAA7D]/20"
                }`}
              >
                Notifications
              </button>
              <button
                onClick={() => setActiveTab("payment")}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeTab === "payment" ? "bg-[#CDAA7D] text-[#2C1A1D]" : "hover:bg-[#CDAA7D]/20"
                }`}
              >
                Payment Methods
              </button>
              <button
                onClick={() => setActiveTab("subscriptions")}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeTab === "subscriptions" ? "bg-[#CDAA7D] text-[#2C1A1D]" : "hover:bg-[#CDAA7D]/20"
                }`}
              >
                Subscriptions
              </button>
              <button
                onClick={() => setActiveTab("parental")}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeTab === "parental" ? "bg-[#CDAA7D] text-[#2C1A1D]" : "hover:bg-[#CDAA7D]/20"
                }`}
              >
                Parental Controls
              </button>
              <button
                onClick={() => setActiveTab("app")}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeTab === "app" ? "bg-[#CDAA7D] text-[#2C1A1D]" : "hover:bg-[#CDAA7D]/20"
                }`}
              >
                App Permissions
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-[#2C1A1D] text-[#F4F0E6] rounded-lg overflow-hidden">
            {/* Account Info */}
            {activeTab === "account" && (
              <div className="p-6">
                <h3 className="text-xl font-bold mb-6">Account Info</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Display Name</label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 bg-[#3D2A2F] border border-[#CDAA7D] rounded text-[#F4F0E6] focus:outline-none focus:border-[#8B75AA]"
                        value={accountForm.displayName}
                        onChange={(e) => setAccountForm((prev) => ({ ...prev, displayName: e.target.value }))}
                      />
                      <button className="ml-2 text-[#CDAA7D]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 bg-[#3D2A2F] border border-[#CDAA7D] rounded text-[#F4F0E6] focus:outline-none focus:border-[#8B75AA]"
                        value={accountForm.username}
                        onChange={(e) => setAccountForm((prev) => ({ ...prev, username: e.target.value }))}
                      />
                      <button className="ml-2 text-[#CDAA7D]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-[#CDAA7D]/70 mt-1">Previous usernames: {user?.username}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <div className="flex items-center">
                      <input
                        type="email"
                        className="flex-1 px-3 py-2 bg-[#3D2A2F] border border-[#CDAA7D] rounded text-[#F4F0E6] focus:outline-none focus:border-[#8B75AA]"
                        value={accountForm.email}
                        onChange={(e) => setAccountForm((prev) => ({ ...prev, email: e.target.value }))}
                      />
                      <button className="ml-2 text-[#CDAA7D]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-xs bg-green-800 text-green-200 px-2 py-0.5 rounded">Verified</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                      className="w-full px-3 py-2 bg-[#3D2A2F] border border-[#CDAA7D] rounded text-[#F4F0E6] focus:outline-none focus:border-[#8B75AA] h-24 resize-none"
                      value={accountForm.bio}
                      onChange={(e) => setAccountForm((prev) => ({ ...prev, bio: e.target.value }))}
                    ></textarea>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold mb-3">Personal</h4>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Birthday</label>
                      <div className="flex items-center">
                        <input
                          type="date"
                          className="flex-1 px-3 py-2 bg-[#3D2A2F] border border-[#CDAA7D] rounded text-[#F4F0E6] focus:outline-none focus:border-[#8B75AA]"
                          value={accountForm.birthday}
                          onChange={(e) => setAccountForm((prev) => ({ ...prev, birthday: e.target.value }))}
                        />
                        <div className="ml-2 text-[#CDAA7D]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path>
                            <path d="M12 6v6l4 2"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="text-xs bg-blue-800 text-blue-200 px-2 py-0.5 rounded">Verified</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Gender (optional)</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          className={`py-2 border ${
                            accountForm.gender === "male"
                              ? "bg-[#8B75AA] text-white"
                              : "border-[#CDAA7D] text-[#F4F0E6]"
                          } rounded font-medium transition-colors flex items-center justify-center`}
                          onClick={() => setAccountForm((prev) => ({ ...prev, gender: "male" }))}
                        >
                          <span className="mr-2">♂</span>
                          MALE
                        </button>

                        <button
                          type="button"
                          className={`py-2 border ${
                            accountForm.gender === "female"
                              ? "bg-[#8B75AA] text-white"
                              : "border-[#CDAA7D] text-[#F4F0E6]"
                          } rounded font-medium transition-colors flex items-center justify-center`}
                          onClick={() => setAccountForm((prev) => ({ ...prev, gender: "female" }))}
                        >
                          <span className="mr-2">♀</span>
                          FEMALE
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Account Location</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-[#3D2A2F] border border-[#CDAA7D] rounded text-[#F4F0E6] focus:outline-none focus:border-[#8B75AA]"
                        value={accountForm.location}
                        onChange={(e) => setAccountForm((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="Enter your location"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Language</label>
                      <select
                        className="w-full px-3 py-2 bg-[#3D2A2F] border border-[#CDAA7D] rounded text-[#F4F0E6] focus:outline-none focus:border-[#8B75AA]"
                        value={accountForm.language}
                        onChange={(e) => setAccountForm((prev) => ({ ...prev, language: e.target.value }))}
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Japanese">Japanese</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Theme</label>
                      <select
                        className="w-full px-3 py-2 bg-[#3D2A2F] border border-[#CDAA7D] rounded text-[#F4F0E6] focus:outline-none focus:border-[#8B75AA]"
                        value={accountForm.theme}
                        onChange={(e) => setAccountForm((prev) => ({ ...prev, theme: e.target.value as any }))}
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold mb-3">Social Networks</h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-2">Facebook</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-[#3D2A2F] border border-[#CDAA7D] rounded text-[#F4F0E6] focus:outline-none focus:border-[#8B75AA]"
                          value={accountForm.socialLinks.facebook}
                          onChange={(e) =>
                            setAccountForm((prev) => ({
                              ...prev,
                              socialLinks: { ...prev.socialLinks, facebook: e.target.value },
                            }))
                          }
                          placeholder="e.g. www.facebook.com/username"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Twitter</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-[#3D2A2F] border border-[#CDAA7D] rounded text-[#F4F0E6] focus:outline-none focus:border-[#8B75AA]"
                          value={accountForm.socialLinks.twitter}
                          onChange={(e) =>
                            setAccountForm((prev) => ({
                              ...prev,
                              socialLinks: { ...prev.socialLinks, twitter: e.target.value },
                            }))
                          }
                          placeholder="e.g. @handle"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">YouTube</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-[#3D2A2F] border border-[#CDAA7D] rounded text-[#F4F0E6] focus:outline-none focus:border-[#8B75AA]"
                          value={accountForm.socialLinks.youtube}
                          onChange={(e) =>
                            setAccountForm((prev) => ({
                              ...prev,
                              socialLinks: { ...prev.socialLinks, youtube: e.target.value },
                            }))
                          }
                          placeholder="e.g. www.youtube.com/channel/username"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Twitch</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-[#3D2A2F] border border-[#CDAA7D] rounded text-[#F4F0E6] focus:outline-none focus:border-[#8B75AA]"
                          value={accountForm.socialLinks.twitch}
                          onChange={(e) =>
                            setAccountForm((prev) => ({
                              ...prev,
                              socialLinks: { ...prev.socialLinks, twitch: e.target.value },
                            }))
                          }
                          placeholder="e.g. www.twitch.tv/username"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">GitHub</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-[#3D2A2F] border border-[#CDAA7D] rounded text-[#F4F0E6] focus:outline-none focus:border-[#8B75AA]"
                          value={accountForm.socialLinks.github}
                          onChange={(e) =>
                            setAccountForm((prev) => ({
                              ...prev,
                              socialLinks: { ...prev.socialLinks, github: e.target.value },
                            }))
                          }
                          placeholder="e.g. github.com/username"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">LinkedIn</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-[#3D2A2F] border border-[#CDAA7D] rounded text-[#F4F0E6] focus:outline-none focus:border-[#8B75AA]"
                          value={accountForm.socialLinks.linkedin}
                          onChange={(e) =>
                            setAccountForm((prev) => ({
                              ...prev,
                              socialLinks: { ...prev.socialLinks, linkedin: e.target.value },
                            }))
                          }
                          placeholder="e.g. linkedin.com/in/username"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Website</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-[#3D2A2F] border border-[#CDAA7D] rounded text-[#F4F0E6] focus:outline-none focus:border-[#8B75AA]"
                          value={accountForm.socialLinks.website}
                          onChange={(e) =>
                            setAccountForm((prev) => ({
                              ...prev,
                              socialLinks: { ...prev.socialLinks, website: e.target.value },
                            }))
                          }
                          placeholder="e.g. www.yourwebsite.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={saveAccountSettings}
                      className="px-6 py-2 bg-[#8B75AA] text-white rounded font-medium hover:bg-[#7A6699] transition-colors flex items-center"
                    >
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === "security" && (
              <div className="p-6">
                <h3 className="text-xl font-bold mb-6">Security</h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold mb-3">Login Methods</h4>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium">Password</label>
                        <span className="text-xs bg-[#CDAA7D]/20 text-[#CDAA7D] px-2 py-0.5 rounded">
                          1 password added
                        </span>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="password"
                          className="flex-1 px-3 py-2 bg-[#3D2A2F] border border-[#CDAA7D] rounded text-[#F4F0E6] focus:outline-none focus:border-[#8B75AA]"
                          value="••••••••"
                          disabled
                        />
                        <button className="ml-2 px-3 py-1 bg-[#CDAA7D] text-[#2C1A1D] rounded text-sm font-medium">
                          Manage
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold mb-3">Change Password</h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="w-full px-3 py-2 bg-[#3D2A2F] border border-[#CDAA7D] rounded text-[#F4F0E6] focus:outline-none focus:border-[#8B75AA]"
                            value={securityForm.currentPassword}
                            onChange={(e) => setSecurityForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                            placeholder="Enter your current password"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#CDAA7D]"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            className="w-full px-3 py-2 bg-[#3D2A2F] border border-[#CDAA7D] rounded text-[#F4F0E6] focus:outline-none focus:border-[#8B75AA]"
                            value={securityForm.newPassword}
                            onChange={(e) => setSecurityForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                            placeholder="Create a new password"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#CDAA7D]"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="w-full px-3 py-2 bg-[#3D2A2F] border border-[#CDAA7D] rounded text-[#F4F0E6] focus:outline-none focus:border-[#8B75AA]"
                            value={securityForm.confirmPassword}
                            onChange={(e) => setSecurityForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                            placeholder="Confirm your new password"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#CDAA7D]"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold mb-3">2-Step Verification</h4>
                    <p className="text-sm text-[#F4F0E6]/70 mb-4">
                      Add an extra layer of protection to your account with 2-Step Verification at login, account
                      recovery, and high-value transactions. You can enable one of the following options at a time.
                    </p>

                    <div className="bg-[#3D2A2F] border border-[#CDAA7D]/30 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">Authenticator App (Very Secure)</h5>
                          <p className="text-sm text-[#F4F0E6]/70 mt-1">
                            Download an app on your phone to generate unique security codes. Suggested apps include
                            Google Authenticator, Microsoft Authenticator, and Twilio's Authy.
                          </p>
                        </div>
                        <div className="ml-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={
                                securityForm.twoFactorEnabled && securityForm.twoFactorMethod === "authenticator"
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSecurityForm((prev) => ({
                                    ...prev,
                                    twoFactorEnabled: true,
                                    twoFactorMethod: "authenticator",
                                  }))
                                } else {
                                  setSecurityForm((prev) => ({
                                    ...prev,
                                    twoFactorEnabled: false,
                                  }))
                                }
                              }}
                            />
                            <div className="w-11 h-6 bg-[#2C1A1D] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B75AA]"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#3D2A2F] border border-[#CDAA7D]/30 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">Email (Secure)</h5>
                          <p className="text-sm text-[#F4F0E6]/70 mt-1">
                            Receive unique security codes at {user?.email.substring(0, 3)}•••••••@
                            {user?.email.split("@")[1]}.
                          </p>
                        </div>
                        <div className="ml-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={securityForm.twoFactorEnabled && securityForm.twoFactorMethod === "email"}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSecurityForm((prev) => ({
                                    ...prev,
                                    twoFactorEnabled: true,
                                    twoFactorMethod: "email",
                                  }))
                                } else {
                                  setSecurityForm((prev) => ({
                                    ...prev,
                                    twoFactorEnabled: false,
                                  }))
                                }
                              }}
                            />
                            <div className="w-11 h-6 bg-[#2C1A1D] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B75AA]"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#3D2A2F] border border-[#CDAA7D]/30 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">Hardware Security Keys (Very Secure)</h5>
                          <p className="text-sm text-[#F4F0E6]/70 mt-1">
                            Supported on web browsers, iPhone, and iPad. Use a hardware key as an extra layer of
                            protection while logging in.
                          </p>
                        </div>
                        <div className="ml-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={securityForm.twoFactorEnabled && securityForm.twoFactorMethod === "hardware"}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSecurityForm((prev) => ({
                                    ...prev,
                                    twoFactorEnabled: true,
                                    twoFactorMethod: "hardware",
                                  }))
                                } else {
                                  setSecurityForm((prev) => ({
                                    ...prev,
                                    twoFactorEnabled: false,
                                  }))
                                }
                              }}
                            />
                            <div className="w-11 h-6 bg-[#2C1A1D] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B75AA]"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#3D2A2F] border border-[#CDAA7D]/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">Backup Codes</h5>
                          <p className="text-sm text-[#F4F0E6]/70 mt-1">
                            You have {user?.settings?.security?.backupCodesGenerated ? "8 unused" : "0"} backup codes.
                          </p>
                          <p className="text-sm text-[#F4F0E6]/70 mt-2">
                            Generate and use backup codes in case you lose access to your 2-Step Verification option. Do
                            not share your backup codes with anyone.
                          </p>
                        </div>
                        <div className="ml-4">
                          <button
                            onClick={generateBackupCodes}
                            className="px-3 py-1 bg-[#CDAA7D] text-[#2C1A1D] rounded text-sm font-medium"
                          >
                            Generate
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#8B75AA]/10 border border-[#8B75AA]/30 rounded-lg p-4 mt-4">
                      <div className="flex items-start">
                        <AlertCircle size={20} className="text-[#8B75AA] mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-[#F4F0E6]/70">
                          <span className="font-bold text-[#8B75AA]">IMPORTANT:</span> Don't share your security codes
                          with anyone. This can include things like texting your code, screensharing, etc. Do not change
                          security settings at someone else's request. PeerQuest will never ask you for your codes or to
                          change settings to prove account ownership.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={saveSecuritySettings}
                      className="px-6 py-2 bg-[#8B75AA] text-white rounded font-medium hover:bg-[#7A6699] transition-colors flex items-center"
                    >
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy */}
            {activeTab === "privacy" && (
              <div className="p-6">
                <h3 className="text-xl font-bold mb-6">Privacy & Content Restrictions</h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold mb-3">Privacy Settings</h4>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">Show Birthday on Profile</h5>
                          <p className="text-sm text-[#F4F0E6]/70 mt-1">
                            Allow other adventurers to see your birthday on your public profile.
                          </p>
                        </div>
                        <div className="ml-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={privacyForm.showBirthday}
                              onChange={(e) => setPrivacyForm((prev) => ({ ...prev, showBirthday: e.target.checked }))}
                            />
                            <div className="w-11 h-6 bg-[#2C1A1D] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B75AA]"></div>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">Show Gender on Profile</h5>
                          <p className="text-sm text-[#F4F0E6]/70 mt-1">
                            Allow other adventurers to see your gender on your public profile.
                          </p>
                        </div>
                        <div className="ml-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={privacyForm.showGender}
                              onChange={(e) => setPrivacyForm((prev) => ({ ...prev, showGender: e.target.checked }))}
                            />
                            <div className="w-11 h-6 bg-[#2C1A1D] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B75AA]"></div>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">Show Email on Profile</h5>
                          <p className="text-sm text-[#F4F0E6]/70 mt-1">
                            Allow other adventurers to see your email on your public profile.
                          </p>
                        </div>
                        <div className="ml-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={privacyForm.showEmail}
                              onChange={(e) => setPrivacyForm((prev) => ({ ...prev, showEmail: e.target.checked }))}
                            />
                            <div className="w-11 h-6 bg-[#2C1A1D] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B75AA]"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold mb-3">Content Restrictions</h4>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">Mature Content Filter</h5>
                          <p className="text-sm text-[#F4F0E6]/70 mt-1">
                            Filter out quests and guilds that may contain mature content.
                          </p>
                        </div>
                        <div className="ml-4">
                          <select className="px-3 py-2 bg-[#3D2A2F] border border-[#CDAA7D] rounded text-[#F4F0E6] focus:outline-none focus:border-[#8B75AA]">
                            <option value="strict">Strict</option>
                            <option value="moderate">Moderate</option>
                            <option value="off">Off</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">Quest Visibility</h5>
                          <p className="text-sm text-[#F4F0E6]/70 mt-1">
                            Control who can see the quests you've created.
                          </p>
                        </div>
                        <div className="ml-4">
                          <select className="px-3 py-2 bg-[#3D2A2F] border border-[#CDAA7D] rounded text-[#F4F0E6] focus:outline-none focus:border-[#8B75AA]">
                            <option value="everyone">Everyone</option>
                            <option value="guild-members">Guild Members Only</option>
                            <option value="friends">Friends Only</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">Profile Visibility</h5>
                          <p className="text-sm text-[#F4F0E6]/70 mt-1">Control who can see your profile.</p>
                        </div>
                        <div className="ml-4">
                          <select className="px-3 py-2 bg-[#3D2A2F] border border-[#CDAA7D] rounded text-[#F4F0E6] focus:outline-none focus:border-[#8B75AA]">
                            <option value="everyone">Everyone</option>
                            <option value="guild-members">Guild Members Only</option>
                            <option value="friends">Friends Only</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={savePrivacySettings}
                      className="px-6 py-2 bg-[#8B75AA] text-white rounded font-medium hover:bg-[#7A6699] transition-colors flex items-center"
                    >
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <div className="p-6">
                <h3 className="text-xl font-bold mb-6">Notifications</h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold mb-3">Notification Preferences</h4>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">New Quest Notifications</h5>
                          <p className="text-sm text-[#F4F0E6]/70 mt-1">
                            Receive notifications when new quests matching your skills are posted.
                          </p>
                        </div>
                        <div className="ml-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={notificationsForm.newQuests}
                              onChange={(e) =>
                                setNotificationsForm((prev) => ({ ...prev, newQuests: e.target.checked }))
                              }
                            />
                            <div className="w-11 h-6 bg-[#2C1A1D] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B75AA]"></div>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">Quest Application Notifications</h5>
                          <p className="text-sm text-[#F4F0E6]/70 mt-1">
                            Receive notifications about your quest applications and when someone applies to your quests.
                          </p>
                        </div>
                        <div className="ml-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={notificationsForm.questApplications}
                              onChange={(e) =>
                                setNotificationsForm((prev) => ({ ...prev, questApplications: e.target.checked }))
                              }
                            />
                            <div className="w-11 h-6 bg-[#2C1A1D] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B75AA]"></div>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">Guild Announcements</h5>
                          <p className="text-sm text-[#F4F0E6]/70 mt-1">
                            Receive notifications about announcements from guilds you've joined.
                          </p>
                        </div>
                        <div className="ml-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={notificationsForm.guildAnnouncements}
                              onChange={(e) =>
                                setNotificationsForm((prev) => ({ ...prev, guildAnnouncements: e.target.checked }))
                              }
                            />
                            <div className="w-11 h-6 bg-[#2C1A1D] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B75AA]"></div>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">Direct Messages</h5>
                          <p className="text-sm text-[#F4F0E6]/70 mt-1">
                            Receive notifications when someone sends you a direct message.
                          </p>
                        </div>
                        <div className="ml-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={notificationsForm.directMessages}
                              onChange={(e) =>
                                setNotificationsForm((prev) => ({ ...prev, directMessages: e.target.checked }))
                              }
                            />
                            <div className="w-11 h-6 bg-[#2C1A1D] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B75AA]"></div>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">Weekly Newsletter</h5>
                          <p className="text-sm text-[#F4F0E6]/70 mt-1">
                            Receive our weekly newsletter with featured quests, guilds, and tavern updates.
                          </p>
                        </div>
                        <div className="ml-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={notificationsForm.newsletter}
                              onChange={(e) =>
                                setNotificationsForm((prev) => ({ ...prev, newsletter: e.target.checked }))
                              }
                            />
                            <div className="w-11 h-6 bg-[#2C1A1D] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B75AA]"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={saveNotificationSettings}
                      className="px-6 py-2 bg-[#8B75AA] text-white rounded font-medium hover:bg-[#7A6699] transition-colors flex items-center"
                    >
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Methods */}
            {activeTab === "payment" && (
              <div className="p-6">
                <h3 className="text-xl font-bold mb-6">Payment Methods</h3>

                <div className="bg-[#3D2A2F] border border-[#CDAA7D]/30 rounded-lg p-6 text-center">
                  <p className="text-lg mb-4">No payment methods added yet.</p>
                  <p className="text-sm text-[#F4F0E6]/70 mb-6">
                    Add a payment method to purchase gold and support other adventurers.
                  </p>
                  <button className="px-6 py-2 bg-[#8B75AA] text-white rounded font-medium hover:bg-[#7A6699] transition-colors">
                    Add Payment Method
                  </button>
                </div>
              </div>
            )}

            {/* Subscriptions */}
            {activeTab === "subscriptions" && (
              <div className="p-6">
                <h3 className="text-xl font-bold mb-6">Subscriptions</h3>

                <div className="bg-[#3D2A2F] border border-[#CDAA7D]/30 rounded-lg p-6 text-center">
                  <p className="text-lg mb-4">No active subscriptions.</p>
                  <p className="text-sm text-[#F4F0E6]/70 mb-6">
                    Subscribe to premium features to enhance your PeerQuest Tavern experience.
                  </p>
                  <button className="px-6 py-2 bg-[#8B75AA] text-white rounded font-medium hover:bg-[#7A6699] transition-colors">
                    View Available Subscriptions
                  </button>
                </div>
              </div>
            )}

            {/* Parental Controls */}
            {activeTab === "parental" && (
              <div className="p-6">
                <h3 className="text-xl font-bold mb-6">Parental Controls</h3>

                <div className="bg-[#3D2A2F] border border-[#CDAA7D]/30 rounded-lg p-6 text-center">
                  <p className="text-lg mb-4">Parental controls are not enabled.</p>
                  <p className="text-sm text-[#F4F0E6]/70 mb-6">
                    Set up parental controls to manage content access and spending limits.
                  </p>
                  <button className="px-6 py-2 bg-[#8B75AA] text-white rounded font-medium hover:bg-[#7A6699] transition-colors">
                    Set Up Parental Controls
                  </button>
                </div>
              </div>
            )}

            {/* App Permissions */}
            {activeTab === "app" && (
              <div className="p-6">
                <h3 className="text-xl font-bold mb-6">App Permissions</h3>

                <div className="bg-[#3D2A2F] border border-[#CDAA7D]/30 rounded-lg p-6 text-center">
                  <p className="text-lg mb-4">No connected applications.</p>
                  <p className="text-sm text-[#F4F0E6]/70 mb-6">
                    Connect third-party applications to enhance your PeerQuest Tavern experience.
                  </p>
                  <button className="px-6 py-2 bg-[#8B75AA] text-white rounded font-medium hover:bg-[#7A6699] transition-colors">
                    Connect Application
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
