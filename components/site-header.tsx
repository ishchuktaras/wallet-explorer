"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-fuchsia-600">
              Cardano Explorer
            </span>
          </Link>
        </div>

        <div className="flex items-center">
          <ThemeToggle variant="simple" />
        </div>
      </div>
    </header>
  )
}

