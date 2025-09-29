"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface GamblingOption {
  id: string
  label: string
  multiplier: number
  probability: number
}

const singleQuestion = {
  id: "ai-market-2025",
  question: "What will be the AI market size by end of 2025?",
  description: "Global AI market valuation prediction",
  options: [
    { id: "500b-1t", label: "$500B - $1T", multiplier: 2.2, probability: 60 },
    { id: "1t-1.5t", label: "$1T - $1.5T", multiplier: 1.8, probability: 40 },
  ],
}

const triggerConfetti = () => {
  const colors = ["#007bff", "#0056b3", "#28a745", "#ffc107", "#dc3545", "#6f42c1"]
  const confettiCount = 100

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div")
    confetti.style.position = "fixed"
    confetti.style.left = Math.random() * 100 + "vw"
    confetti.style.top = "-10px"
    confetti.style.width = "10px"
    confetti.style.height = "10px"
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    confetti.style.borderRadius = "50%"
    confetti.style.pointerEvents = "none"
    confetti.style.zIndex = "9999"
    confetti.style.animation = `confetti-fall ${2 + Math.random() * 3}s linear forwards`

    document.body.appendChild(confetti)

    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.parentNode.removeChild(confetti)
      }
    }, 5000)
  }
}

const GamblingChart = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [betAmount, setBetAmount] = useState<number>(10)
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<{ option: GamblingOption; won: boolean } | null>(null)
  const [prctrBalance, setPrctrBalance] = useState<number>(1240.75)

  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      @keyframes confetti-fall {
        0% {
          transform: translateY(-10px) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(720deg);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style)
      }
    }
  }, [])

  const handlePlaceBet = () => {
    if (!selectedOption || betAmount > prctrBalance) return

    setIsSpinning(true)
    setResult(null)

    setPrctrBalance((prev) => prev - betAmount)

    setTimeout(() => {
      const random = Math.random() * 100
      let cumulative = 0
      let winningOption: GamblingOption | null = null

      for (const option of singleQuestion.options) {
        cumulative += option.probability
        if (random <= cumulative) {
          winningOption = option
          break
        }
      }

      if (!winningOption) {
        winningOption = singleQuestion.options[singleQuestion.options.length - 1]
      }

      const won = winningOption.id === selectedOption
      const winAmount = won ? betAmount * winningOption.multiplier : 0

      if (won) {
        setPrctrBalance((prev) => prev + winAmount)
        setTimeout(() => triggerConfetti(), 500)
      }

      setResult({ option: winningOption, won })
      setIsSpinning(false)
    }, 3000)
  }

  const selectedOptionData = singleQuestion.options.find((opt) => opt.id === selectedOption)
  const potentialWin = selectedOptionData ? betAmount * selectedOptionData.multiplier : 0

  const getCardSize = (probability: number) => {
    return "col-span-1 row-span-1"
  }

  const getOptionColors = (optionId: string, isSelected: boolean) => {
    const colorMap = {
      "500b-1t": isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary hover:bg-primary/20",
      "1t-1.5t": isSelected ? "bg-chart-3 text-white" : "bg-chart-3/10 text-chart-3 hover:bg-chart-3/20",
    }
    return (
      colorMap[optionId as keyof typeof colorMap] ||
      (isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")
    )
  }

  return (
    <div className="w-full mx-auto">
      <Card className="bg-card border-border">
        <CardHeader className="text-center pb-2 sm:pb-1">
          <div className="flex justify-center mb-2 sm:mb-1">
            <div className="flex items-center space-x-2 px-4 py-2 sm:px-3 sm:py-1.5 bg-background border border-border rounded-lg">
              <div className="w-6 h-6 sm:w-5 sm:h-5 rounded-full bg-primary flex items-center justify-center">
                <svg className="w-3 h-3 sm:w-2.5 sm:h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-lg sm:text-base font-bold text-primary">{prctrBalance.toFixed(2)} PRCTR</span>
            </div>
          </div>

          <CardTitle className="text-lg sm:text-lg font-bold text-foreground leading-tight px-2">
            {singleQuestion.question}
          </CardTitle>
          <p className="text-muted-foreground text-sm sm:text-xs mt-1 sm:mt-0.5 px-2">{singleQuestion.description}</p>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-2 px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
            {singleQuestion.options.map((option) => (
              <Button
                key={option.id}
                variant="ghost"
                className={`h-[70px] sm:h-[60px] p-4 sm:p-3 flex items-center justify-between transition-colors duration-200 ${
                  selectedOption === option.id ? "ring-2 ring-primary" : ""
                } ${getOptionColors(option.id, selectedOption === option.id)} ${
                  result && result.option.id === option.id ? (result.won ? "bg-success/20" : "bg-destructive/20") : ""
                }`}
                onClick={() => setSelectedOption(option.id)}
                disabled={isSpinning}
              >
                <span className="text-base sm:text-sm font-semibold text-left leading-tight">{option.label}</span>
                <Badge
                  variant="secondary"
                  className="text-base sm:text-sm px-3 py-1.5 sm:px-2 sm:py-1 bg-background font-bold"
                >
                  {option.multiplier}x
                </Badge>
              </Button>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-3 sm:gap-2 p-4 sm:p-2 bg-muted rounded-lg">
            <div className="flex items-center space-x-3 sm:space-x-2">
              <span className="text-sm sm:text-xs font-medium">Bet Amount:</span>
              <div className="flex items-center space-x-2 sm:space-x-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount(Math.max(1, betAmount - 5))}
                  disabled={isSpinning}
                  className="h-9 w-9 sm:h-7 sm:w-7 p-0 text-lg sm:text-sm"
                >
                  -
                </Button>
                <span className="px-3 py-2 sm:px-2 sm:py-1 bg-background border rounded text-sm sm:text-xs font-mono min-w-[90px] sm:min-w-[70px] text-center">
                  {betAmount} PRCTR
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount(Math.min(prctrBalance, betAmount + 5))}
                  disabled={isSpinning}
                  className="h-9 w-9 sm:h-7 sm:w-7 p-0 text-lg sm:text-sm"
                >
                  +
                </Button>
              </div>
            </div>

            {selectedOption && (
              <div className="text-sm sm:text-xs text-center">
                <span className="text-muted-foreground">Potential Win: </span>
                <span className="font-bold text-primary">{potentialWin.toFixed(2)} PRCTR</span>
              </div>
            )}

            {betAmount > prctrBalance && (
              <div className="text-sm sm:text-xs text-red-500">Insufficient PRCTR balance</div>
            )}
          </div>

          <div className="text-center">
            <Button
              onClick={handlePlaceBet}
              disabled={!selectedOption || isSpinning || betAmount > prctrBalance}
              size="sm"
              className={`px-8 py-3 sm:px-6 sm:py-2 font-semibold transition-colors duration-300 text-base sm:text-sm ${isSpinning ? "animate-pulse" : ""}`}
            >
              {isSpinning ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 sm:w-3 sm:h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-base sm:text-sm">Analyzing Market...</span>
                </div>
              ) : (
                "Place Bet & Spin"
              )}
            </Button>
          </div>

          {result && (
            <div
              className={`text-center p-4 sm:p-3 rounded-lg ${
                result.won ? "bg-success/10 border border-success/20" : "bg-destructive/10 border border-destructive/20"
              }`}
            >
              <div className="space-y-2 sm:space-y-1.5">
                <h4 className={`text-lg sm:text-base font-bold ${result.won ? "text-success" : "text-destructive"}`}>
                  {result.won ? "🎉 You Won!" : "😔 Better Luck Next Time"}
                </h4>
                <p className="text-sm sm:text-xs text-muted-foreground">
                  Market Result: <span className="font-medium">{result.option.label}</span>
                </p>
                {result.won && (
                  <p className="text-base sm:text-sm font-bold text-primary">
                    You won {potentialWin.toFixed(2)} PRCTR!
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export { GamblingChart }
