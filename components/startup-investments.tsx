"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Users, Clock, Target, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Investment, Startup } from "@/lib/mock-data"

interface StartupInvestmentsProps {
  startup: Startup
  investments: Investment[]
}

export function StartupInvestments({ startup, investments }: StartupInvestmentsProps) {
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null)

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
        return "bg-green-100 text-green-800 border-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "funded":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (investments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Opportunities</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No active opportunities at this time.</p>
            <p className="text-sm text-muted-foreground mt-2">Check back later for new funding rounds.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5" />
          <span>Opportunities</span>
          <Badge variant="secondary">{investments.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="opportunities" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="opportunities">Active Opportunities</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities" className="space-y-4">
            <div className="grid gap-4">
              {investments.map((investment) => {
                const forPercentage = Math.floor(Math.random() * 40) + 30 // 30-70%
                const againstPercentage = 100 - forPercentage
                const totalVoters = investment.investorCount

                return (
                  <Card
                    key={investment.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-md",
                      selectedInvestment?.id === investment.id && "ring-2 ring-primary",
                    )}
                    onClick={() => setSelectedInvestment(investment)}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold text-lg">{investment.title}</h3>
                            <p className="text-muted-foreground">{investment.description}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Badge className={cn("text-xs", getStatusColor(investment.status))}>
                              {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Voting Split</span>
                            <span className="font-medium">
                              {forPercentage}% growth vs {againstPercentage}% decline
                            </span>
                          </div>
                          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden flex">
                            <div
                              className="h-full bg-green-500 transition-all duration-300"
                              style={{ width: `${forPercentage}%` }}
                            />
                            <div
                              className="h-full bg-orange-500 transition-all duration-300"
                              style={{ width: `${againstPercentage}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span className="text-green-600">{forPercentage}% vote for growth</span>
                            <span className="text-orange-600">{againstPercentage}% vote for decline</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Days Left</p>
                              <p className="font-medium">{investment.daysLeft}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Voters</p>
                              <p className="font-medium">{totalVoters}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Min Investment</p>
                              <p className="font-medium">{formatCurrency(investment.minInvestment)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex flex-wrap gap-1">
                            {investment.highlights.slice(0, 2).map((highlight, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {highlight}
                              </Badge>
                            ))}
                          </div>
                          <Button size="sm">View Details</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            {selectedInvestment ? (
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{selectedInvestment.title}</h3>
                    <p className="text-muted-foreground">{selectedInvestment.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Investment Terms</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Target Amount:</span>
                          <span className="font-medium">{formatCurrency(selectedInvestment.targetAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Min Investment:</span>
                          <span className="font-medium">{formatCurrency(selectedInvestment.minInvestment)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Max Investment:</span>
                          <span className="font-medium">{formatCurrency(selectedInvestment.maxInvestment)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Key Highlights</h4>
                      <ul className="space-y-2 text-sm">
                        {selectedInvestment.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800">Disclaimer</p>
                      <p className="text-yellow-700 mt-1">
                        This is a demo opportunity. No real money is involved. All terms and returns are simulated for
                        demonstration purposes only.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Select an opportunity to view details.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
