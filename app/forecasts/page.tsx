"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Calendar, DollarSign, Target, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { BalanceBlock } from "@/components/balance-block"

interface Forecast {
  id: string
  startup: {
    name: string
    logo: string
    currentPrediction: number
  }
  type: "increase" | "decrease"
  amount: number
  predictedValue: number
  currentValue: number
  date: string
  status: "active" | "won" | "lost"
  profit?: number
}

// Mock data for demonstration
const mockForecasts: Forecast[] = [
  {
    id: "1",
    startup: { name: "NovaGraph", logo: "/modern-data-analytics-graph-logo-blue.jpg", currentPrediction: 50 },
    type: "increase",
    amount: 100,
    predictedValue: 65,
    currentValue: 50,
    date: "2024-01-15",
    status: "active",
  },
  {
    id: "2",
    startup: { name: "PayFlow", logo: "/modern-fintech-payment-flow-logo-green.jpg", currentPrediction: 65 },
    type: "decrease",
    amount: 50,
    predictedValue: 50,
    currentValue: 65,
    date: "2024-01-10",
    status: "active",
  },
  {
    id: "3",
    startup: {
      name: "GreenTech Solutions",
      logo: "/green-technology-leaf-circuit-logo-sustainable.jpg",
      currentPrediction: 50,
    },
    type: "increase",
    amount: 200,
    predictedValue: 70,
    currentValue: 75,
    date: "2024-01-05",
    status: "won",
    profit: 150,
  },
]

export default function ForecastsPage() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredForecasts = mockForecasts.filter((forecast) => {
    if (activeTab === "all") return true
    return forecast.status === activeTab
  })

  const totalInvested = mockForecasts.reduce((sum, f) => sum + f.amount, 0)
  const totalProfit = mockForecasts.reduce((sum, f) => sum + (f.profit || 0), 0)
  const activeForecasts = mockForecasts.filter((f) => f.status === "active").length

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <Button
            asChild
            variant="ghost"
            className="text-muted-foreground hover:text-foreground hover:bg-muted font-semibold transition-all"
          >
            <a href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Back to Dashboard</span>
            </a>
          </Button>
        </div>

        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2">Account Balance</h1>
            <p className="text-sm sm:text-lg text-muted-foreground px-4">
              Manage your funds and track your forecasting performance
            </p>
          </div>
          <BalanceBlock />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="p-2 rounded-lg bg-primary/10 w-fit">
                  <Target className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Active Forecasts
                  </p>
                  <p className="text-xl sm:text-3xl font-bold text-foreground">{activeForecasts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="p-2 rounded-lg bg-primary/10 w-fit">
                  <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Total Invested
                  </p>
                  <p className="text-xl sm:text-3xl font-bold text-foreground">${totalInvested}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="p-2 rounded-lg bg-green-500/10 w-fit">
                  <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Total Profit
                  </p>
                  <p className="text-xl sm:text-3xl font-bold text-green-500">${totalProfit}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="p-2 rounded-lg bg-primary/10 w-fit">
                  <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Win Rate
                  </p>
                  <p className="text-xl sm:text-3xl font-bold text-foreground">33%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="border-b border-border p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
              <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              My Forecasts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="overflow-x-auto mb-6">
                <TabsList className="bg-muted border-border rounded-2xl p-1 shadow-sm w-full min-w-fit">
                  <TabsTrigger
                    value="all"
                    className="px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all text-xs sm:text-sm data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-muted/50"
                  >
                    All Forecasts
                  </TabsTrigger>
                  <TabsTrigger
                    value="active"
                    className="px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all text-xs sm:text-sm data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-muted/50"
                  >
                    Active
                  </TabsTrigger>
                  <TabsTrigger
                    value="won"
                    className="px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all text-xs sm:text-sm data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-muted/50"
                  >
                    Won
                  </TabsTrigger>
                  <TabsTrigger
                    value="lost"
                    className="px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all text-xs sm:text-sm data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-muted/50"
                  >
                    Lost
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab}>
                <div className="space-y-3 sm:space-y-4">
                  {filteredForecasts.map((forecast) => (
                    <Card
                      key={forecast.id}
                      className="bg-card border-border hover:border-border/80 hover:shadow-md transition-all duration-200"
                    >
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="relative">
                              <img
                                src={forecast.startup.logo || "/placeholder.svg"}
                                alt={forecast.startup.name}
                                className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl border border-border shadow-sm"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-base sm:text-lg text-foreground">
                                {forecast.startup.name}
                              </h3>
                              <div className="flex items-center space-x-2 mt-1">
                                {forecast.type === "increase" ? (
                                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
                                )}
                                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                                  Predicted {forecast.type} to {forecast.predictedValue}%
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:space-x-8 sm:gap-0">
                            <div className="text-left sm:text-right">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Amount
                              </p>
                              <p className="text-lg sm:text-xl font-bold text-foreground">${forecast.amount}</p>
                            </div>

                            <div className="text-left sm:text-right">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Current
                              </p>
                              <p className="text-lg sm:text-xl font-bold text-foreground">{forecast.currentValue}%</p>
                            </div>

                            <div className="text-left sm:text-right">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Status
                              </p>
                              <Badge
                                variant={
                                  forecast.status === "won"
                                    ? "default"
                                    : forecast.status === "lost"
                                      ? "destructive"
                                      : "secondary"
                                }
                                className="font-medium text-xs sm:text-sm px-2 sm:px-3 py-1 w-fit"
                              >
                                {forecast.status.toUpperCase()}
                              </Badge>
                            </div>

                            {forecast.profit && (
                              <div className="text-left sm:text-right">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Profit
                                </p>
                                <p className="text-lg sm:text-xl font-bold text-green-500">+${forecast.profit}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredForecasts.length === 0 && (
                    <div className="text-center py-12 sm:py-16">
                      <Target className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4 sm:mb-6" />
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">No forecasts found</h3>
                      <p className="text-sm sm:text-lg text-muted-foreground mb-4 sm:mb-6 px-4">
                        {activeTab === "all"
                          ? "You haven't made any forecasts yet."
                          : `No ${activeTab} forecasts found.`}
                      </p>
                      <Button
                        asChild
                        size="lg"
                        className="bg-foreground hover:bg-foreground/90 text-background font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <a href="/">Start Forecasting</a>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
