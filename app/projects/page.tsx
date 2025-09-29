"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FilterBar, type FilterState } from "@/components/filter-bar"
import { InvestmentCard } from "@/components/investment-card"
import { mockStartups, mockForecasts as mockInvestments } from "@/lib/mock-data"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { PredictionDynamicsChart } from "@/components/prediction-dynamics-chart"

export default function ProjectsPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    sector: [],
    stage: [],
    region: [],
    timeframe: "All time",
    activity: "Most active",
  })

  const [watchlistedInvestments, setWatchlistedInvestments] = useState<Set<string>>(new Set())

  const handleWatchlistToggle = (investmentId: string) => {
    const newWatchlist = new Set(watchlistedInvestments)
    if (newWatchlist.has(investmentId)) {
      newWatchlist.delete(investmentId)
    } else {
      newWatchlist.add(investmentId)
    }
    setWatchlistedInvestments(newWatchlist)
  }

  const filteredInvestments = useMemo(() => {
    return mockInvestments.filter((investment) => {
      const startup = mockStartups.find((s) => s.id === investment.startupId)!

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          startup.name.toLowerCase().includes(searchLower) ||
          startup.oneLiner.toLowerCase().includes(searchLower) ||
          investment.title.toLowerCase().includes(searchLower) ||
          investment.description.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Sector filter
      if (filters.sector.length > 0) {
        const hasMatchingSector = filters.sector.some((sector) => startup.sector.includes(sector))
        if (!hasMatchingSector) return false
      }

      // Stage filter
      if (filters.stage.length > 0) {
        if (!filters.stage.includes(startup.stage)) return false
      }

      // Region filter
      if (filters.region.length > 0) {
        if (!filters.region.includes(startup.location)) return false
      }

      return true
    })
  }, [filters])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="space-y-8">
            {/* Header Section */}
            <div className="flex items-center gap-4 mb-8">
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </div>

            <div className="text-center py-6">
              {/* Changed pink gradient to blue gradient */}
              <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 bg-clip-text text-transparent">
                <h1 className="text-4xl font-bold tracking-tight mb-4 text-balance">Find your fortune</h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">Forecast Projects Directory</p>
            </div>

            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">Market Analysis</h2>
                <p className="text-muted-foreground">Track market confidence trends and dynamics</p>
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-4xl">
                  <PredictionDynamicsChart />
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <FilterBar filters={filters} onFiltersChange={setFilters} />

            {/* Investment Projects Grid */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold">
                  All Forecast Projects
                  <span className="text-muted-foreground text-lg ml-2">({filteredInvestments.length})</span>
                </h2>
              </div>

              {filteredInvestments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredInvestments.map((investment) => {
                    const startup = mockStartups.find((s) => s.id === investment.startupId)!
                    return (
                      <InvestmentCard
                        key={investment.id}
                        investment={investment}
                        startup={startup}
                        onWatchlistToggle={handleWatchlistToggle}
                        isWatchlisted={watchlistedInvestments.has(investment.id)}
                      />
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No forecast projects match your current filters. Try adjusting your search criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
