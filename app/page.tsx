"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, RefreshCw, Layers, Activity, Database, Sparkles } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "@/components/site-header"
import WalletInfo from "@/components/wallet-info"
import NFTDisplay from "@/components/nft-display"
import TransactionList from "@/components/transaction-list"
import RecentSearches from "@/components/recent-searches"
import { fetchWalletInfo, fetchWalletAssets, fetchAssetDetails, fetchWalletTxs, fetchTransactionCount } from "@/lib/api"
import type { WalletData, Asset, AssetDetail, Transaction } from "@/lib/types"
import { motion } from "framer-motion"

// Default wallet address for demonstration
const DEFAULT_ADDRESS =
  "addr1x88ttk0fk6ssan4g2uf2xtx3anppy3djftmkg959tufsc6qkqt76lg22kjjmnns37fmyue765qz347sxfnyks27ysqaqd3ph23"

export default function Home() {
  // State hooks for application state
  const [address, setAddress] = useState(DEFAULT_ADDRESS)
  const [inputAddress, setInputAddress] = useState(DEFAULT_ADDRESS)
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [assetDetails, setAssetDetails] = useState<Record<string, AssetDetail>>({})
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  /**
   * Function to fetch wallet data
   */
  const fetchData = useCallback(async (walletAddress: string) => {
    setLoading(true)
    setError(null)
    try {
      console.log(`Starting data fetch for wallet: ${walletAddress}`)

      // Fetch wallet information
      const walletInfo = await fetchWalletInfo(walletAddress)
      setWalletData(walletInfo)
      console.log("Wallet info fetched successfully")

      // Get total transaction count - make sure this happens before setting walletData
      try {
        const txCount = await fetchTransactionCount(walletAddress)
        setTotalTransactions(txCount)
        console.log(`Total transactions: ${txCount}`)

        // Update the walletInfo with the correct transaction count
        if (walletInfo) {
          walletInfo.transactions_count = txCount
        }
      } catch (txCountError) {
        console.error("Error fetching transaction count:", txCountError)
        // If we can't get the transaction count, use the one from wallet info
        if (walletInfo && walletInfo.transactions_count) {
          setTotalTransactions(walletInfo.transactions_count)
        }
      }

      // Fetch wallet transactions
      try {
        console.log("Fetching wallet transactions...")
        const txs = await fetchWalletTxs(walletAddress)
        setTransactions(txs)
        console.log(`Loaded ${txs.length} transactions`)
      } catch (txError) {
        console.error("Error fetching transactions:", txError)
      }

      // Fetch wallet assets (NFTs)
      const walletAssets = await fetchWalletAssets(walletAddress)
      setAssets(walletAssets)
      console.log(`Found ${walletAssets.length} assets in wallet`)

      // Fetch details for each asset
      const details: Record<string, AssetDetail> = {}
      const nftAssets = walletAssets.filter((asset) => asset.unit !== "lovelace")
      console.log(`Found ${nftAssets.length} NFT assets to fetch details for`)

      // Limit the number of NFTs to fetch details for to avoid rate limiting
      const MAX_NFTS_TO_FETCH = 20
      const assetsToFetch = nftAssets.slice(0, MAX_NFTS_TO_FETCH)

      if (nftAssets.length > MAX_NFTS_TO_FETCH) {
        console.log(`Limiting NFT details fetch to ${MAX_NFTS_TO_FETCH} out of ${nftAssets.length} total NFTs`)
      }

      // Fetch details for each asset with better error handling
      const assetFetchPromises = assetsToFetch.map((asset) =>
        fetchAssetDetails(asset.unit)
          .then((assetDetail) => ({ asset: asset.unit, detail: assetDetail }))
          .catch((error) => {
            console.error(`Error fetching details for asset ${asset.unit}:`, error)
            return { asset: asset.unit, error }
          }),
      )

      const assetResults = await Promise.allSettled(assetFetchPromises)

      // Process results
      assetResults.forEach((result) => {
        if (result.status === "fulfilled") {
          const value = result.value
          // Check if this is a successful result with detail property
          if ("detail" in value && value.detail) {
            details[value.asset] = value.detail
          }
        }
      })

      setAssetDetails(details)
      console.log("Asset details fetched successfully")

      // Add to recent searches
      const savedSearches = localStorage.getItem("recentSearches")
      let recentSearches: string[] = savedSearches ? JSON.parse(savedSearches) : []

      // Remove if exists to avoid duplicates
      recentSearches = recentSearches.filter((search) => search !== walletAddress)

      // Add to beginning and limit to 5
      recentSearches = [walletAddress, ...recentSearches].slice(0, 5)

      // Save back to localStorage
      localStorage.setItem("recentSearches", JSON.stringify(recentSearches))
    } catch (err: any) {
      console.error("Error fetching data:", err)

      // Provide a user-friendly error message
      let errorMessage = "Failed to fetch wallet data. Please check the address and try again."

      if (err instanceof Error) {
        // Extract the most relevant part of the error message
        if (err.message.includes("404")) {
          errorMessage = "Wallet address not found. Please check the address and try again."
        } else if (err.message.includes("429")) {
          errorMessage = "Too many requests. Please wait a moment and try again."
        } else if (err.message.includes("authentication")) {
          errorMessage = "API authentication error. Please check your API key."
        } else if (err.message.includes("Failed to fetch")) {
          errorMessage = "Network connection error. Please check your internet connection and try again."
        } else if (err.message.includes("timeout") || err.message.includes("Timeout")) {
          errorMessage = "Request timed out. The server may be experiencing high load. Please try again later."
        } else {
          // Use the full error message if it contains useful information
          errorMessage = err.message
        }
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Effect hook to load data when address changes
   */
  useEffect(() => {
    fetchData(address)
  }, [address, fetchData])

  /**
   * Form submission handler
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputAddress.trim()) {
      setAddress(inputAddress.trim())
    }
  }

  /**
   * Refresh button handler
   */
  const handleRefresh = () => {
    fetchData(address)
  }

  /**
   * Handler for selecting an address from recent searches
   */
  const handleSelectAddress = (selectedAddress: string) => {
    setInputAddress(selectedAddress)
    setAddress(selectedAddress)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-cyan-50 to-white dark:from-teal-950 dark:via-cyan-950 dark:to-gray-900">
      <SiteHeader />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <h1 className="text-6xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-600 animate-text-shimmer">
            Cardano NFT Explorer
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-light flex items-center justify-center">
            <Sparkles className="h-5 w-5 mr-2 text-teal-500" />
            Explore Cardano wallets and discover unique NFTs
          </p>
        </motion.div>

        {/* Recent Searches */}
        <RecentSearches onSelectAddress={handleSelectAddress} />

        {/* Search form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-2 max-w-3xl mx-auto mb-8"
        >
          <Input
            type="text"
            placeholder="Enter Cardano wallet address"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            className="flex-1 border-teal-300 focus:border-teal-500 dark:border-teal-700"
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1 sm:flex-none bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
              disabled={loading}
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
              className="border-teal-300 text-teal-700 hover:bg-teal-100 dark:border-teal-700 dark:text-teal-300 dark:hover:bg-teal-900"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </motion.form>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <Card className="mb-8 border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
              <CardContent className="pt-6 text-red-600 dark:text-red-300">{error}</CardContent>
            </Card>
          </motion.div>
        )}

        {loading ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/3" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/4" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-64 w-full rounded-lg" />
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          walletData && (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <WalletInfo
                walletData={walletData}
                address={address}
                transactions={transactions}
                totalTransactions={totalTransactions}
              />

              <Tabs defaultValue="nfts" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4 bg-teal-100/50 dark:bg-teal-900/20">
                  <TabsTrigger
                    value="nfts"
                    className="flex items-center gap-2 data-[state=active]:bg-teal-200 dark:data-[state=active]:bg-teal-800"
                  >
                    <Layers className="h-4 w-4" />
                    <span>NFT Collection</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="transactions"
                    className="flex items-center gap-2 data-[state=active]:bg-teal-200 dark:data-[state=active]:bg-teal-800"
                  >
                    <Activity className="h-4 w-4" />
                    <span>Transactions</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="raw"
                    className="flex items-center gap-2 data-[state=active]:bg-teal-200 dark:data-[state=active]:bg-teal-800"
                  >
                    <Database className="h-4 w-4" />
                    <span>Raw Data</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="nfts">
                  <Card className="border border-teal-200 dark:border-teal-800 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-xl font-bold flex items-center text-teal-800 dark:text-teal-300">
                        <Layers className="mr-2 h-5 w-5" />
                        NFT Collection ({assets.filter((a) => a.unit !== "lovelace").length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {assets.filter((a) => a.unit !== "lovelace").length > 0 ? (
                        <NFTDisplay
                          assets={assets}
                          assetDetails={assetDetails}
                          viewMode={viewMode}
                          onViewModeChange={setViewMode}
                        />
                      ) : (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                          <Layers className="mx-auto h-12 w-12 mb-4 opacity-30" />
                          <p>No NFTs found in this wallet</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="transactions">
                  <Card className="border border-teal-200 dark:border-teal-800 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold flex items-center text-teal-800 dark:text-teal-300">
                        <Activity className="mr-2 h-5 w-5" />
                        Transaction History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TransactionList
                        transactions={transactions}
                        address={address}
                        totalTransactions={totalTransactions}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="raw">
                  <Card className="border border-teal-200 dark:border-teal-800 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold flex items-center text-teal-800 dark:text-teal-300">
                        <Database className="mr-2 h-5 w-5" />
                        Raw Wallet Data
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg overflow-auto max-h-[500px]">
                        <pre className="text-xs font-mono">{JSON.stringify(walletData, null, 2)}</pre>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          )
        )}
      </main>
    </div>
  )
}

