"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = () => {
    toggleTheme()
  }

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="h-9 w-9" />
  }

  const isDark = theme === "dark"

  return (
    <Button variant="ghost" size="icon" onClick={handleToggle} className="h-9 w-9">
      {isDark ? <Sun className="h-4 w-4 transition-all" /> : <Moon className="h-4 w-4 transition-all" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
