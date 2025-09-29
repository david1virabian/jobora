"use client"

import { TrendingUp, DollarSign, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

export function MyAssetsOverview() {
  const stats = {
    totalInvested: 25000,
    totalValue: 32500,
    totalReturn: 7500,
    activeInvestments: 5,
    watchlistItems: 12,
    portfolioReturn: 30.0,
    rank: 247,
  }

  const portfolioData = [
    { month: "Jan", value: 25000 },
    { month: "Feb", value: 26200 },
    { month: "Mar", value: 24800 },
    { month: "Apr", value: 27500 },
    { month: "May", value: 29100 },
    { month: "Jun", value: 30800 },
    { month: "Jul", value: 32500 },
  ]

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount.toLocaleString()}`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
      {/* Priority 1: Portfolio Value - Largest card (spans 2 columns on larger screens) */}
      <Card className="md:col-span-2 lg:col-span-2 bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-lg font-semibold text-card-foreground">Portfolio Value</CardTitle>
          <TrendingUp className="h-6 w-6 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-mono font-bold text-primary mb-2">{formatCurrency(stats.totalValue)}</div>
          <p className="text-sm text-success font-medium mb-4">+{formatCurrency(stats.totalReturn)} total return</p>

          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={portfolioData}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis hide />
                <Tooltip
                  formatter={(value) => [formatCurrency(value as number), "Portfolio Value"]}
                  labelStyle={{ color: "hsl(var(--card-foreground))" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "hsl(var(--popover-foreground))",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 4, fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Priority 2: Total Invested - Medium card */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium text-card-foreground">Total Invested</CardTitle>
          <DollarSign className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-mono font-bold text-primary">{formatCurrency(stats.totalInvested)}</div>
          <p className="text-xs text-muted-foreground">Demo portfolio</p>
        </CardContent>
      </Card>

      {/* Priority 3: Portfolio Return - Medium card */}
      <Card className="md:col-span-3 lg:col-span-1 bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium text-card-foreground">Portfolio Return</CardTitle>
          <Award className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-mono font-bold text-primary">+{stats.portfolioReturn}%</div>
          <p className="text-xs text-muted-foreground">Rank #{stats.rank}</p>
        </CardContent>
      </Card>
    </div>
  )
}
