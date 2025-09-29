"use client"

import type React from "react"

import { useState } from "react"
import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { mockStartups } from "@/lib/mock-data"

export function CreateForecastForm() {
  const [selectedStartup, setSelectedStartup] = useState("")
  const [question, setQuestion] = useState("")
  const [criteria, setCriteria] = useState("")
  const [resolutionDate, setResolutionDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedStartup || !question || !criteria || !resolutionDate) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Forecast created",
        description: `Demo forecast "${question}" has been created successfully.`,
      })

      // Reset form
      setSelectedStartup("")
      setQuestion("")
      setCriteria("")
      setResolutionDate(undefined)
      setIsSubmitting(false)
    }, 1000)
  }

  const suggestedQuestions = [
    "Will [Startup] raise a Series A by [Date]?",
    "Will [Startup] reach $1M ARR by [Date]?",
    "Will [Startup] launch their product by [Date]?",
    "Will [Startup] expand to international markets by [Date]?",
    "Will [Startup] achieve profitability by [Date]?",
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Forecast</CardTitle>
        <p className="text-sm text-muted-foreground">
          Add a new prediction market for startup milestones and achievements
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Startup Selection */}
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

          {/* Question */}
          <div className="space-y-2">
            <Label htmlFor="question">Forecast Question *</Label>
            <Textarea
              id="question"
              placeholder="e.g., Will NovaGraph raise a Series A by June 30, 2026?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-20"
            />
            <div className="text-xs text-muted-foreground">
              <p className="mb-2">Suggested question formats:</p>
              <ul className="space-y-1">
                {suggestedQuestions.map((suggestion, index) => (
                  <li key={index} className="text-xs">
                    • {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Resolution Criteria */}
          <div className="space-y-2">
            <Label htmlFor="criteria">Resolution Criteria *</Label>
            <Textarea
              id="criteria"
              placeholder="e.g., A priced equity round publicly reported by reputable sources (TechCrunch, VentureBeat, etc.) or official company announcement."
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              className="min-h-24"
            />
            <p className="text-xs text-muted-foreground">
              Be specific about how the forecast will be resolved. Include acceptable sources and edge cases.
            </p>
          </div>

          {/* Resolution Date */}
          <div className="space-y-2">
            <Label>Resolution Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !resolutionDate && "text-muted-foreground",
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {resolutionDate ? format(resolutionDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={resolutionDate}
                  onSelect={setResolutionDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              The date when this forecast will be resolved. Must be in the future.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Creating..." : "Create Forecast"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedStartup("")
                setQuestion("")
                setCriteria("")
                setResolutionDate(undefined)
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
