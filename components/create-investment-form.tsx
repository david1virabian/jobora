"use client"

import type React from "react"

import { useState } from "react"
import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { mockStartups } from "@/lib/mock-data"

export function CreateInvestmentForm() {
  const [selectedStartup, setSelectedStartup] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [targetAmount, setTargetAmount] = useState("")
  const [minInvestment, setMinInvestment] = useState("")
  const [maxInvestment, setMaxInvestment] = useState("")
  const [expectedReturn, setExpectedReturn] = useState("")
  const [timeframe, setTimeframe] = useState("")
  const [riskLevel, setRiskLevel] = useState("")
  const [endDate, setEndDate] = useState<Date>()
  const [highlights, setHighlights] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !selectedStartup ||
      !title ||
      !description ||
      !targetAmount ||
      !minInvestment ||
      !maxInvestment ||
      !expectedReturn ||
      !timeframe ||
      !riskLevel ||
      !endDate
    ) {
      alert("Please fill in all required fields.")
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      alert(`Demo opportunity "${title}" has been created successfully.`)

      setSelectedStartup("")
      setTitle("")
      setDescription("")
      setTargetAmount("")
      setMinInvestment("")
      setMaxInvestment("")
      setExpectedReturn("")
      setTimeframe("")
      setRiskLevel("")
      setEndDate(undefined)
      setHighlights("")
      setIsSubmitting(false)
    }, 1000)
  }

  const formatCurrency = (amount: string) => {
    const num = Number.parseFloat(amount)
    if (isNaN(num)) return ""
    return `$${num.toLocaleString()}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Opportunity</CardTitle>
        <p className="text-sm text-muted-foreground">Add a new opportunity for startup funding rounds</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="startup">Startup *</Label>
              <Select value={selectedStartup} onValueChange={setSelectedStartup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a startup..." />
                </SelectTrigger>
                <SelectContent>
                  {mockStartups.map((startup) => (
                    <SelectItem key={startup.id} value={startup.id}>
                      <div className="flex items-center space-x-2">
                        <span>{startup.name}</span>
                        <span className="text-xs text-muted-foreground">({startup.stage})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Series A Growth Round"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the opportunity, use of funds, and growth plans..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Target Amount *</Label>
              <Input
                id="targetAmount"
                type="number"
                placeholder="5000000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">{targetAmount && formatCurrency(targetAmount)}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minInvestment">Min Investment *</Label>
              <Input
                id="minInvestment"
                type="number"
                placeholder="1000"
                value={minInvestment}
                onChange={(e) => setMinInvestment(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">{minInvestment && formatCurrency(minInvestment)}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxInvestment">Max Investment *</Label>
              <Input
                id="maxInvestment"
                type="number"
                placeholder="100000"
                value={maxInvestment}
                onChange={(e) => setMaxInvestment(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">{maxInvestment && formatCurrency(maxInvestment)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="expectedReturn">Expected Return *</Label>
              <Input
                id="expectedReturn"
                placeholder="8-12x"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe *</Label>
              <Input
                id="timeframe"
                placeholder="5-7 years"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Risk Level *</Label>
              <Select value={riskLevel} onValueChange={setRiskLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select risk level..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low Risk</SelectItem>
                  <SelectItem value="Medium">Medium Risk</SelectItem>
                  <SelectItem value="High">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>End Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Pick an end date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">{/* Calendar component here */}</PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">When this opportunity closes. Must be in the future.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="highlights">Key Highlights</Label>
            <Textarea
              id="highlights"
              placeholder="Enter key highlights separated by commas (e.g., Growing 40% MoM, Fortune 500 customers, Experienced team)"
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              className="min-h-20"
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple highlights with commas. These will be displayed as bullet points.
            </p>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Creating..." : "Create Opportunity"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedStartup("")
                setTitle("")
                setDescription("")
                setTargetAmount("")
                setMinInvestment("")
                setMaxInvestment("")
                setExpectedReturn("")
                setTimeframe("")
                setRiskLevel("")
                setEndDate(undefined)
                setHighlights("")
              }}
            >
              Clear Form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
