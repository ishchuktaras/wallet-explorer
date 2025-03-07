"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Info, LayoutGrid, List, Sparkles, Tag, Layers, Clock } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { Asset, AssetDetail } from "@/lib/types"
import { motion } from "framer-motion"

// Define a more specific type for metadata objects
interface NFTMetadata {
  name?: string
  image?: string | { src?: string; mediaType?: string } | any
  description?: string | any
  attributes?: Array<{ trait_type?: string; name?: string; value: any }> | Record<string, any> | any
  files?: Array<{ name?: string; mediaType?: string; src?: string } | string> | any
  image_base64?: string
  media?: string
  imageUrl?: string
  mediaType?: string
  src?: string
  [key: string]: any
}

export type ViewMode = "grid" | "list"

interface NFTDisplayProps {
  assets: Asset[]
  assetDetails: Record<string, AssetDetail>
  viewMode: ViewMode
  onViewModeChange?: (mode: ViewMode) => void
  debug?: boolean
}

export default function NFTDisplay({
  assets,
  assetDetails,
  viewMode,
  onViewModeChange,
  debug = false,
}: NFTDisplayProps) {
  const nftAssets = assets.filter((asset) => asset.unit !== "lovelace")
  const [selectedNft, setSelectedNft] = useState<{ asset: Asset; details?: AssetDetail } | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleViewModeChange = (mode: ViewMode) => {
    if (onViewModeChange) {
      onViewModeChange(mode)
    }
  }

  const handleNftClick = (asset: Asset, details?: AssetDetail) => {
    setSelectedNft({ asset, details })
    setIsDialogOpen(true)
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
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-teal-600 dark:text-teal-400 font-medium">
          <Sparkles className="h-4 w-4 inline-block mr-1" />
          Click on any NFT to view details
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleViewModeChange("grid")}
            className={`${
              viewMode === "grid"
                ? "bg-teal-100 text-teal-700 border-teal-300 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800"
                : ""
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleViewModeChange("list")}
            className={`${
              viewMode === "list"
                ? "bg-teal-100 text-teal-700 border-teal-300 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800"
                : ""
            }`}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <motion.div
        className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {nftAssets.map((asset) => (
          <NFTCard
            key={asset.unit}
            asset={asset}
            details={assetDetails[asset.unit]}
            viewMode={viewMode}
            debug={debug}
            onClick={() => handleNftClick(asset, assetDetails[asset.unit])}
            variants={item}
          />
        ))}
      </motion.div>

      <NFTDetailDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} nft={selectedNft} />
    </div>
  )
}

interface NFTCardProps {
  asset: Asset
  details?: AssetDetail
  viewMode: ViewMode
  debug?: boolean
  onClick: () => void
  variants?: any
}

function NFTCard({ asset, details, viewMode, debug = false, onClick, variants }: NFTCardProps) {
  const nftDetails = details || {
    asset_name: "Loading...",
    metadata: { name: "Loading..." },
    onchain_metadata: null,
    fingerprint: null,
  }

  const metadata = (nftDetails?.onchain_metadata || nftDetails?.metadata || {}) as NFTMetadata
  const name = metadata.name || nftDetails?.asset_name || "Unnamed NFT"
  const description = typeof metadata.description === "string" ? metadata.description : "No description available"
  const imageUrl = processImageUrl(metadata)

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Image failed to load:", imageUrl)
    ;(e.target as HTMLImageElement).src =
      `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' fill='%23cccccc'%3E%3Crect width='400' height='400' /%3E%3Ctext x='50%25' y='50%25' dominantBaseline='middle' textAnchor='middle' fontFamily='sans-serif' fontSize='24px' fill='%23ffffff'%3ENo Image%3C/text%3E%3C/svg%3E`
  }

  if (viewMode === "grid") {
    return (
      <motion.div variants={variants}>
        <Card
          className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-teal-500/10 to-indigo-500/10 border-teal-200 dark:border-teal-800 cursor-pointer transform hover:scale-[1.02] hover:rotate-1"
          onClick={onClick}
        >
          <div className="relative aspect-square overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                imageUrl ||
                `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' fill='%23cccccc'%3E%3Crect width='400' height='400' /%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24px' fill='%23ffffff'%3ENo Image%3C/text%3E%3C/svg%3E`
              }
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              onError={handleImageError}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div className="p-4 text-white w-full">
                <p className="font-bold truncate">{name}</p>
              </div>
            </div>
            {debug && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  console.log("NFT Debug Info:", { metadata, imageUrl })
                }}
                className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70"
              >
                <Info className="h-4 w-4" />
              </button>
            )}
          </div>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-teal-800 dark:text-teal-300 truncate" title={name}>
                {name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{description}</p>
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-teal-100 dark:border-teal-800">
                <a
                  href={`https://cardanoscan.io/token/${asset.unit}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs flex items-center text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  View on Cardanoscan
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div variants={variants}>
      <Card
        className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-teal-500/10 to-indigo-500/10 border-teal-200 dark:border-teal-800 cursor-pointer hover:border-teal-400 dark:hover:border-teal-600"
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  imageUrl ||
                  `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' fill='%23cccccc'%3E%3Crect width='400' height='400' /%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24px' fill='%23ffffff'%3ENo Image%3C/text%3E%3C/svg%3E`
                }
                alt={name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                onError={handleImageError}
                loading="lazy"
              />
              {debug && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log("NFT Debug Info:", { metadata, imageUrl })
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70"
                >
                  <Info className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-teal-800 dark:text-teal-300 truncate" title={name}>
                {name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">{description}</p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <a
                  href={`https://cardanoscan.io/token/${asset.unit}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs flex items-center px-2 py-1 rounded-md bg-teal-100 dark:bg-teal-900/30 text-teal-600 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  View on Cardanoscan
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
                <a
                  href={`https://pool.pm/${asset.unit}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs flex items-center px-2 py-1 rounded-md bg-teal-100 dark:bg-teal-900/30 text-teal-600 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  View on Pool.pm
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface NFTDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  nft: { asset: Asset; details?: AssetDetail } | null
}

function NFTDetailDialog({ open, onOpenChange, nft }: NFTDetailDialogProps) {
  if (!nft) return null

  const { asset, details } = nft
  const metadata = details?.onchain_metadata || details?.metadata || ({} as NFTMetadata)
  const name = metadata.name || details?.asset_name || "Unnamed NFT"
  const description = typeof metadata.description === "string" ? metadata.description : "No description available"
  const imageUrl = processImageUrl(metadata)

  // Extract attributes from metadata
  const attributes = metadata.attributes || []
  const isAttributesArray = Array.isArray(attributes)

  // Format policy ID for display
  const policyId = asset.unit.slice(0, 56)
  const assetName = asset.unit.slice(56)

  // Format creation date if available
  const mintDate = details?.initial_mint_tx_hash
    ? new Date().toLocaleDateString() // This is a placeholder, ideally we'd get the actual date from the transaction
    : "Unknown"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-white to-teal-50 dark:from-gray-900 dark:to-teal-950/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-teal-800 dark:text-teal-300 flex items-center">
            <Sparkles className="mr-2 h-5 w-5" />
            {name}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">{description}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden border-2 border-teal-200 dark:border-teal-800 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  imageUrl ||
                  `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600' fill='%23cccccc'%3E%3Crect width='600' height='600' /%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='32px' fill='%23ffffff'%3ENo Image%3C/text%3E%3C/svg%3E`
                }
                alt={name}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src =
                    `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600' fill='%23cccccc'%3E%3Crect width='600' height='600' /%3E%3Ctext x='50%25' y='50%25' dominantBaseline='middle' textAnchor='middle' fontFamily='sans-serif' fontSize='32px' fill='%23ffffff'%3ENo Image%3C/text%3E%3C/svg%3E`
                }}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={`https://cardanoscan.io/token/${asset.unit}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-2 bg-teal-100 hover:bg-teal-200 dark:bg-teal-900/50 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 rounded-md text-sm font-medium transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                View on Cardanoscan
              </a>
              <a
                href={`https://pool.pm/${asset.unit}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-md text-sm font-medium transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                View on Pool.pm
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-teal-800 dark:text-teal-300 flex items-center mb-2">
                <Info className="mr-2 h-4 w-4" />
                NFT Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-teal-50 dark:bg-teal-900/20 rounded">
                  <span className="text-gray-600 dark:text-gray-400">Policy ID</span>
                  <span className="font-mono text-teal-700 dark:text-teal-300 truncate max-w-[200px]" title={policyId}>
                    {policyId}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-teal-50 dark:bg-teal-900/20 rounded">
                  <span className="text-gray-600 dark:text-gray-400">Asset Name</span>
                  <span className="font-mono text-teal-700 dark:text-teal-300 truncate max-w-[200px]" title={assetName}>
                    {assetName}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-teal-50 dark:bg-teal-900/20 rounded">
                  <span className="text-gray-600 dark:text-gray-400">Quantity</span>
                  <span className="font-mono text-teal-700 dark:text-teal-300">{asset.quantity}</span>
                </div>
                <div className="flex justify-between p-2 bg-teal-50 dark:bg-teal-900/20 rounded">
                  <span className="text-gray-600 dark:text-gray-400">Fingerprint</span>
                  <span
                    className="font-mono text-teal-700 dark:text-teal-300 truncate max-w-[200px]"
                    title={details?.fingerprint}
                  >
                    {details?.fingerprint || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-teal-50 dark:bg-teal-900/20 rounded">
                  <span className="text-gray-600 dark:text-gray-400">Mint Date</span>
                  <span className="font-mono text-teal-700 dark:text-teal-300 flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {mintDate}
                  </span>
                </div>
              </div>
            </div>

            {isAttributesArray && attributes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-teal-800 dark:text-teal-300 flex items-center mb-2">
                  <Tag className="mr-2 h-4 w-4" />
                  Attributes
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {attributes.map((attr: any, index: number) => {
                    const traitType = attr.trait_type || attr.name || "Trait"
                    const value = attr.value || "N/A"
                    return (
                      <Badge
                        key={index}
                        className="flex justify-between p-2 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                      >
                        <span className="font-medium">{traitType}:</span>
                        <span className="ml-1">{value.toString()}</span>
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}

            {!isAttributesArray && typeof attributes === "object" && Object.keys(attributes).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-teal-800 dark:text-teal-300 flex items-center mb-2">
                  <Tag className="mr-2 h-4 w-4" />
                  Attributes
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(attributes).map(([key, value], index) => (
                    <Badge
                      key={index}
                      className="flex justify-between p-2 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                    >
                      <span className="font-medium">{key}:</span>
                      <span className="ml-1">{value?.toString() || "N/A"}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-teal-800 dark:text-teal-300 flex items-center mb-2">
                <Layers className="mr-2 h-4 w-4" />
                Blockchain Data
              </h3>
              <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                <pre className="text-xs font-mono overflow-x-auto text-teal-700 dark:text-teal-300 max-h-[150px]">
                  {JSON.stringify(details, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function processImageUrl(metadata: NFTMetadata | null | undefined): string {
  // Return placeholder if metadata is null or undefined
  if (!metadata) {
    return `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' fill='%23cccccc'%3E%3Crect width='400' height='400' /%3E%3Ctext x='50%25' y='50%25' dominantBaseline='middle' textAnchor='middle' fontFamily='sans-serif' fontSize='24px' fill='%23ffffff'%3ENo Image%3C/text%3E%3C/svg%3E`
  }

  let imageUrl = `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' fill='%23cccccc'%3E%3Crect width='400' height='400' /%3E%3Ctext x='50%25' y='50%25' dominantBaseline='middle' textAnchor='middle' fontFamily='sans-serif' fontSize='24px' fill='%23ffffff'%3ENo Image%3C/text%3E%3C/svg%3E`

  try {
    const processIpfsUrl = (url: string) => {
      if (url.startsWith("ipfs://")) {
        return "https://ipfs.io/ipfs/" + url.replace("ipfs://", "")
      }
      return url
    }

    if (metadata.image) {
      if (typeof metadata.image === "string") {
        imageUrl = processIpfsUrl(metadata.image)
      } else if (metadata.image && typeof metadata.image === "object") {
        if ("src" in metadata.image) {
          imageUrl = processIpfsUrl(metadata.image.src)
        }
      }
    } else if (metadata.files && Array.isArray(metadata.files) && metadata.files.length > 0) {
      const firstFile = metadata.files[0]
      if (typeof firstFile === "string") {
        imageUrl = processIpfsUrl(firstFile)
      } else if (typeof firstFile === "object" && firstFile && "src" in firstFile) {
        imageUrl = processIpfsUrl(firstFile.src)
      }
    } else if (metadata.mediaType && metadata.src) {
      imageUrl = processIpfsUrl(metadata.src)
    } else if (metadata.image_base64) {
      imageUrl = `data:image/png;base64,${metadata.image_base64}`
    }

    return imageUrl
  } catch (error) {
    console.error("Error processing image URL:", error)
    return `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' fill='%23cccccc'%3E%3Crect width='400' height='400' /%3E%3Ctext x='50%25' y='50%25' dominantBaseline='middle' textAnchor='middle' fontFamily='sans-serif' fontSize='24px' fill='%23ffffff'%3ENo Image%3C/text%3E%3C/svg%3E`
  }
}

