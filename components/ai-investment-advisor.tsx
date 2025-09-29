"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles } from "lucide-react"
import { mockStartups, mockForecasts as mockInvestments, type Investment, type Startup } from "@/lib/mock-data"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  recommendations?: Array<{ investment: Investment; startup: Startup; reason: string }>
}

export function AIInvestmentAdvisor() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Tell me about your investment goals, risk tolerance, and budget. I'll find the best opportunities for you.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const generateRecommendations = (
    userInput: string,
  ): Array<{ investment: Investment; startup: Startup; reason: string }> => {
    const inputLower = userInput.toLowerCase()
    const recommendations: Array<{ investment: Investment; startup: Startup; reason: string }> = []

    // Simple keyword-based matching for demo
    const keywords = {
      tech: ["tech", "ai", "artificial intelligence", "software", "saas", "technology"],
      healthcare: ["health", "medical", "healthcare", "biotech", "medicine"],
      fintech: ["finance", "fintech", "payment", "banking", "financial"],
      climate: ["climate", "green", "environment", "renewable", "sustainability", "clean energy"],
      lowRisk: ["low risk", "safe", "conservative", "stable"],
      highRisk: ["high risk", "aggressive", "growth", "early stage"],
      highBudget: ["million", "large", "big investment", "100k", "50k"],
      lowBudget: ["small", "budget", "1k", "5k", "10k", "affordable"],
    }

    // Find matching investments based on keywords
    mockInvestments.forEach((investment) => {
      const startup = mockStartups.find((s) => s.id === investment.startupId)!
      let score = 0
      const reasons: string[] = []

      // Sector matching
      if (
        keywords.tech.some((k) => inputLower.includes(k)) &&
        startup.sector.some((s) => ["AI", "DevTools", "SaaS"].includes(s))
      ) {
        score += 3
        reasons.push("matches your tech interest")
      }
      if (keywords.healthcare.some((k) => inputLower.includes(k)) && startup.sector.includes("Healthcare")) {
        score += 3
        reasons.push("aligns with healthcare focus")
      }
      if (keywords.fintech.some((k) => inputLower.includes(k)) && startup.sector.includes("Fintech")) {
        score += 3
        reasons.push("fits fintech preference")
      }
      if (
        keywords.climate.some((k) => inputLower.includes(k)) &&
        startup.sector.some((s) => ["Climate", "Energy"].includes(s))
      ) {
        score += 3
        reasons.push("supports climate goals")
      }

      // Risk matching
      if (keywords.lowRisk.some((k) => inputLower.includes(k)) && investment.riskLevel === "Low Risk") {
        score += 2
        reasons.push("low risk as requested")
      }
      if (keywords.highRisk.some((k) => inputLower.includes(k)) && investment.riskLevel === "High Risk") {
        score += 2
        reasons.push("high growth potential")
      }

      // Budget matching
      if (keywords.lowBudget.some((k) => inputLower.includes(k)) && investment.minimumInvestment <= 1000) {
        score += 1
        reasons.push("fits your budget")
      }
      if (keywords.highBudget.some((k) => inputLower.includes(k)) && investment.minimumInvestment >= 10000) {
        score += 1
        reasons.push("suitable for larger investment")
      }

      // Performance indicators
      if (investment.raisedAmount / investment.targetAmount > 0.7) {
        score += 1
        reasons.push("strong funding momentum")
      }
      if (investment.expectedReturn.includes("15x") || investment.expectedReturn.includes("20x")) {
        score += 1
        reasons.push("high return potential")
      }

      if (score > 0) {
        recommendations.push({
          investment,
          startup,
          reason: reasons.join(", "),
        })
      }
    })

    // Sort by score and return top 3
    return recommendations.sort((a, b) => b.reason.split(",").length - a.reason.split(",").length).slice(0, 3)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: ChatMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI processing
    setTimeout(() => {
      const recommendations = generateRecommendations(input)

      let responseContent = "Based on your investment profile, here are my top recommendations:"

      if (recommendations.length === 0) {
        responseContent =
          "I'd recommend exploring our diverse portfolio of opportunities. Here are some popular choices across different sectors:"
        // Fallback to top performing investments
        const fallbackRecs = mockInvestments
          .slice()
          .sort((a, b) => b.raisedAmount / b.targetAmount - a.raisedAmount / a.targetAmount)
          .slice(0, 3)
          .map((investment) => ({
            investment,
            startup: mockStartups.find((s) => s.id === investment.startupId)!,
            reason: "strong market performance",
          }))

        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: responseContent,
          recommendations: fallbackRecs,
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: responseContent,
          recommendations,
        }
        setMessages((prev) => [...prev, assistantMessage])
      }

      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Let AI find your perfect assets</h2>
        </div>

        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      message.role === "user" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>

                    {message.recommendations && (
                      <div className="mt-3 space-y-2">
                        {message.recommendations.map((rec, recIndex) => (
                          <div key={recIndex} className="bg-white border border-gray-200 rounded p-3">
                            <div className="flex items-start gap-3">
                              <img
                                src={rec.startup.logo || "/placeholder.svg"}
                                alt={rec.startup.name}
                                className="w-8 h-8 rounded object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-gray-900 text-sm">{rec.startup.name}</h4>
                                  <Badge variant="secondary" className="text-xs">
                                    {rec.investment.expectedReturn}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-600 mb-1">{rec.investment.title}</p>
                                <p className="text-xs text-gray-500">
                                  {rec.investment.riskLevel} • Min: ${rec.investment.minimumInvestment.toLocaleString()}
                                </p>
                                <p className="text-xs text-blue-600 mt-1">{rec.reason}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-600">Analyzing...</span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="I'm interested in tech startups, medium risk, budget around $10k..."
                className="min-h-[80px] resize-none w-full border-2 border-blue-200 focus:border-blue-400"
                disabled={isLoading}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Find my perfect investment
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
