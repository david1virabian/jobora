"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlayerBettingModal } from "./player-betting-modal"

interface BettingCard {
  id: string
  prediction: string
  probability: number
  description: string
  player: string
}

function generatePredictions(category: string): BettingCard[] {
  const baseUsers = [
    { username: "PredictionMaster", accuracy: 87.5, predictions: 156, streak: 12 },
    { username: "StartupGuru", accuracy: 84.2, predictions: 203, streak: 8 },
    { username: "TechOracle", accuracy: 82.1, predictions: 189, streak: 15 },
    { username: "VCInsider", accuracy: 79.8, predictions: 134, streak: 5 },
  ]

  switch (category) {
    case "accuracy":
      return [
        {
          id: "1",
          prediction: "Will maintain #1 position this month",
          probability: 92,
          description: "Leading with 92.3% accuracy and strong consistency",
          player: "PredictionMaster",
        },
        {
          id: "2",
          prediction: "Will reach 90% accuracy rate",
          probability: 45,
          description: "Currently at 89.7%, needs sustained performance",
          player: "StartupGuru",
        },
        {
          id: "3",
          prediction: "Will break 90% accuracy barrier",
          probability: 38,
          description: "Strong at 87.1% but facing tough competition",
          player: "TechOracle",
        },
        {
          id: "4",
          prediction: "Will improve accuracy by 5%",
          probability: 62,
          description: "Solid foundation at 85.4% with room for growth",
          player: "VCInsider",
        },
      ]

    case "participation":
      return [
        {
          id: "1",
          prediction: "Will maintain #1 position this month",
          probability: 85,
          description: "Based on current accuracy streak and consistent performance",
          player: "PredictionMaster",
        },
        {
          id: "2",
          prediction: "Will reach 90% accuracy rate",
          probability: 32,
          description: "Considering current trajectory and market volatility",
          player: "StartupGuru",
        },
        {
          id: "3",
          prediction: "Will make 200+ predictions this month",
          probability: 67,
          description: "Currently leading in participation with strong engagement",
          player: "TechOracle",
        },
        {
          id: "4",
          prediction: "Will break into top 3 rankings",
          probability: 28,
          description: "Strong recent performance but needs consistency",
          player: "VCInsider",
        },
      ]

    case "activity":
      return [
        {
          id: "1",
          prediction: "Will maintain daily activity streak",
          probability: 78,
          description: "Currently leading with 47 daily activity points",
          player: "PredictionMaster",
        },
        {
          id: "2",
          prediction: "Will reach 50+ daily activity score",
          probability: 55,
          description: "Strong at 42 points, trending upward consistently",
          player: "StartupGuru",
        },
        {
          id: "3",
          prediction: "Will post 100+ comments this month",
          probability: 89,
          description: "Already at 102 comments, highly engaged community member",
          player: "TechOracle",
        },
        {
          id: "4",
          prediction: "Will double current activity level",
          probability: 41,
          description: "At 35 daily points, showing potential for growth",
          player: "VCInsider",
        },
      ]

    default:
      return []
  }
}

export function PlayerBettingSidebar({ category = "participation" }: { category?: string }) {
  const bettingCards = generatePredictions(category)
  const [selectedBets, setSelectedBets] = useState<Record<string, "yes" | "no" | null>>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<BettingCard | null>(null)
  const [betType, setBetType] = useState<"yes" | "no" | null>(null)

  const handleBet = (cardId: string, bet: "yes" | "no") => {
    const card = bettingCards.find((c) => c.id === cardId)
    if (card) {
      setSelectedCard(card)
      setBetType(bet)
      setModalOpen(true)
    }

    setSelectedBets((prev) => ({
      ...prev,
      [cardId]: prev[cardId] === bet ? null : bet,
    }))
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedCard(null)
    setBetType(null)
  }

  return (
    <>
      <div className="w-80 space-y-6">
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-foreground">Player Predictions</h2>

          <div className="space-y-4">
            {bettingCards.map((card) => (
              <Card key={card.id} className="p-4 bg-muted/50 border-border/50">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm leading-tight text-foreground">{card.prediction}</h3>
                      <p className="text-xs text-muted-foreground mt-1 font-medium">{card.player}</p>
                    </div>
                    <div className="text-right ml-3">
                      <div className="text-2xl font-bold text-foreground">{card.probability}%</div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1 h-8 text-xs font-medium"
                      style={{
                        backgroundColor:
                          selectedBets[card.id] === "yes" ? "var(--yes-soft)" : "rgba(var(--yes-soft-rgb), 0.8)",
                        borderColor: "var(--yes-soft)",
                        color: "white",
                      }}
                      onClick={() => handleBet(card.id, "yes")}
                    >
                      Bet Yes
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-8 text-xs font-medium bg-transparent"
                      style={{
                        borderColor: "var(--no-soft)",
                        color: "var(--no-soft)",
                        backgroundColor:
                          selectedBets[card.id] === "no" ? "rgba(var(--no-soft-rgb), 0.1)" : "transparent",
                      }}
                      onClick={() => handleBet(card.id, "no")}
                    >
                      Bet No
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <PlayerBettingModal isOpen={modalOpen} onClose={handleCloseModal} bettingCard={selectedCard} betType={betType} />
    </>
  )
}
