"use client"

import { useState } from "react"
import { Star, TrendingUp, TrendingDown, ExternalLink } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { mockStartups, mockForecasts as mockInvestments } from "@/lib/mock-data"

export function MyAssetsTabs() {
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set(["inv_nv_001", "inv_pf_001"]))

  const mockInvestmentPositions = [
    {
      id: "pos_1",
      investmentId: "inv_nv_001",
      amount: 5000,
      shares: 50,
      investedAt: "2024-12-10",
      currentValue: 6200,
      status: "active" as const,
    },
    {
      id: "pos_2",
      investmentId: "inv_pf_001",
      amount: 10000,
      shares: 40,
      investedAt: "2024-12-08",
      currentValue: 12500,
      status: "active" as const,
    },
  ]

  const mockInvestmentHistory = [
    {
      id: "hist_1",
      investmentId: "inv_gt_001",
      amount: 2500,
      shares: 25,
      investedAt: "2024-11-15",
      exitValue: 3200,
      exitedAt: "2024-12-05",
      status: "exited" as const,
      returnAmount: 700,
    },
    {
      id: "hist_2",
      investmentId: "inv_nv_001",
      amount: 1000,
      shares: 10,
      investedAt: "2024-10-20",
      exitValue: 800,
      exitedAt: "2024-12-01",
      status: "exited" as const,
      returnAmount: -200,
    },
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

  const getStartupByInvestmentId = (investmentId: string) => {
    const investment = mockInvestments.find((inv) => inv.id === investmentId)
    return investment ? mockStartups.find((s) => s.id === investment.startupId) : null
  }

  const getInvestmentById = (investmentId: string) => {
    return mockInvestments.find((inv) => inv.id === investmentId)
  }

  const removeFromWatchlist = (investmentId: string) => {
    const newWatchlist = new Set(watchlist)
    newWatchlist.delete(investmentId)
    setWatchlist(newWatchlist)
  }

  return (
    <Tabs defaultValue="positions" className="space-y-6">
      <TabsList>
        <TabsTrigger value="positions">Investments</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
        <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
      </TabsList>

      <TabsContent value="positions">
        <Card>
          <CardHeader>
            <CardTitle>Active Investments</CardTitle>
            <p className="text-sm text-muted-foreground">Your current investments and their performance</p>
          </CardHeader>
          <CardContent>
            {mockInvestmentPositions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Investment</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Shares</TableHead>
                      <TableHead>Current Value</TableHead>
                      <TableHead>Return</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockInvestmentPositions.map((position) => {
                      const investment = getInvestmentById(position.investmentId)
                      const startup = getStartupByInvestmentId(position.investmentId)
                      const returnAmount = position.currentValue - position.amount
                      const returnPercentage = (returnAmount / position.amount) * 100
                      const isProfitable = returnAmount > 0

                      return (
                        <TableRow key={position.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={startup?.logoUrl || "/placeholder.svg"} alt={startup?.name} />
                                <AvatarFallback>{startup?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">{startup?.name}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-48">
                                  {investment?.title}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono">{formatCurrency(position.amount)}</TableCell>
                          <TableCell className="font-mono">{position.shares}</TableCell>
                          <TableCell className="font-mono">{formatCurrency(position.currentValue)}</TableCell>
                          <TableCell>
                            <div
                              className={cn(
                                "flex items-center space-x-1",
                                isProfitable ? "text-green-600" : "text-blue-600",
                              )}
                            >
                              {isProfitable ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                              <span className="font-mono text-sm">
                                {isProfitable ? "+" : ""}
                                {formatCurrency(returnAmount)} ({returnPercentage.toFixed(1)}%)
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="default">{position.status}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(position.investedAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No active investments</p>
                <p className="text-sm text-muted-foreground mt-1">Start investing to see your positions here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle>Investment History</CardTitle>
            <p className="text-sm text-muted-foreground">Your completed investments and returns</p>
          </CardHeader>
          <CardContent>
            {mockInvestmentHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Investment</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Shares</TableHead>
                      <TableHead>Exit Value</TableHead>
                      <TableHead>Return</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Exit Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockInvestmentHistory.map((investment) => {
                      const investmentData = getInvestmentById(investment.investmentId)
                      const startup = getStartupByInvestmentId(investment.investmentId)
                      const returnPercentage = (investment.returnAmount / investment.amount) * 100
                      const isProfitable = investment.returnAmount > 0

                      return (
                        <TableRow key={investment.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={startup?.logoUrl || "/placeholder.svg"} alt={startup?.name} />
                                <AvatarFallback>{startup?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">{startup?.name}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-48">
                                  {investmentData?.title}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono">{formatCurrency(investment.amount)}</TableCell>
                          <TableCell className="font-mono">{investment.shares}</TableCell>
                          <TableCell className="font-mono">{formatCurrency(investment.exitValue)}</TableCell>
                          <TableCell>
                            <div
                              className={cn(
                                "flex items-center space-x-1",
                                isProfitable ? "text-green-600" : "text-blue-600",
                              )}
                            >
                              {isProfitable ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                              <span className="font-mono text-sm">
                                {isProfitable ? "+" : ""}
                                {formatCurrency(investment.returnAmount)} ({returnPercentage.toFixed(1)}%)
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={isProfitable ? "default" : "destructive"}>{investment.status}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(investment.exitedAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No investment history</p>
                <p className="text-sm text-muted-foreground mt-1">Your completed investments will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="watchlist">
        <Card>
          <CardHeader>
            <CardTitle>Watchlist</CardTitle>
            <p className="text-sm text-muted-foreground">Investment opportunities you're tracking</p>
          </CardHeader>
          <CardContent>
            {watchlist.size > 0 ? (
              <div className="space-y-4">
                {Array.from(watchlist).map((investmentId) => {
                  const investment = getInvestmentById(investmentId)
                  const startup = getStartupByInvestmentId(investmentId)

                  if (!investment || !startup) return null

                  const progressPercentage = (investment.raisedAmount / investment.targetAmount) * 100

                  return (
                    <div key={investmentId} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={startup.logoUrl || "/placeholder.svg"} alt={startup.name} />
                            <AvatarFallback>{startup.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-semibold text-sm">{startup.name}</div>
                            <div className="text-sm text-balance leading-relaxed mt-1">{investment.title}</div>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="text-center">
                                <div className="text-lg font-mono font-bold text-primary">
                                  {formatCurrency(investment.targetAmount)}
                                </div>
                                <div className="text-xs text-muted-foreground">Target</div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Progress value={progressPercentage} className="w-16 h-2" />
                                <span className="text-xs text-muted-foreground">{Math.round(progressPercentage)}%</span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {investment.daysLeft > 0 ? `${investment.daysLeft}d left` : "Ended"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/startup/${startup.id}`}>
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => removeFromWatchlist(investmentId)}>
                            <Star className="h-4 w-4 fill-accent text-accent" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No items in watchlist</p>
                <p className="text-sm text-muted-foreground mt-1">Add investment opportunities to track them here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
