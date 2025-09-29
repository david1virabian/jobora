"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Trophy,
  Target,
  Calendar,
  BarChart3,
  Activity,
  Star,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Wallet,
  X,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface ForecasterPageProps {
  params: { username: string }
}

export default function ForecasterPage({ params }: ForecasterPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBet, setSelectedBet] = useState<{
    title: string
    forecaster: string
    type: "yes" | "no"
  } | null>(null)
  const [betAmount, setBetAmount] = useState("")

  const { username } = params

  const handleBetClick = (title: string, forecaster: string, type: "yes" | "no") => {
    setSelectedBet({ title, forecaster, type })
    setIsModalOpen(true)
  }

  const handlePresetAmount = (amount: string) => {
    setBetAmount(amount)
  }

  const getForecasterData = (username: string) => {
    const forecasters = {
      PredictionMaster: {
        username: "PredictionMaster",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        badge: "Expert",
        rank: 1,
        accuracy: 87.5,
        totalPredictions: 156,
        points: 2847,
        streak: 12,
        joinDate: "2023-01-15",
        bio: "Veteran startup analyst with 8+ years in venture capital. Specializes in fintech and SaaS predictions.",
        specializations: ["Fintech", "SaaS", "Series A-B", "Market Analysis"],
        recentPredictions: [
          { company: "TechFlow", prediction: "Will raise Series B by Q2 2024", confidence: 85, outcome: "correct" },
          { company: "DataSync", prediction: "Will achieve 10M ARR by 2024", confidence: 78, outcome: "correct" },
          { company: "CloudBase", prediction: "Will expand to Europe", confidence: 92, outcome: "pending" },
        ],
        monthlyStats: [
          { month: "Jan", accuracy: 89, predictions: 23 },
          { month: "Feb", accuracy: 85, predictions: 19 },
          { month: "Mar", accuracy: 91, predictions: 27 },
          { month: "Apr", accuracy: 88, predictions: 21 },
          { month: "May", accuracy: 86, predictions: 25 },
          { month: "Jun", accuracy: 87, predictions: 22 },
        ],
      },
      StartupGuru: {
        username: "StartupGuru",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b780?w=150&h=150&fit=crop&crop=face",
        badge: "Pro",
        rank: 2,
        accuracy: 84.2,
        totalPredictions: 203,
        points: 2634,
        streak: 8,
        joinDate: "2023-03-22",
        bio: "Former founder turned prediction expert. Deep knowledge of startup ecosystems and growth patterns.",
        specializations: ["Early Stage", "Growth", "Product-Market Fit", "Team Dynamics"],
        recentPredictions: [
          { company: "StartupX", prediction: "Will pivot business model", confidence: 76, outcome: "correct" },
          { company: "GrowthCo", prediction: "Will hire 50+ employees", confidence: 83, outcome: "correct" },
          { company: "InnovateLab", prediction: "Will launch new product line", confidence: 71, outcome: "pending" },
        ],
        monthlyStats: [
          { month: "Jan", accuracy: 82, predictions: 31 },
          { month: "Feb", accuracy: 86, predictions: 28 },
          { month: "Mar", accuracy: 83, predictions: 35 },
          { month: "Apr", accuracy: 85, predictions: 29 },
          { month: "May", accuracy: 84, predictions: 33 },
          { month: "Jun", accuracy: 84, predictions: 30 },
        ],
      },
      // Add more forecasters as needed
    }

    return forecasters[username as keyof typeof forecasters] || null
  }

  const forecaster = getForecasterData(username)

  if (!forecaster) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Forecaster Not Found</h1>
          <Link href="/leaderboard">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Leaderboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/leaderboard">
          <Button variant="outline" size="sm" className="mb-4 bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Leaderboard
          </Button>
        </Link>

        <div className="flex items-start space-x-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={forecaster.avatar || "/placeholder.svg"} alt={forecaster.username} />
            <AvatarFallback className="text-2xl">{forecaster.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold">{forecaster.username}</h1>
              <Badge
                variant={
                  forecaster.badge === "Expert" ? "default" : forecaster.badge === "Pro" ? "secondary" : "outline"
                }
              >
                {forecaster.badge}
              </Badge>
              <div className="flex items-center space-x-1">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold">#{forecaster.rank}</span>
              </div>
            </div>

            <p className="text-muted-foreground mb-4">{forecaster.bio}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {forecaster.specializations.map((spec) => (
                <Badge key={spec} variant="outline" className="text-xs">
                  {spec}
                </Badge>
              ))}
            </div>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(forecaster.joinDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{forecaster.accuracy}%</p>
                <p className="text-sm text-muted-foreground">Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{forecaster.totalPredictions}</p>
                <p className="text-sm text-muted-foreground">Predictions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{forecaster.points.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{forecaster.streak}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Betting Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Bet on {forecaster.username}'s Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Accuracy Bet */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold">Will maintain 85%+ accuracy next month</h4>
                  <p className="text-sm text-muted-foreground">Current: {forecaster.accuracy}%</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">72%</div>
                  <div className="text-xs text-muted-foreground">Market confidence</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  className="flex-1"
                  style={{
                    backgroundColor: "var(--yes-soft)",
                    borderColor: "var(--yes-soft)",
                    color: "white",
                  }}
                  onClick={() => handleBetClick("Will maintain 85%+ accuracy next month", forecaster.username, "yes")}
                >
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Bet Yes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  style={{
                    borderColor: "var(--no-soft)",
                    color: "var(--no-soft)",
                    backgroundColor: "transparent",
                  }}
                  onClick={() => handleBetClick("Will maintain 85%+ accuracy next month", forecaster.username, "no")}
                >
                  <TrendingDown className="mr-1 h-3 w-3" />
                  Bet No
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Based on historical performance and current streak analysis
              </p>
            </div>

            {/* Streak Bet */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold">Will extend streak to 20+ days</h4>
                  <p className="text-sm text-muted-foreground">Current: {forecaster.streak} days</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">58%</div>
                  <div className="text-xs text-muted-foreground">Market confidence</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  className="flex-1"
                  style={{
                    backgroundColor: "var(--yes-soft)",
                    borderColor: "var(--yes-soft)",
                    color: "white",
                  }}
                  onClick={() => handleBetClick("Will extend streak to 20+ days", forecaster.username, "yes")}
                >
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Bet Yes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  style={{
                    borderColor: "var(--no-soft)",
                    color: "var(--no-soft)",
                    backgroundColor: "transparent",
                  }}
                  onClick={() => handleBetClick("Will extend streak to 20+ days", forecaster.username, "no")}
                >
                  <TrendingDown className="mr-1 h-3 w-3" />
                  Bet No
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Considering prediction difficulty and market volatility
              </p>
            </div>

            {/* Points Bet */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold">Will reach 3,000+ points this month</h4>
                  <p className="text-sm text-muted-foreground">Current: {forecaster.points.toLocaleString()} points</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">81%</div>
                  <div className="text-xs text-muted-foreground">Market confidence</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  className="flex-1"
                  style={{
                    backgroundColor: "var(--yes-soft)",
                    borderColor: "var(--yes-soft)",
                    color: "white",
                  }}
                  onClick={() => handleBetClick("Will reach 3,000+ points this month", forecaster.username, "yes")}
                >
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Bet Yes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  style={{
                    borderColor: "var(--no-soft)",
                    color: "var(--no-soft)",
                    backgroundColor: "transparent",
                  }}
                  onClick={() => handleBetClick("Will reach 3,000+ points this month", forecaster.username, "no")}
                >
                  <TrendingDown className="mr-1 h-3 w-3" />
                  Bet No
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Based on current trajectory and upcoming prediction opportunities
              </p>
            </div>

            {/* Ranking Bet */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold">Will maintain #1 ranking</h4>
                  <p className="text-sm text-muted-foreground">Current: #{forecaster.rank}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">89%</div>
                  <div className="text-xs text-muted-foreground">Market confidence</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  className="flex-1"
                  style={{
                    backgroundColor: "var(--yes-soft)",
                    borderColor: "var(--yes-soft)",
                    color: "white",
                  }}
                  onClick={() => handleBetClick("Will maintain #1 ranking", forecaster.username, "yes")}
                >
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Bet Yes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  style={{
                    borderColor: "var(--no-soft)",
                    color: "var(--no-soft)",
                    backgroundColor: "transparent",
                  }}
                  onClick={() => handleBetClick("Will maintain #1 ranking", forecaster.username, "no")}
                >
                  <TrendingDown className="mr-1 h-3 w-3" />
                  Bet No
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Considering competitive landscape and performance consistency
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Connection Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold">{selectedBet?.forecaster}</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">{selectedBet?.title}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)} className="h-6 w-6 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Wallet Connection Section */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Wallet className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Connect Wallet to Place Bet</h3>
              </div>
              <p className="text-sm text-blue-700 mb-4">
                Connect your wallet to place real forecasts and participate in the prediction market.
              </p>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">MetaMask</Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Trust Wallet</Button>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">WalletConnect</Button>
              </div>
            </div>

            {/* Forecast Section */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <h3 className="font-semibold">Forecast {selectedBet?.type === "yes" ? "Success" : "Failure"}</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Forecast Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      type="text"
                      placeholder="Enter amount..."
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Range: $1 - $10K</p>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {["10", "50", "100", "500"].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePresetAmount(amount)}
                      className="text-xs"
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>

                <Button className="w-full bg-gray-300 text-gray-500 cursor-not-allowed" disabled>
                  Connect Wallet to Forecast
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detailed Content */}
      <Tabs defaultValue="predictions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictions">Recent Predictions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forecaster.recentPredictions.map((prediction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{prediction.company}</h4>
                      <p className="text-sm text-muted-foreground">{prediction.prediction}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs">Confidence:</span>
                        <Progress value={prediction.confidence} className="w-20 h-2" />
                        <span className="text-xs font-mono">{prediction.confidence}%</span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        prediction.outcome === "correct"
                          ? "default"
                          : prediction.outcome === "incorrect"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {prediction.outcome}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forecaster.monthlyStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <span className="font-medium">{stat.month}</span>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold">{stat.accuracy}%</p>
                        <p className="text-xs text-muted-foreground">Accuracy</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{stat.predictions}</p>
                        <p className="text-xs text-muted-foreground">Predictions</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Prediction Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {forecaster.specializations.map((spec, index) => (
                    <div key={spec} className="flex items-center justify-between">
                      <span className="text-sm">{spec}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={[85, 78, 92, 73][index]} className="w-16 h-2" />
                        <span className="text-xs font-mono w-8">{[85, 78, 92, 73][index]}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Community Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Helpful Votes</span>
                    <span className="font-semibold">247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Comments</span>
                    <span className="font-semibold">89</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Followers</span>
                    <span className="font-semibold">1,234</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Following</span>
                    <span className="font-semibold">156</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
