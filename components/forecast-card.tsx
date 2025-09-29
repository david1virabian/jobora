"use client"
import { Star, TrendingUp, TrendingDown, Users } from "lucide-react"
import type React from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Forecast, Startup } from "@/lib/mock-data"
import { useRouter } from "next/navigation"

interface ForecastCardProps {
  forecast: Forecast
  startup: Startup
  onWatchlistToggle?: (forecastId: string) => void
  isWatchlisted?: boolean
  onForecastClick?: (forecast: Forecast, startup: Startup) => void
}

export function ForecastCard({
  forecast,
  startup,
  onWatchlistToggle,
  isWatchlisted,
  onForecastClick,
}: ForecastCardProps) {
  const router = useRouter()
  const isPositiveChange = forecast.change24hPct > 0
  const resolutionDate = new Date(forecast.resolutionDate)
  const daysUntilResolution = Math.ceil((resolutionDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on interactive elements
    const target = e.target as HTMLElement
    const isInteractiveElement = target.closest("button") || target.closest('[role="button"]') || target.closest("a")

    if (!isInteractiveElement) {
      router.push(`/company/${startup.id}`)
    }
  }

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onWatchlistToggle?.(forecast.id)
  }

  const handleForecastClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onForecastClick?.(forecast, startup)
  }

  return (
    <Card
      className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/20 cursor-pointer relative"
      onClick={handleCardClick}
      style={{ minHeight: "fit-content" }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={startup.logoUrl || "/placeholder.svg"} alt={startup.name} />
              <AvatarFallback className="bg-white text-foreground">
                {startup.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">{startup.name}</h3>
              <p className="text-xs text-muted-foreground">{startup.oneLiner}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative z-10" onClick={handleWatchlistClick}>
            <Star className={cn("h-4 w-4", isWatchlisted && "fill-accent text-accent")} />
          </Button>
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {startup.sector.map((sector) => (
            <Badge key={sector} variant="secondary" className="text-xs">
              {sector}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-balance leading-relaxed">{forecast.question}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-mono font-bold" style={{ color: "var(--yes-soft)" }}>
                  {forecast.yesPct}%
                </div>
              </div>
              <div className="flex items-center space-x-1 text-sm">
                {isPositiveChange ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={cn("font-mono text-xs", isPositiveChange ? "text-success" : "text-destructive")}>
                  {isPositiveChange ? "+" : ""}
                  {forecast.change24hPct.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span className="font-mono">{forecast.participation.toLocaleString()}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {daysUntilResolution > 0 ? `${daysUntilResolution}d left` : "Ended"}
              </div>
            </div>
          </div>

          <Button className="w-full relative z-10" size="sm" onClick={handleForecastClick}>
            View Forecast
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
