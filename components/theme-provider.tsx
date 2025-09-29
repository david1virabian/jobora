"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

type ThemeProviderContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme | undefined>(undefined)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const savedTheme = localStorage.getItem("theme") as Theme | null
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const initialTheme = savedTheme || systemTheme

    console.log("[v0] Loading saved theme:", savedTheme, "system theme:", systemTheme, "initial theme:", initialTheme)

    setTheme(initialTheme)
    document.documentElement.classList.toggle("dark", initialTheme === "dark")
  }, [])

  useEffect(() => {
    if (theme && mounted) {
      document.documentElement.classList.toggle("dark", theme === "dark")
    }
  }, [theme, mounted])

  const updateTheme = (newTheme: Theme) => {
    console.log("[v0] Setting theme to:", newTheme)
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const toggleTheme = () => {
    if (!theme) return // Prevent toggle before theme is loaded
    const newTheme = theme === "light" ? "dark" : "light"
    console.log("[v0] Toggling theme from", theme, "to", newTheme)
    updateTheme(newTheme)
  }

  if (!mounted || theme === undefined) {
    return null
  }

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme: updateTheme, toggleTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
