"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, ArrowUpRight, ArrowDownLeft, Calendar, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Transaction } from "@/lib/types"
import { fetchMoreWalletTxs } from "@/lib/api"
import { motion } from "framer-motion"

interface TransactionListProps {
  transactions: Transaction[]
  address: string
  totalTransactions: number
}

export default function TransactionList({ transactions, address, totalTransactions }: TransactionListProps) {
  const [loadingMore, setLoadingMore] = useState(false)
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(transactions)
  const [page, setPage] = useState(1)

  const loadMoreTransactions = async () => {
    if (loadingMore) return

    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const newTransactions = await fetchMoreWalletTxs(address, nextPage)
      setAllTransactions([...allTransactions, ...newTransactions])
      setPage(nextPage)
    } catch (error) {
      console.error("Error loading more transactions:", error)
    } finally {
      setLoadingMore(false)
    }
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <Calendar className="mx-auto h-12 w-12 mb-4 opacity-30" />
        <p>No transaction history available</p>
      </div>
    )
  }

  // Helper function to format time ago without date-fns
  const formatTimeAgo = (timestamp: number): string => {
    const now = new Date().getTime()
    const diff = now - timestamp

    // Convert to seconds, minutes, hours, days
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""} ago`
    } else if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""} ago`
    } else if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    } else {
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-4">
      {totalTransactions > allTransactions.length && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          Showing {allTransactions.length} of {totalTransactions} transactions
        </div>
      )}

      <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
        {allTransactions.map((tx, index) => {
          const isIncoming =
            tx.inputs && Array.isArray(tx.inputs) && tx.inputs.every((input) => input.address !== address)
          const isOutgoing =
            tx.outputs && Array.isArray(tx.outputs) && tx.outputs.every((output) => output.address !== address)
          const isSelf = !isIncoming && !isOutgoing

          // Calculate total value change for this address
          let valueChange = 0

          // Add outputs to this address
          if (tx.outputs && Array.isArray(tx.outputs)) {
            tx.outputs.forEach((output) => {
              if (output.address === address && output.amount && Array.isArray(output.amount)) {
                output.amount.forEach((amount) => {
                  if (amount.unit === "lovelace") {
                    valueChange += Number.parseInt(amount.quantity)
                  }
                })
              }
            })
          }

          // Subtract inputs from this address
          if (tx.inputs && Array.isArray(tx.inputs)) {
            tx.inputs.forEach((input) => {
              if (input.address === address && input.amount && Array.isArray(input.amount)) {
                input.amount.forEach((amount) => {
                  if (amount.unit === "lovelace") {
                    valueChange -= Number.parseInt(amount.quantity)
                  }
                })
              }
            })
          }

          // Format the transaction time
          const txTime = new Date(tx.block_time * 1000)
          const timeAgo = formatTimeAgo(txTime.getTime())

          // Count NFTs in this transaction
          const nftCount =
            tx.outputs && Array.isArray(tx.outputs)
              ? tx.outputs.reduce((count, output) => {
                  return (
                    count +
                    (output.amount && Array.isArray(output.amount)
                      ? output.amount.filter((amount) => amount.unit !== "lovelace").length
                      : 0)
                  )
                }, 0)
              : 0

          return (
            <motion.div key={tx.tx_hash} variants={item}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow border-teal-200 dark:border-teal-800 hover:border-teal-300 dark:hover:border-teal-700">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div
                      className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full ${
                        isIncoming
                          ? "bg-green-100 dark:bg-green-900/30"
                          : isOutgoing
                            ? "bg-red-100 dark:bg-red-900/30"
                            : "bg-teal-100 dark:bg-teal-900/30"
                      }`}
                    >
                      {isIncoming ? (
                        <ArrowDownLeft className="h-6 w-6 text-green-500" />
                      ) : isOutgoing ? (
                        <ArrowUpRight className="h-6 w-6 text-red-500" />
                      ) : (
                        <ArrowUpRight className="h-6 w-6 text-teal-500" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3
                            className={`font-bold text-lg ${
                              isIncoming
                                ? "text-green-600 dark:text-green-400"
                                : isOutgoing
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-teal-600 dark:text-teal-400"
                            }`}
                          >
                            {isIncoming ? "Received" : isOutgoing ? "Sent" : "Self Transaction"}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {timeAgo} • {txTime.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          {valueChange !== 0 && (
                            <p className={`font-bold ${valueChange > 0 ? "text-green-500" : "text-red-500"}`}>
                              {valueChange > 0 ? "+" : ""}
                              {(valueChange / 1000000).toLocaleString()} ADA
                            </p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Fee: {(Number(tx.fees) / 1000000).toLocaleString()} ADA
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {nftCount > 0 && (
                          <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700">
                            {nftCount} NFT{nftCount !== 1 ? "s" : ""}
                          </Badge>
                        )}
                        <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700">
                          Block: {tx.block_height}
                        </Badge>
                      </div>

                      <div className="mt-3 pt-3 border-t border-teal-100 dark:border-teal-800">
                        <a
                          href={`https://cardanoscan.io/transaction/${tx.tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs flex items-center text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
                        >
                          View on Cardanoscan <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {totalTransactions > allTransactions.length && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={loadMoreTransactions}
            disabled={loadingMore}
            variant="outline"
            className="border-teal-300 text-teal-700 hover:bg-teal-100 dark:border-teal-700 dark:text-teal-300 dark:hover:bg-teal-900"
          >
            {loadingMore ? "Loading..." : "Load More Transactions"}
            {!loadingMore && <ChevronDown className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      )}
    </div>
  )
}

