"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, Wallet, DollarSign, Coins, Clock, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { WalletData, Transaction } from "@/lib/types"
import { fetchAdaPrice } from "@/lib/api"
import { motion } from "framer-motion"

interface WalletInfoProps {
  walletData: WalletData
  address: string
  transactions: Transaction[]
  totalTransactions: number
}

export default function WalletInfo({ walletData, address, transactions, totalTransactions }: WalletInfoProps) {
  const [adaPrice, setAdaPrice] = useState<number>(0)
  const [copied, setCopied] = useState(false)

  // Fetch ADA price when component mounts
  useEffect(() => {
    fetchAdaPrice().then(setAdaPrice)
  }, [])

  // Format ADA amount (lovelace to ADA) with full precision
  const formatAda = (lovelace: string | number) => {
    const amount = typeof lovelace === "string" ? Number.parseInt(lovelace, 10) : lovelace
    return (amount / 1000000).toFixed(6)
  }

  // Format USD value
  const formatUsd = (value: number) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  // Copy address to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Calculate total ADA balance
  const totalBalance = walletData.amount
    ? walletData.amount.reduce((total, asset) => {
        if (asset.unit === "lovelace") {
          return total + Number.parseInt(asset.quantity, 10)
        }
        return total
      }, 0)
    : 0

  // Calculate USD value
  const adaBalance = totalBalance / 1000000
  const usdValue = adaBalance * adaPrice

  // Get NFT count
  const nftCount = walletData.amount ? walletData.amount.filter((asset) => asset.unit !== "lovelace").length : 0

  return (
    <Card className="border border-teal-200 dark:border-teal-800 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 h-3" />
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <motion.div
            className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/30"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Wallet className="h-8 w-8 text-teal-600 dark:text-teal-300" />
          </motion.div>

          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-300">Wallet Overview</h2>
              <div className="flex items-center mt-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[240px] sm:max-w-md md:max-w-xl">
                  {address}
                </p>
                <TooltipProvider>
                  <Tooltip open={copied}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-8 w-8 ml-1">
                        <Copy className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
                        <span className="sr-only">Copy address</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{copied ? "Copied!" : "Copy address"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <a
                  href={`https://cardanoscan.io/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1"
                >
                  <ExternalLink className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
                  <span className="sr-only">View on Cardanoscan</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div
                className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 p-4 rounded-lg shadow-sm border border-teal-100 dark:border-teal-800 card-hover-effect"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-1">
                  <Coins className="h-4 w-4 mr-2 text-teal-600 dark:text-teal-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
                </div>
                <p className="text-2xl font-bold text-teal-800 dark:text-teal-300">{formatAda(totalBalance)} ₳</p>
                <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <DollarSign className="h-3 w-3 mr-1 text-green-600 dark:text-green-400" />
                  {formatUsd(usdValue)}
                </div>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 p-4 rounded-lg shadow-sm border border-teal-100 dark:border-teal-800 card-hover-effect"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex items-center mb-1">
                  <Layers className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">NFTs</p>
                </div>
                <p className="text-2xl font-bold text-teal-800 dark:text-teal-300">{nftCount}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {nftCount > 0 ? "Click to explore" : "No NFTs found"}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 p-4 rounded-lg shadow-sm border border-teal-100 dark:border-teal-800 card-hover-effect"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="flex items-center mb-1">
                  <Clock className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Transactions</p>
                </div>
                <p className="text-2xl font-bold text-teal-800 dark:text-teal-300">
                  {totalTransactions > 0 ? totalTransactions : walletData.transactions_count || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{transactions.length} loaded</p>
              </motion.div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className="bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700">
                Stake: {walletData.stake_address ? "Yes" : "No"}
              </Badge>
              <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700">
                Type: {walletData.type || "Unknown"}
              </Badge>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700">
                Script: {walletData.script ? "Yes" : "No"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

