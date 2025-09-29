"use client"

import { Eye, TrendingUp, Clock, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function WatchlistSidebar() {
  const watchlistStats = {
    watchlistItems: 12,
    newRecommendations: 3,
  }

  const recommendations = [
    { name: "QuantumAI", sector: "AI", risk: "Medium", expectedReturn: "8-12x" },
    { name: "BioTech Labs", sector: "Healthcare", risk: "High", expectedReturn: "15-20x" },
    { name: "CleanEnergy Co", sector: "Energy", risk: "Low", expectedReturn: "3-5x" },
  ]

  return (
    <div className="space-y-4">
      {/* Watchlist Summary */}
      <Card className="bg-gradient-to-br from-muted/50 to-muted border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Eye className="h-5 w-5 text-muted-foreground" />
            My Watchlist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-mono font-bold text-foreground">{watchlistStats.watchlistItems}</div>
              <p className="text-sm text-muted-foreground">Opportunities tracked</p>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {watchlistStats.newRecommendations} New
            </Badge>
          </div>
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            View All Watchlist
          </Button>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="bg-gradient-to-br from-warning/10 to-warning/20 border-warning/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Star className="h-5 w-5 text-warning" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.map((rec, index) => (
            <div key={index} className="p-3 bg-background rounded-lg border border-warning/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-foreground">{rec.name}</h4>
                <Badge variant="outline" className="text-xs">
                  {rec.expectedReturn}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{rec.sector}</span>
                <span>•</span>
                <span
                  className={
                    rec.risk === "High" ? "text-destructive" : rec.risk === "Medium" ? "text-warning" : "text-success"
                  }
                >
                  {rec.risk} Risk
                </span>
              </div>
            </div>
          ))}
          <Button size="sm" className="w-full bg-warning hover:bg-warning/90 text-warning-foreground">
            Get More Recommendations
          </Button>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Market Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">New Opportunities</span>
            <span className="font-medium text-foreground">24 today</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Closing Soon</span>
            <span className="font-medium text-destructive flex items-center gap-1">
              <Clock className="h-3 w-3" />5 this week
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Hot Sectors</span>
            <span className="font-medium text-foreground">AI, Healthcare</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
