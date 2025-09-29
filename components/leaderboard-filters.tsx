"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function LeaderboardFilters({
  onCategoryChange,
  onTimeFilterChange,
}: {
  onCategoryChange?: (category: string) => void
  onTimeFilterChange?: (timeFilter: string) => void
}) {
  const [timeFilter, setTimeFilter] = useState("all-time")
  const [category, setCategory] = useState("participation")

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory)
    onCategoryChange?.(newCategory)
  }

  const handleTimeFilterChange = (newTimeFilter: string) => {
    setTimeFilter(newTimeFilter)
    onTimeFilterChange?.(newTimeFilter)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <Tabs value={category} onValueChange={handleCategoryChange}>
        <TabsList>
          <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
          <TabsTrigger value="participation">Participation</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
      </Tabs>

      <Select value={timeFilter} onValueChange={handleTimeFilterChange}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-time">All Time</SelectItem>
          <SelectItem value="this-month">This Month</SelectItem>
          <SelectItem value="this-week">This Week</SelectItem>
          <SelectItem value="today">Today</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
