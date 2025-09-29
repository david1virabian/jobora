"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockStartups } from "@/lib/mock-data"
import { StartupCard } from "@/components/startup-card"
import { Header } from "@/components/header"
import { ForecastTicker } from "@/components/forecast-ticker"
import { Footer } from "@/components/footer"
import { GamblingChart } from "@/components/gambling-chart"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"explore" | "trending" | "new">("explore")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredStartups = useMemo(() => {
    let startups = [...mockStartups]

    if (activeTab === "trending") {
      startups = startups.sort((a, b) => b.funding.totalRaisedUSD - a.funding.totalRaisedUSD)
    } else if (activeTab === "new") {
      startups = startups.sort((a, b) => b.foundedYear - a.foundedYear)
    }

    return startups.filter((startup) => {
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase()
        const matchesSearch =
          startup.name.toLowerCase().includes(searchLower) ||
          startup.oneLiner.toLowerCase().includes(searchLower) ||
          startup.description.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }
      return true
    })
  }, [searchQuery, activeTab])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <ForecastTicker />

      <main className="flex-1">
        <div className="container max-w-7xl mx-auto px-6 py-8">
          {/* Removed demo mode warning banner */}

          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-primary rounded-full p-2 shadow-sm">
                <svg className="h-8 w-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h1 className="text-5xl font-bold text-foreground text-balance">Predictr</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty mb-8">
              A Startup-Centric Prediction Market. Use Predictr to discover and predict the next unicorns.
            </p>

            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-card border border-border rounded-2xl p-1 shadow-sm">
                <Button
                  variant={activeTab === "explore" ? "default" : "ghost"}
                  className={`px-3 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all text-sm sm:text-base ${
                    activeTab === "explore"
                      ? "bg-foreground text-background shadow-sm"
                      : "text-card-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setActiveTab("explore")}
                >
                  Explore Startups
                </Button>
                <Button
                  variant={activeTab === "trending" ? "default" : "ghost"}
                  className={`px-3 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all text-sm sm:text-base ${
                    activeTab === "trending"
                      ? "bg-foreground text-background shadow-sm"
                      : "text-card-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setActiveTab("trending")}
                >
                  Trending
                </Button>
                <Button
                  variant={activeTab === "new" ? "default" : "ghost"}
                  className={`px-3 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all text-sm sm:text-base ${
                    activeTab === "new"
                      ? "bg-foreground text-background shadow-sm"
                      : "text-card-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setActiveTab("new")}
                >
                  Last Call
                </Button>
              </div>
            </div>

            <div className="max-w-4xl mx-auto mb-12">
              <Input
                type="text"
                placeholder={`Search among ${mockStartups.length} startups`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-16 px-6 text-lg bg-input border border-border rounded-2xl focus:border-primary focus:ring-2 focus:ring-ring transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Market Predictions</h2>
              <p className="text-muted-foreground">Test your prediction skills with market forecasts</p>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
                <GamblingChart />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {filteredStartups.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredStartups.map((startup) => (
                  <StartupCard key={startup.id} startup={startup} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No startups match your current search. Try adjusting your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
