"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface UserBet {
  id: string
  userId: string
  username: string
  amount: string
  prediction: string
  company: string
  companyId?: string // Added optional companyId for proper navigation
  type: "growth" | "funding" | "valuation" | "heat"
  direction: "rise" | "fall"
  timestamp: Date
}

interface PlatformStat {
  id: string
  text: string
  value: string
  icon: string
}

const platformStats: PlatformStat[] = [
  { id: "active-forecasts", text: "Active Forecasts", value: "2,847", icon: "📊" },
  { id: "total-volume", text: "Total Volume", value: "$12.4M", icon: "💰" },
  { id: "total-users", text: "Active Users", value: "45,231", icon: "👥" },
]

function generateForecastBets(): UserBet[] {
  const usernames = [
    "Alex_Trader",
    "Sarah_AI",
    "Mike_VC",
    "Emma_Tech",
    "David_Crypto",
    "Lisa_Growth",
    "Tom_Investor",
    "Anna_Startup",
  ]
  const amounts = ["$50K", "$100K", "$250K", "$500K", "$1M", "$2.5M", "$5M"]

  // Use real forecasts from mock data
  const realForecasts = [
    { question: "Anthropic raise Series B by Q2 2025", company: "Anthropic", id: "su_ai_anthropic" },
    { question: "Anthropic valuation to exceed $500M by end of 2025", company: "Anthropic", id: "su_ai_anthropic" },
    { question: "OpenAI to go public by 2026", company: "OpenAI", id: "su_ai_openai" },
    { question: "Character AI valuation to reach $10B by Q4 2025", company: "Character AI", id: "su_ai_character" },
    { question: "Scale AI to achieve $1B ARR by 2026", company: "Scale AI", id: "su_ai_scale" },
    {
      question: "Perplexity AI acquisition by major tech company in 2025",
      company: "Perplexity AI",
      id: "su_ai_perplexity",
    },
    { question: "Runway consumer video editing app by Q3 2025", company: "Runway", id: "su_ai_runway" },
    {
      question: "Mistral AI to become Europe's most valuable AI startup by 2026",
      company: "Mistral AI",
      id: "su_ai_mistral",
    },
  ]

  const directions: UserBet["direction"][] = ["rise", "fall"]

  return Array.from({ length: 12 }, (_, i) => {
    const forecast = realForecasts[i % realForecasts.length]
    const direction = directions[Math.floor(Math.random() * directions.length)]

    return {
      id: `bet-${i}`,
      userId: `user-${i}`,
      username: usernames[Math.floor(Math.random() * usernames.length)],
      amount: amounts[Math.floor(Math.random() * amounts.length)],
      prediction: forecast.question,
      company: forecast.company,
      companyId: forecast.id,
      type: "growth" as const,
      direction,
      timestamp: new Date(Date.now() - Math.random() * 3600000),
    }
  })
}

export function ForecastTicker() {
  const router = useRouter()
  const [currentBets, setCurrentBets] = useState<UserBet[]>([])
  const [currentStats, setCurrentStats] = useState(platformStats)

  useEffect(() => {
    const bets = generateForecastBets()
    setCurrentBets(bets)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const refreshedBets = generateForecastBets()
      setCurrentBets(refreshedBets)

      setCurrentStats((prev) =>
        prev.map((stat) => ({
          ...stat,
          value:
            stat.id === "active-forecasts"
              ? `${(2800 + Math.floor(Math.random() * 100)).toLocaleString()}`
              : stat.id === "total-volume"
                ? `$${(12.0 + Math.random() * 1).toFixed(1)}M`
                : `${(45000 + Math.floor(Math.random() * 500)).toLocaleString()}`,
        })),
      )
    }, 45000)

    return () => clearInterval(interval)
  }, [])

  const mixedContent = []
  const betsPerStat = Math.ceil(currentBets.length / currentStats.length)

  for (let i = 0; i < currentStats.length; i++) {
    // Add bets
    const startIdx = i * betsPerStat
    const endIdx = Math.min(startIdx + betsPerStat, currentBets.length)
    mixedContent.push(...currentBets.slice(startIdx, endIdx))

    // Add platform stat
    mixedContent.push(currentStats[i])
  }

  // Add any remaining bets
  if (currentBets.length > currentStats.length * betsPerStat) {
    mixedContent.push(...currentBets.slice(currentStats.length * betsPerStat))
  }

  const tickerContent = [...mixedContent, ...mixedContent, ...mixedContent]

  const handleBetClick = (bet: UserBet) => {
    console.log("[v0] Forecast bet clicked:", bet.prediction)
    if (bet.companyId) {
      router.push(`/company/${bet.companyId}`)
    } else {
      // Fallback for legacy data
      const companySlug = bet.company.toLowerCase().replace(/\s+/g, "-")
      router.push(`/company/${companySlug}`)
    }
  }

  return (
    <div className="sticky top-16 z-40 bg-primary/5 border-y border-border overflow-hidden backdrop-blur-sm bg-background/95">
      <div className="relative h-12 flex items-center">
        <div className="absolute left-0 z-10 bg-gradient-to-r from-background via-background/80 to-transparent w-24 h-full flex items-center pl-4">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wide">💰 Live Bets</span>
        </div>

        <div className="absolute right-0 z-10 bg-gradient-to-l from-background via-background/80 to-transparent w-16 h-full"></div>

        <div className="flex animate-ticker-scroll">
          {tickerContent.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center gap-3 px-8 whitespace-nowrap">
              {"username" in item ? (
                <div
                  className="flex items-center gap-3 cursor-pointer hover:bg-primary/10 rounded-lg px-2 py-1 -mx-2 transition-colors duration-200"
                  onClick={() => handleBetClick(item)}
                >
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${item.direction === "rise" ? "bg-green-500" : "bg-blue-500"}`}
                  />
                  <span className="text-sm text-foreground font-medium">
                    {item.username} placed {item.amount} on {item.prediction}
                  </span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full flex-shrink-0">
                    Join Bet
                  </span>
                  <div
                    className={`text-xs flex-shrink-0 px-1 py-0.5 rounded ${
                      item.direction === "rise"
                        ? "text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-900/30"
                        : "text-blue-800 bg-blue-100 dark:text-blue-200 dark:bg-blue-900/30"
                    }`}
                  >
                    {item.direction === "rise" ? "↗" : "↘"}
                  </div>
                </div>
              ) : (
                // Platform stat item (non-clickable)
                <>
                  <span className="text-sm flex-shrink-0">{item.icon}</span>
                  <span className="text-sm text-foreground font-medium">{item.text}:</span>
                  <span className="text-sm text-primary font-bold flex-shrink-0">{item.value}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
