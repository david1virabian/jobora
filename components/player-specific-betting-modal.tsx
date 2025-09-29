"use client"

import { useState } from "react"
import { Wallet, TrendingUp, Target, Activity } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface PlayerSpecificBettingModalProps {
  player: any
  isOpen: boolean
  onClose: () => void
}

export function PlayerSpecificBettingModal({ player, isOpen, onClose }: PlayerSpecificBettingModalProps) {
  const [selectedBet, setSelectedBet] = useState<{ type: "yes" | "no"; prediction: string } | null>(null)
  const [betAmount, setBetAmount] = useState("")
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  if (!player) return null

  // Generate player-specific predictions based on their stats
  const generatePlayerPredictions = () => {
    const predictions = []

    // Accuracy-based predictions
    if (player.accuracy > 85) {
      predictions.push({
        id: 1,
        title: `Will maintain ${Math.floor(player.accuracy)}%+ accuracy`,
        probability: Math.min(95, player.accuracy + 5),
        description: `Based on current ${player.accuracy}% accuracy and ${player.streak}-day streak`,
        category: "accuracy",
      })
    } else {
      predictions.push({
        id: 1,
        title: `Will reach 85%+ accuracy rate`,
        probability: Math.max(15, 85 - player.accuracy + 10),
        description: `Currently at ${player.accuracy}% with room for improvement`,
        category: "accuracy",
      })
    }

    // Ranking predictions
    if (player.rank <= 3) {
      predictions.push({
        id: 2,
        title: `Will stay in top 3 this month`,
        probability: Math.max(60, 100 - player.rank * 10),
        description: `Currently ranked #${player.rank} with strong performance`,
        category: "ranking",
      })
    } else {
      predictions.push({
        id: 2,
        title: `Will reach top 5 ranking`,
        probability: Math.max(20, 60 - player.rank * 2),
        description: `Currently #${player.rank}, showing potential for growth`,
        category: "ranking",
      })
    }

    // Activity predictions
    if (player.totalPredictions > 200) {
      predictions.push({
        id: 3,
        title: `Will make 50+ predictions this month`,
        probability: 78,
        description: `Highly active with ${player.totalPredictions} total predictions`,
        category: "activity",
      })
    }

    return predictions.slice(0, 2) // Show top 2 predictions
  }

  const playerPredictions = generatePlayerPredictions()

  const handleBetClick = (type: "yes" | "no", prediction: string) => {
    setSelectedBet({ type, prediction })
  }

  const handleWalletConnect = (wallet: string) => {
    setIsWalletConnected(true)
  }

  const handlePlaceBet = () => {
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      onClose()
      setSelectedBet(null)
      setBetAmount("")
      setIsWalletConnected(false)
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={player.avatar || "/placeholder.svg"} alt={player.username} />
                <AvatarFallback>{player.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-lg">{player.username}</DialogTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline">#{player.rank}</Badge>
                  <span className="text-sm text-muted-foreground">{player.accuracy}% accuracy</span>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        {showSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Bet Placed Successfully!</h3>
            <p className="text-muted-foreground">Your forecast has been recorded</p>
          </div>
        ) : !isWalletConnected ? (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Wallet className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Connect Wallet to Place Bet</h3>
              </div>
              <p className="text-sm text-blue-700">
                Connect your wallet to place real forecasts on {player.username}'s performance.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => handleWalletConnect("MetaMask")}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                MetaMask
              </Button>
              <Button
                onClick={() => handleWalletConnect("Trust Wallet")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Trust Wallet
              </Button>
              <Button
                onClick={() => handleWalletConnect("WalletConnect")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                WalletConnect
              </Button>
            </div>
          </div>
        ) : selectedBet ? (
          <div className="space-y-4">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Place Your Bet</h3>
              </div>
              <p className="text-sm text-green-700 mb-2">
                Betting <span className="font-semibold">{selectedBet.type.toUpperCase()}</span> on:{" "}
                {selectedBet.prediction}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Forecast Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  placeholder="Enter amount..."
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Range: $1 - $10K</p>
            </div>

            <div className="flex space-x-2">
              {[10, 50, 100, 500].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount(amount.toString())}
                  className="flex-1"
                >
                  ${amount}
                </Button>
              ))}
            </div>

            <Button
              onClick={handlePlaceBet}
              className="w-full"
              disabled={!betAmount || Number.parseFloat(betAmount) < 1}
            >
              Place Bet
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Player Predictions</span>
            </h3>

            {playerPredictions.map((prediction) => (
              <div key={prediction.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{prediction.title}</h4>
                  <span className="text-2xl font-bold text-gray-900">{prediction.probability}%</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{prediction.description}</p>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleBetClick("yes", prediction.title)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    Bet Yes
                  </Button>
                  <Button
                    onClick={() => handleBetClick("no", prediction.title)}
                    variant="outline"
                    className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50"
                    size="sm"
                  >
                    Bet No
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
