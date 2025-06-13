"use client"

import { useState } from "react"
import { X, Coins, TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react"
import type { User } from "@/lib/types"

interface GoldSystemModalProps {
  isOpen: boolean
  onClose: () => void
  currentUser?: User | null
  setCurrentUser?: (user: User | ((prev: User) => User)) => void
  showToast?: (message: string, type?: string) => void
}

interface Transaction {
  id: number
  type: "incoming" | "outgoing"
  category: string
  amount: number
  date: Date
  description: string
}

export function GoldSystemModal({ isOpen, onClose, currentUser, setCurrentUser, showToast }: GoldSystemModalProps) {
  const [activeTab, setActiveTab] = useState<"purchase" | "transactions" | "goldex">("transactions")
  const [transactionFilter, setTransactionFilter] = useState("outgoing")
  const [dateRange, setDateRange] = useState("all-time")

  if (!isOpen) return null

  // Mock transaction data
  const transactions: Transaction[] = [
    {
      id: 1,
      type: "incoming",
      category: "Quest Completion",
      amount: 50,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      description: "Logo Design for Guild - Completed",
    },
    {
      id: 2,
      type: "incoming",
      category: "Gold Purchase",
      amount: 100,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      description: "Purchased 100 Gold Package",
    },
    {
      id: 3,
      type: "outgoing",
      category: "Quest Posting",
      amount: 30,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      description: "Posted: Epic Tale Writing Quest",
    },
    {
      id: 4,
      type: "incoming",
      category: "Guild Bonus",
      amount: 25,
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      description: "Monthly Guild Activity Bonus",
    },
  ]

  const goldPackages = [
    { amount: 500, price: 269, bonus: "+100 more", popular: false },
    { amount: 1000, price: 560, bonus: "+200 more", popular: false },
    { amount: 2000, price: 1150, bonus: "+300 more", popular: false },
    { amount: 5250, price: 2890, bonus: "+750 more", popular: true },
    { amount: 11000, price: 5700, bonus: "+1000 more", popular: false },
    { amount: 24000, price: 11490, bonus: "+1500 more", popular: false },
  ]

  const purchaseGold = (amount: number, price: number) => {
    if (setCurrentUser && currentUser) {
      setCurrentUser((prev) => ({
        ...prev,
        gold: prev.gold + amount,
      }))
      if (showToast) {
        showToast(`Successfully purchased ${amount} gold for ₱${price}!`)
      }
    }
  }

  const cashOutGold = () => {
    if (!currentUser) return

    if (currentUser.gold < 500) {
      if (showToast) {
        showToast("You need at least 500 gold to cash out", "error")
      }
      return
    }

    const cashOutAmount = Math.floor(currentUser.gold / 100) * 10 // 100 gold = ₱10
    if (setCurrentUser) {
      setCurrentUser((prev) => ({
        ...prev,
        gold: prev.gold - Math.floor(prev.gold / 100) * 100,
      }))
    }
    if (showToast) {
      showToast(`Successfully cashed out ₱${cashOutAmount}! Funds will be processed within 72 hours.`)
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    if (transactionFilter === "all") return true
    return transaction.type === transactionFilter
  })

  const totalIncoming = transactions.filter((t) => t.type === "incoming").reduce((sum, t) => sum + t.amount, 0)
  const totalOutgoing = transactions.filter((t) => t.type === "outgoing").reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#F4F0E6] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden relative">
        {/* Header */}
        <div className="bg-[#CDAA7D] px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#2C1A1D]">Gold Treasury</h2>
          <button onClick={onClose} className="text-[#2C1A1D] hover:text-[#8B75AA] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#CDAA7D]">
          <button
            onClick={() => setActiveTab("purchase")}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === "purchase"
                ? "text-[#2C1A1D] border-b-2 border-[#2C1A1D] bg-[#CDAA7D]/20"
                : "text-[#8B75AA] hover:text-[#2C1A1D]"
            }`}
          >
            <Coins size={16} className="inline mr-2" />
            BUY GOLD
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === "transactions"
                ? "text-[#2C1A1D] border-b-2 border-[#2C1A1D] bg-[#CDAA7D]/20"
                : "text-[#8B75AA] hover:text-[#2C1A1D]"
            }`}
          >
            <ArrowUpDown size={16} className="inline mr-2" />
            MY TRANSACTIONS
          </button>
          <button
            onClick={() => setActiveTab("goldex")}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === "goldex"
                ? "text-[#2C1A1D] border-b-2 border-[#2C1A1D] bg-[#CDAA7D]/20"
                : "text-[#8B75AA] hover:text-[#2C1A1D]"
            }`}
          >
            <TrendingUp size={16} className="inline mr-2" />
            GOLDEX
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Purchase Tab */}
          {activeTab === "purchase" && (
            <div>
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-[#2C1A1D] mb-2">Purchase Gold Coins</h3>
                <p className="text-[#8B75AA]">Choose a package to enhance your questing experience</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {goldPackages.map((pkg) => (
                  <div
                    key={pkg.amount}
                    className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${
                      pkg.popular ? "border-[#8B75AA] bg-[#8B75AA]/5" : "border-[#CDAA7D] hover:border-[#8B75AA]/50"
                    }`}
                    onClick={() => purchaseGold(pkg.amount, pkg.price)}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#8B75AA] text-white px-3 py-1 rounded-full text-xs font-bold">
                        MOST POPULAR
                      </div>
                    )}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <Coins size={32} className="text-[#CDAA7D]" />
                        <div>
                          <div className="text-xl font-bold text-[#2C1A1D]">{pkg.amount.toLocaleString()} Gold</div>
                          <div className="text-sm text-[#8B75AA]">₱{pkg.price.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#8B75AA] bg-[#CDAA7D]/20 px-2 py-1 rounded">
                          {pkg.bonus}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-[#8B75AA] text-center">
                      ₱{(pkg.price / pkg.amount).toFixed(2)} per gold
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === "transactions" && (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[#2C1A1D] mb-4">My Transactions</h3>
                <div className="flex items-center gap-2 text-sm text-[#8B75AA] mb-4">
                  <Coins size={16} className="text-[#CDAA7D]" />
                  <span>My Balance: {currentUser?.gold || 0} Gold</span>
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-6">
                  <select
                    className="px-3 py-2 border border-[#CDAA7D] rounded bg-white text-[#2C1A1D] focus:outline-none focus:border-[#8B75AA]"
                    value={transactionFilter}
                    onChange={(e) => setTransactionFilter(e.target.value)}
                  >
                    <option value="all">All Transactions</option>
                    <option value="incoming">Incoming Gold</option>
                    <option value="outgoing">Outgoing Gold</option>
                  </select>
                  <select
                    className="px-3 py-2 border border-[#CDAA7D] rounded bg-white text-[#2C1A1D] focus:outline-none focus:border-[#8B75AA]"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="past-30-days">Past 30 Days</option>
                    <option value="past-90-days">Past 90 Days</option>
                    <option value="all-time">All Time</option>
                  </select>
                </div>
              </div>

              {/* Summary */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={20} className="text-green-600" />
                    <span className="font-bold text-green-800">Incoming Gold</span>
                  </div>
                  <div className="text-2xl font-bold text-green-800">{totalIncoming.toLocaleString()}</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown size={20} className="text-red-600" />
                    <span className="font-bold text-red-800">Outgoing Gold</span>
                  </div>
                  <div className="text-2xl font-bold text-red-800">{totalOutgoing.toLocaleString()}</div>
                </div>
              </div>

              {/* Transaction List */}
              <div className="space-y-3">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="bg-white border border-[#CDAA7D] rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            transaction.type === "incoming" ? "bg-green-100" : "bg-red-100"
                          }`}
                        >
                          {transaction.type === "incoming" ? (
                            <TrendingUp size={16} className="text-green-600" />
                          ) : (
                            <TrendingDown size={16} className="text-red-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-[#2C1A1D]">{transaction.category}</div>
                          <div className="text-sm text-[#8B75AA]">{transaction.description}</div>
                          <div className="text-xs text-[#8B75AA]">{transaction.date.toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div
                        className={`text-lg font-bold ${
                          transaction.type === "incoming" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.type === "incoming" ? "+" : "-"}
                        {transaction.amount} Gold
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GoldEx Tab */}
          {activeTab === "goldex" && (
            <div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-[#2C1A1D] mb-2">GoldEx - Gold Exchange</h3>
                <p className="text-[#8B75AA]">Convert your earned gold into real money</p>
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-r from-[#CDAA7D]/20 to-[#8B75AA]/20 border border-[#CDAA7D] rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-[#8B75AA] mb-1">Keep it up, earn more to cash out!</div>
                      <div className="text-2xl font-bold text-[#2C1A1D]">
                        {Math.floor((currentUser?.gold || 0) / 100) * 100} eligible gold
                      </div>
                      <div className="text-sm text-[#8B75AA]">Current rate: 100 gold for ₱10.00 PHP</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-[#8B75AA] mb-2">Potential Cashout</div>
                      <div className="text-xl font-bold text-[#2C1A1D]">
                        ₱{Math.floor((currentUser?.gold || 0) / 100) * 10}.00
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-[#8B75AA] mb-1">
                      <span>Progress to minimum cashout (500 gold)</span>
                      <span>{Math.min(100, ((currentUser?.gold || 0) / 500) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-[#CDAA7D]/30 rounded-full h-2">
                      <div
                        className="bg-[#8B75AA] h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(100, ((currentUser?.gold || 0) / 500) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={cashOutGold}
                    disabled={(currentUser?.gold || 0) < 500}
                    className={`w-full py-3 rounded font-medium transition-colors ${
                      (currentUser?.gold || 0) >= 500
                        ? "bg-[#8B75AA] text-white hover:bg-[#7A6699]"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {(currentUser?.gold || 0) >= 500 ? "Cash Out" : `Need ${500 - (currentUser?.gold || 0)} more gold`}
                  </button>
                </div>

                <div className="bg-[#8B75AA]/10 border border-[#8B75AA]/30 rounded-lg p-4">
                  <h4 className="font-bold text-[#2C1A1D] mb-2">Important Notes:</h4>
                  <ul className="text-sm text-[#8B75AA] space-y-1">
                    <li>• Minimum cashout: 500 gold coins</li>
                    <li>• Exchange rate: 100 gold = ₱10.00 PHP</li>
                    <li>• Processing time: Up to 72 hours</li>
                    <li>• Only earned gold from completed quests is eligible</li>
                    <li>• Transaction fees may apply for international transfers</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
