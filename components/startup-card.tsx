"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Startup } from "@/lib/mock-data"
import { ForecastModal } from "./forecast-modal"
import { RocketProgressBar } from "./rocket-progress-bar"

const Star = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
)

const MapPin = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    // Set end date to 30 days from now for demo purposes
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 30)
    endDate.setHours(23, 59, 59, 999) // End at end of day

    const updateTimer = () => {
      const now = new Date().getTime()
      const distance = endDate.getTime() - now

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (value: number) => value.toString().padStart(2, "0")

  return (
    <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
      <span>{formatTime(timeLeft.days)}d</span>
      <span>:</span>
      <span>{formatTime(timeLeft.hours)}h</span>
      <span>:</span>
      <span>{formatTime(timeLeft.minutes)}m</span>
      <span>left</span>
    </div>
  )
}

interface StartupCardProps {
  startup: Startup
  onWatchlistToggle?: (startupId: string) => void
  isWatchlisted?: boolean
}

export function StartupCard({ startup, onWatchlistToggle, isWatchlisted = false }: StartupCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showForecastModal, setShowForecastModal] = useState(false)
  const [forecastType, setForecastType] = useState<"increase" | "decrease" | null>(null)

  const formatFunding = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`
    }
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount.toLocaleString()}`
  }

  const formatBettingVolume = (volume?: number) => {
    if (!volume) return "$0"
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`
    }
    if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(0)}K`
    }
    return `$${volume.toLocaleString()}`
  }

  const handleYesClick = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setForecastType("increase")
    setShowForecastModal(true)
  }

  const handleNoClick = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setForecastType("decrease")
    setShowForecastModal(true)
  }

  const handleCloseForecastModal = () => {
    setShowForecastModal(false)
    setForecastType(null)
  }

  const generateQuestion = (companyName: string) => {
    const questions = [
      `Will ${companyName} reach $350B valuation in 2025?`,
      `Will ${companyName} go public by 2026?`,
      `Will ${companyName} double its valuation by 2025?`,
      `Will ${companyName} be acquired by a tech giant in 2025?`,
      `Will ${companyName} achieve $1B ARR by 2026?`,
    ]
    // Use company name hash to consistently pick same question
    const hash = companyName.split("").reduce((a, b) => a + b.charCodeAt(0), 0)
    return questions[hash % questions.length]
  }

  const generateForecastData = (heatScore: number) => {
    // Higher heat score = higher yes percentage
    const baseYes = Math.max(20, Math.min(85, heatScore - 10 + Math.random() * 20))
    const yesPercentage = Math.round(baseYes)
    const noPercentage = 100 - yesPercentage
    return { yesPercentage, noPercentage }
  }

  const question = generateQuestion(startup.name)
  const { yesPercentage, noPercentage } = generateForecastData(startup.heatScore)

  return (
    <>
      <Card
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-lg bg-card border-border rounded-2xl h-full flex flex-col",
          isHovered && "shadow-lg scale-[1.02]",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-3 sm:p-4 flex flex-col h-full">
          <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden flex-shrink-0 bg-white border border-border">
              <img
                src={startup.logoUrl || "/placeholder.svg?height=48&width=48&query=startup logo"}
                alt={startup.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <Link href={`/company/${startup.id}`} className="hover:opacity-80 transition-opacity">
                <h3 className="font-bold text-base sm:text-lg text-card-foreground mb-0.5 leading-tight">{question}</h3>
              </Link>
            </div>

            {onWatchlistToggle && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted rounded-full flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation()
                  onWatchlistToggle(startup.id)
                }}
              >
                <Star className={cn("h-4 w-4", isWatchlisted && "fill-warning text-warning")} />
              </Button>
            )}
          </div>

          <RocketProgressBar
            yesPercentage={yesPercentage}
            noPercentage={noPercentage}
            onYesSwipe={handleYesClick}
            onNoSwipe={handleNoClick}
            className="mb-3 sm:mb-4"
          />

          <div className="space-y-3 mb-4 flex-1">{/* Content area for future use */}</div>

          <div className="flex justify-between items-center text-xs sm:text-sm text-muted-foreground pt-2 sm:pt-3 border-t border-border">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="font-medium">{formatBettingVolume(startup.bettingVolume)} Vol.</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <CountdownTimer />
            </div>
          </div>
        </CardContent>
      </Card>

      <ForecastModal
        isOpen={showForecastModal}
        onClose={handleCloseForecastModal}
        startup={startup}
        forecastType={forecastType}
      />
    </>
  )
}
