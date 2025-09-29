"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Users, Clock, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Investment, Startup } from "@/lib/mock-data"

interface InvestmentCardProps {
  investment: Investment
  startup: Startup
  onWatchlistToggle: (investmentId: string) => void
  isWatchlisted: boolean
}

export function InvestmentCard({ investment, startup, onWatchlistToggle, isWatchlisted }: InvestmentCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const progressPercentage = (investment.raisedAmount / investment.targetAmount) * 100

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount.toLocaleString()}`
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-primary/10 text-primary border-primary/20"
      case "Medium":
        return "bg-warning/10 text-warning border-warning/20"
      case "High":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg bg-card",
        isHovered && "shadow-lg scale-[1.01]",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/company/${startup.id}`}
            className="flex items-center space-x-3 min-w-0 flex-1 hover:opacity-80 transition-opacity"
          >
            <img
              src={startup.logoUrl || "/placeholder.svg"}
              alt={startup.name}
              className="w-12 h-12 rounded-xl object-cover ring-1 ring-border flex-shrink-0 bg-white"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-base leading-tight truncate text-card-foreground">{startup.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{investment.title}</p>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-primary/10 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation()
              onWatchlistToggle(investment.id)
            }}
          >
            <Heart className={cn("h-4 w-4", isWatchlisted && "fill-primary text-primary")} />
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          {startup.sector.slice(0, 2).map((sector) => (
            <Badge key={sector} variant="secondary" className="text-xs px-2 py-1 whitespace-nowrap">
              {sector}
            </Badge>
          ))}
          <Badge className={cn("text-xs px-2 py-1 whitespace-nowrap", getRiskColor(investment.riskLevel))}>
            {investment.riskLevel} Risk
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{investment.description}</p>

        <div className="text-center py-4 bg-primary/5 rounded-xl border border-primary/10">
          <div className="text-xs text-muted-foreground mb-1 font-medium">Expected Return</div>
          <div className="text-2xl font-bold text-primary font-mono leading-none flex items-center justify-center gap-1">
            <TrendingUp className="w-5 h-5" />
            {investment.expectedReturn}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-card-foreground">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="truncate font-medium">{formatCurrency(investment.raisedAmount)} pooled</span>
            <span className="truncate">{formatCurrency(investment.targetAmount)} target</span>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 py-2">
          <Clock className="h-4 w-4 text-warning flex-shrink-0" />
          <div className="text-center">
            <p className="text-xs text-muted-foreground leading-tight">Days Left</p>
            <p className="font-bold text-warning text-sm leading-tight">{investment.daysLeft}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            {/* Changed from investors to participants */}
            <span className="whitespace-nowrap font-medium">{investment.investorCount} participants</span>
          </div>
          <div className="text-xs text-muted-foreground whitespace-nowrap font-medium">
            Min: {formatCurrency(investment.minInvestment)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
