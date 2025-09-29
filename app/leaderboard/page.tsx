"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LeaderboardFilters } from "@/components/leaderboard-filters"
import { LeaderboardTable } from "@/components/leaderboard-table"
import { PlayerBettingSidebar } from "@/components/player-betting-sidebar"

export default function LeaderboardPage() {
  const [category, setCategory] = useState("participation")
  const [timeFilter, setTimeFilter] = useState("all-time")

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container px-4 py-6">
          <div className="flex gap-8">
            <div className="flex-1 space-y-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
                <p className="text-muted-foreground mt-2">
                  Top contributors by forecast accuracy, participation, and activity
                </p>
              </div>

              <LeaderboardFilters onCategoryChange={setCategory} onTimeFilterChange={setTimeFilter} />
              <LeaderboardTable category={category} />
            </div>

            <div className="hidden lg:block">
              <PlayerBettingSidebar category={category} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
