import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ForecastCard } from "./forecast-card"
import type { Forecast, Startup } from "@/lib/mock-data"

interface ForecastCarouselProps {
  title: string
  forecasts: Forecast[]
  startups: Startup[]
  onWatchlistToggle?: (forecastId: string) => void
  watchlistedForecasts?: Set<string>
  onForecastClick?: (forecast: Forecast, startup: Startup) => void
}

export function ForecastCarousel({
  title,
  forecasts,
  startups,
  onWatchlistToggle,
  watchlistedForecasts = new Set(),
  onForecastClick,
}: ForecastCarouselProps) {
  const getStartupById = (id: string) => startups.find((s) => s.id === id)!

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {forecasts.slice(0, 4).map((forecast) => {
          const startup = getStartupById(forecast.startupId)
          return (
            <ForecastCard
              key={forecast.id}
              forecast={forecast}
              startup={startup}
              onWatchlistToggle={onWatchlistToggle}
              isWatchlisted={watchlistedForecasts.has(forecast.id)}
              onForecastClick={onForecastClick}
            />
          )
        })}
      </div>
    </div>
  )
}
