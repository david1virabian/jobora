"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InvestmentCard } from "@/components/investment-card"
import type { Investment, Startup } from "@/lib/mock-data"

interface InvestmentCarouselProps {
  title: string
  investments: Investment[]
  startups: Startup[]
  onWatchlistToggle: (investmentId: string) => void
  watchlistedInvestments: Set<string>
  onInvestmentClick: (investment: Investment, startup: Startup) => void
}

export function InvestmentCarousel({
  title,
  investments,
  startups,
  onWatchlistToggle,
  watchlistedInvestments,
  onInvestmentClick,
}: InvestmentCarouselProps) {
  if (investments.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex space-x-6 overflow-x-auto pb-4">
        {investments.slice(0, 8).map((investment) => {
          const startup = startups.find((s) => s.id === investment.startupId)!
          return (
            <div key={investment.id} className="flex-none w-80">
              <InvestmentCard
                investment={investment}
                startup={startup}
                onWatchlistToggle={onWatchlistToggle}
                isWatchlisted={watchlistedInvestments.has(investment.id)}
                onInvestmentClick={onInvestmentClick}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
