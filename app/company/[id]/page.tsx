"use client"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { mockStartups } from "@/lib/mock-data"
import { Header } from "@/components/header"
import { ForecastModal } from "@/components/forecast-modal"
import { cn } from "@/lib/utils"
import { PredictionDynamicsChart } from "@/components/prediction-dynamics-chart"
import { ChartRouletteGame } from "@/components/chart-roulette-game"

const ArrowLeft = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const Building2 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M13 9v.01M13 12v.01M13 15v.01"
    />
  </svg>
)

const MapPin = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
    />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const Globe = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M13 9v.01M13 12v.01M13 15v.01" />
  </svg>
)

const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-4.5m-4-3a4 4 0 010-7.5"
    />
    <circle cx="9" cy="7" r="4" />
  </svg>
)

const DollarSign = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
)

const TrendingUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const TrendingDown = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
)

const Activity = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
)

const Target = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const Zap = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

const Award = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
)

export default function CompanyPage() {
  const params = useParams()
  const companyId = params.id as string
  const company = mockStartups.find((startup) => startup.id === companyId)

  const [showForecastModal, setShowForecastModal] = useState(false)
  const [forecastType, setForecastType] = useState<"increase" | "decrease" | null>(null)
  const [selectedBet, setSelectedBet] = useState<any>(null)

  const handleBetClick = (bet: any, type: "increase" | "decrease") => {
    setSelectedBet(bet)
    setForecastType(type)
    setShowForecastModal(true)
  }

  const handleCloseForecastModal = () => {
    setShowForecastModal(false)
    setForecastType(null)
    setSelectedBet(null)
  }

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <div className="container max-w-7xl mx-auto px-6 py-8">
            <div className="mb-8">
              <Link
                href="/"
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4 text-foreground">Company Not Found</h1>
              <Link href="/">
                <Button>Return Home</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const recentActivities = [
    {
      type: "funding",
      title: `Raised ${company.funding.lastRound}`,
      description: `${company.name} raised $${(company.funding.rounds[company.funding.rounds.length - 1]?.amount / 1000000).toFixed(1)}M in ${company.funding.lastRound}`,
      date: company.funding.lastRoundDate,
      icon: DollarSign,
    },
    {
      type: "news",
      title: "Featured in TechCrunch",
      description: `${company.name} was featured in a major tech publication discussing their growth trajectory`,
      date: "2 weeks ago",
      icon: Activity,
    },
    {
      type: "milestone",
      title: "Product Launch",
      description: "Successfully launched new product features to enterprise customers",
      date: "1 month ago",
      icon: Target,
    },
  ]

  const investments = [
    {
      company: "DataFlow AI",
      amount: "$2.5M",
      date: "2024",
      type: "Series A",
      description: "AI-powered data analytics platform",
    },
    {
      company: "CloudSync Pro",
      amount: "$1.8M",
      date: "2023",
      type: "Seed",
      description: "Enterprise cloud synchronization tool",
    },
  ]

  const acquisitions = [
    {
      company: "MicroTech Solutions",
      amount: "$15M",
      date: "2023",
      description: "Acquired for technology and talent integration",
    },
  ]

  const events = [
    {
      title: "TechCrunch Disrupt 2024",
      type: "Conference",
      date: "Oct 2024",
      location: "San Francisco, CA",
      description: "Presenting at the main stage",
    },
    {
      title: "Series B Announcement",
      type: "Funding Event",
      date: "Sep 2024",
      location: "Virtual",
      description: "Official announcement of Series B funding round",
    },
    {
      title: "Product Demo Day",
      type: "Product Launch",
      date: "Aug 2024",
      location: "New York, NY",
      description: "Showcasing new enterprise features",
    },
  ]

  const bettingEvents = [
    {
      id: 1,
      title: `Will ${company.name} raise Series B by Q2 2025?`,
      description: "Based on current growth trajectory and market conditions",
      odds: { yes: 72, no: 28 },
      volume: "$45,200",
      deadline: "Mar 31, 2025",
      category: "Funding",
      icon: DollarSign,
      trend: "up",
    },
    {
      id: 2,
      title: `${company.name} valuation to exceed $500M by end of 2025?`,
      description: "Current valuation estimated at $280M post-Series A",
      odds: { yes: 58, no: 42 },
      volume: "$32,800",
      deadline: "Dec 31, 2025",
      category: "Valuation",
      icon: TrendingUp,
      trend: "up",
    },
    {
      id: 3,
      title: `Will ${company.name} go public (IPO) before 2027?`,
      description: "Market conditions and company readiness assessment",
      odds: { yes: 34, no: 66 },
      volume: "$28,500",
      deadline: "Jan 1, 2027",
      category: "IPO",
      icon: Award,
      trend: "down",
    },
    {
      id: 4,
      title: `${company.name} to acquire another company in 2025?`,
      description: "Based on expansion strategy and available capital",
      odds: { yes: 45, no: 55 },
      volume: "$19,300",
      deadline: "Dec 31, 2025",
      category: "M&A",
      icon: Target,
      trend: "stable",
    },
    {
      id: 5,
      title: `Will ${company.name} pivot business model by Q4 2025?`,
      description: "Market pressures and competitive landscape analysis",
      odds: { yes: 23, no: 77 },
      volume: "$15,600",
      deadline: "Oct 1, 2025",
      category: "Strategy",
      icon: Zap,
      trend: "down",
    },
    {
      id: 6,
      title: `${company.name} employee count to double by 2026?`,
      description: `Currently at ${company.employees} employees`,
      odds: { yes: 67, no: 33 },
      volume: "$22,100",
      deadline: "Jan 1, 2026",
      category: "Growth",
      icon: Users,
      trend: "up",
    },
  ]

  return (
    <>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1">
          <div className="bg-card border-b">
            <div className="container max-w-7xl mx-auto px-6 py-6">
              <div className="mb-6">
                <Link
                  href="/"
                  className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="w-20 h-20 lg:w-20 lg:h-20 rounded-lg bg-white border border-border flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
                  <img
                    src={company.logoUrl || "/placeholder.svg?height=80&width=80&query=company logo"}
                    alt={company.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-balance">{company.name}</h1>
                  </div>
                  <p className="text-muted-foreground text-base sm:text-lg mb-4 leading-relaxed text-pretty">
                    {company.description}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-4 py-4 border-t border-b border-border">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-muted-foreground font-medium text-sm sm:text-base">Growth Score</span>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                      <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-xl sm:text-2xl font-bold text-foreground">98</span>
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">7 pts</span>
                      </div>
                      <span className="text-sm text-muted-foreground">in past quarter</span>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-muted-foreground font-medium text-sm sm:text-base">Heat Score</span>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                      <div className="w-6 h-6 rounded-full border-2 border-pink-500 flex items-center justify-center">
                        <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                      </div>
                      <span className="text-xl sm:text-2xl font-bold text-foreground">96</span>
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">9 pts</span>
                      </div>
                      <span className="text-sm text-muted-foreground">in past quarter</span>
                    </div>
                  </div>

                  <div className="mb-6 flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <PredictionDynamicsChart companyName={company.name} />
                    </div>
                    <div className="flex-1">
                      <ChartRouletteGame />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{company.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      {company.employees} employees
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 flex-shrink-0" />
                      {company.funding.lastRound}
                    </div>
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4 flex-shrink-0" />
                      Private
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4 flex-shrink-0" />
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary truncate"
                      >
                        {company.website?.replace("https://", "").replace("http://", "")}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="flex-1 space-y-6 sm:space-y-8">
                <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">Overview</h2>
                  </div>

                  <div className="space-y-6 sm:space-y-8">
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">About</h2>
                      <p className="text-muted-foreground leading-relaxed mb-4 text-pretty">{company.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <h3 className="font-medium text-foreground mb-2">Industries</h3>
                          <div className="space-y-1">
                            {company.sector.map((sector, index) => (
                              <div key={index} className="text-muted-foreground text-sm sm:text-base">
                                {sector}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground mb-2">Headquarters Regions</h3>
                          <div className="text-muted-foreground text-sm sm:text-base">{company.location}</div>
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground mb-2">Founded Date</h3>
                          <div className="text-muted-foreground text-sm sm:text-base">{company.foundedYear}</div>
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground mb-2">Operating Status</h3>
                          <div className="text-muted-foreground text-sm sm:text-base">Active</div>
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground mb-2">Last Funding Type</h3>
                          <div className="text-muted-foreground text-sm sm:text-base">{company.funding.lastRound}</div>
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground mb-2">Company Type</h3>
                          <div className="text-muted-foreground text-sm sm:text-base">For Profit</div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">Funding</h2>
                      <div className="space-y-3 sm:space-y-4">
                        {company.funding.rounds.map((round, index) => (
                          <div
                            key={index}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-muted/50 rounded-lg gap-2 sm:gap-4"
                          >
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                                <span className="font-medium text-foreground">{round.round}</span>
                                <span className="text-sm text-muted-foreground">{round.date}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Led by {round.leadInvestors.join(", ")}
                              </div>
                            </div>
                            <div className="text-left sm:text-right">
                              <div className="font-bold text-green-600 text-lg">
                                ${(round.amount / 1000000).toFixed(1)}M
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">Investments</h2>
                      <div className="space-y-3 sm:space-y-4">
                        {investments.map((investment, index) => (
                          <div
                            key={index}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-muted/50 rounded-lg gap-2 sm:gap-4"
                          >
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                                <span className="font-medium text-foreground">{investment.company}</span>
                                <span className="text-xs sm:text-sm bg-muted-foreground text-foreground px-2 py-1 rounded w-fit">
                                  {investment.type}
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground mb-1">{investment.description}</div>
                              <div className="text-sm text-muted-foreground">{investment.date}</div>
                            </div>
                            <div className="text-left sm:text-right">
                              <div className="font-bold text-blue-600">{investment.amount}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">Acquisitions</h2>
                      <div className="space-y-3 sm:space-y-4">
                        {acquisitions.map((acquisition, index) => (
                          <div
                            key={index}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-muted/50 rounded-lg gap-2 sm:gap-4"
                          >
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                                <span className="font-medium text-foreground">{acquisition.company}</span>
                                <span className="text-sm text-muted-foreground">{acquisition.date}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">{acquisition.description}</div>
                            </div>
                            <div className="text-left sm:text-right">
                              <div className="font-bold text-purple-600">{acquisition.amount}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">Events</h2>
                      <div className="space-y-3 sm:space-y-4">
                        {events.map((event, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/50 rounded-lg"
                          >
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                <span
                                  className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-medium w-fit ${
                                    event.type === "Funding"
                                      ? "bg-green-50 text-green-700"
                                      : event.type === "Valuation"
                                        ? "bg-blue-50 text-blue-700"
                                        : event.type === "IPO"
                                          ? "bg-purple-50 text-purple-700"
                                          : event.type === "M&A"
                                            ? "bg-orange-50 text-orange-700"
                                            : event.type === "Strategy"
                                              ? "bg-yellow-50 text-yellow-700"
                                              : "bg-background text-foreground"
                                  }`}
                                >
                                  {event.type}
                                </span>
                                <div
                                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                    event.type === "Funding"
                                      ? "bg-green-500"
                                      : event.type === "Valuation"
                                        ? "bg-blue-500"
                                        : event.type === "IPO"
                                          ? "bg-purple-500"
                                          : event.type === "M&A"
                                            ? "bg-orange-500"
                                            : event.type === "Strategy"
                                              ? "bg-yellow-500"
                                              : "bg-muted-foreground"
                                  }`}
                                />
                              </div>
                              <h3 className="font-semibold text-foreground text-sm sm:text-base leading-tight mb-2 sm:mb-3 text-balance">
                                {event.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed text-pretty">
                                {event.description}
                              </p>
                              <div className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 flex items-center gap-1">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-96 space-y-6">
                <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6">
                    Active Prediction Markets
                  </h3>
                  <div className="space-y-4 sm:space-y-6">
                    {bettingEvents.map((bet) => {
                      const forPercentage = bet.odds.yes
                      const againstPercentage = bet.odds.no
                      return (
                        <div
                          key={bet.id}
                          className="border border-border rounded-xl p-4 sm:p-5 hover:shadow-md transition-all duration-200 bg-background/50"
                        >
                          <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <div
                              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                bet.category === "Funding"
                                  ? "bg-green-100"
                                  : bet.category === "Valuation"
                                    ? "bg-blue-100"
                                    : bet.category === "IPO"
                                      ? "bg-purple-100"
                                      : bet.category === "M&A"
                                        ? "bg-orange-100"
                                        : bet.category === "Strategy"
                                          ? "bg-yellow-100"
                                          : "bg-background"
                              }`}
                            >
                              <bet.icon
                                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                  bet.category === "Funding"
                                    ? "text-green-600"
                                    : bet.category === "Valuation"
                                      ? "text-blue-600"
                                      : bet.category === "IPO"
                                        ? "text-purple-600"
                                        : bet.category === "M&A"
                                          ? "text-orange-600"
                                          : bet.category === "Strategy"
                                            ? "text-yellow-600"
                                            : "text-muted-foreground"
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                                <span
                                  className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-medium w-fit ${
                                    bet.category === "Funding"
                                      ? "bg-green-50 text-green-700"
                                      : bet.category === "Valuation"
                                        ? "bg-blue-50 text-blue-700"
                                        : bet.category === "IPO"
                                          ? "bg-purple-50 text-purple-700"
                                          : bet.category === "M&A"
                                            ? "bg-orange-50 text-orange-700"
                                            : bet.category === "Strategy"
                                              ? "bg-yellow-50 text-yellow-700"
                                              : "bg-background text-foreground"
                                  }`}
                                >
                                  {bet.category}
                                </span>
                                <div
                                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                    bet.trend === "up"
                                      ? "bg-green-500"
                                      : bet.trend === "down"
                                        ? "bg-red-500"
                                        : "bg-muted-foreground"
                                  }`}
                                />
                              </div>
                              <h4 className="font-semibold text-foreground text-sm sm:text-base leading-tight mb-2 sm:mb-3 text-balance">
                                {bet.title}
                              </h4>
                              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed text-pretty">
                                {bet.description}
                              </p>

                              <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <div className="flex gap-3 sm:gap-4">
                                  <div className="text-xs sm:text-sm">
                                    <span className="font-bold" style={{ color: "var(--yes-soft)" }}>
                                      {bet.odds.yes}%
                                    </span>
                                  </div>
                                  <div className="text-xs sm:text-sm">
                                    <span className="font-bold" style={{ color: "var(--no-soft)" }}>
                                      {bet.odds.no}%
                                    </span>
                                  </div>
                                </div>
                                <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                                  Vol: {bet.volume}
                                </div>
                              </div>

                              <div className="w-full bg-muted-foreground rounded-full h-2 mb-2 sm:mb-3">
                                <div
                                  className="h-full transition-all duration-300"
                                  style={{
                                    width: `${forPercentage}%`,
                                    backgroundColor: "var(--yes-soft)",
                                  }}
                                />
                                <div
                                  className="h-full transition-all duration-300"
                                  style={{
                                    width: `${againstPercentage}%`,
                                    backgroundColor: "var(--no-soft)",
                                  }}
                                />
                              </div>

                              <div className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                                Ends: {bet.deadline}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 sm:gap-3">
                            <Button
                              onClick={() => handleBetClick(bet, "increase")}
                              size="sm"
                              className={cn(
                                "flex-1 rounded-xl py-2 sm:py-2.5 font-medium text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2",
                                "bg-success/10 hover:bg-success/20 text-success border border-success/20 hover:border-success/30",
                              )}
                            >
                              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                            <Button
                              onClick={() => handleBetClick(bet, "decrease")}
                              size="sm"
                              className={cn(
                                "flex-1 rounded-xl py-2 sm:py-2.5 font-medium text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2",
                                "bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 hover:border-destructive/30",
                              )}
                            >
                              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <Button
                    variant="link"
                    className="text-primary p-0 h-auto mt-4 sm:mt-6 w-full font-medium text-sm sm:text-base"
                    asChild
                  >
                    <Link href="/">View All Markets</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {selectedBet && (
        <ForecastModal
          isOpen={showForecastModal}
          onClose={handleCloseForecastModal}
          startup={company}
          forecastType={forecastType}
        />
      )}
    </>
  )
}
