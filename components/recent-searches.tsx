"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { History, X } from "lucide-react"

interface RecentSearchesProps {
  onSelectAddress: (address: string) => void
}

export default function RecentSearches({ onSelectAddress }: RecentSearchesProps) {
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches")
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches))
    }
  }, [])

  const handleRemoveSearch = (e: React.MouseEvent, address: string) => {
    e.stopPropagation()
    const updatedSearches = recentSearches.filter((search) => search !== address)
    setRecentSearches(updatedSearches)
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))
  }

  if (recentSearches.length === 0) {
    return null
  }

  return (
    <Card className="mb-6 border-purple-200 dark:border-purple-800">
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          <History className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-300" />
          <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300">Recent Searches</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {recentSearches.map((address) => (
            <div
              key={address}
              onClick={() => onSelectAddress(address)}
              className="flex items-center bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-full text-xs text-purple-700 dark:text-purple-300 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <span className="truncate max-w-[180px]">{address}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleRemoveSearch(e, address)}
                className="h-4 w-4 ml-1 p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

