"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { Startup, Forecast } from "@/lib/mock-data"

interface StartupForecastsProps {
  startup: Startup
  forecasts: Forecast[]
}

export function StartupForecasts({ startup, forecasts }: StartupForecastsProps) {
  if (forecasts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Forecasts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No active forecasts for this startup.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Forecasts</CardTitle>
        <p className="text-sm text-muted-foreground">Community predictions about {startup.name}'s future milestones</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {forecasts.map((forecast) => {
          const isPositiveChange = forecast.change24hPct > 0
          const resolutionDate = new Date(forecast.resolutionDate)
          const daysUntilResolution = Math.ceil((resolutionDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

          return (
            <div key={forecast.id} className="border rounded-lg p-4 transition-all duration-200 hover:shadow-md">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-balance leading-relaxed">{forecast.question}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-auto p-0 text-muted-foreground">
                              <HelpCircle className="h-4 w-4 mr-1" />
                              Resolution Criteria
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <p>{forecast.criteria}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <Badge variant={forecast.status === "active" ? "default" : "secondary"}>{forecast.status}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-3xl font-mono font-bold" style={{ color: "var(--yes-soft)" }}>
                        {forecast.yesPct}%
                      </div>
                      <div className="text-xs text-muted-foreground">YES</div>
                    </div>

                    <div className="text-center">
                      <div className="text-3xl font-mono font-bold" style={{ color: "var(--no-soft)" }}>
                        {forecast.noPct}%
                      </div>
                      <div className="text-xs text-muted-foreground">NO</div>
                    </div>

                    <div className="flex items-center space-x-1">
                      {isPositiveChange ? (
                        <TrendingUp className="h-4 w-4 text-success" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                      <span className={cn("font-mono text-sm", isPositiveChange ? "text-success" : "text-destructive")}>
                        {isPositiveChange ? "+" : ""}
                        {forecast.change24hPct.toFixed(1)}%
                      </span>
                      <span className="text-xs text-muted-foreground">24h</span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="font-mono">{forecast.participation.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {daysUntilResolution > 0 ? `${daysUntilResolution} days left` : "Ended"}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Add to Watchlist
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
