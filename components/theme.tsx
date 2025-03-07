"use client"

import { useState, useEffect } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sun, Moon, Laptop, SunMoon } from "lucide-react"

/**
 * Theme Provider Component
 *
 * Wraps the application with the NextThemesProvider to enable theme switching.
 * This component should be used in the root layout.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

/**
 * Theme Toggle Props
 */
interface ThemeToggleProps {
  /**
   * The variant of the theme toggle to use
   * @default "dropdown"
   */
  variant?: "dropdown" | "simple"
}

/**
 * Theme Toggle Component
 *
 * Provides a UI for toggling between light, dark, and system themes.
 * Supports two variants: "dropdown" (with menu) and "simple" (single button).
 */
export function ThemeToggle({ variant = "dropdown" }: ThemeToggleProps) {
  // Use the theme hook from next-themes
  const { theme, setTheme } = useTheme()

  // State for tracking if the component is mounted (client-side)
  // This is needed because next-themes only works on the client
  const [mounted, setMounted] = useState(false)

  // Effect for setting mounted to true after first render
  useEffect(() => {
    setMounted(true)
  }, [])

  // If component isn't mounted, return placeholder to prevent hydration errors
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9">
        <SunMoon className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  // Function for cycling through themes (used in simple variant)
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  // Determine which icon to show based on current theme
  const ThemeIcon = () => {
    if (theme === "dark") return <Moon className="h-[1.2rem] w-[1.2rem]" />
    if (theme === "light") return <Sun className="h-[1.2rem] w-[1.2rem]" />
    return <SunMoon className="h-[1.2rem] w-[1.2rem]" />
  }

  // Simple variant (single button that cycles through themes)
  if (variant === "simple") {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="w-9 h-9 relative"
          title={`Current theme: ${theme === "light" ? "Light" : theme === "dark" ? "Dark" : "System"}`}
        >
          <ThemeIcon />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <span className="text-xs text-muted-foreground hidden sm:inline-block">
          {theme === "light" ? "Light" : theme === "dark" ? "Dark" : "System"}
        </span>
      </div>
    )
  }

  // Dropdown variant (menu with options)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-9 h-9">
          <ThemeIcon />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-2 cursor-pointer">
          <Sun className="h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-2 cursor-pointer">
          <Moon className="h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center gap-2 cursor-pointer">
          <Laptop className="h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

