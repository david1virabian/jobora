"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const SearchIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

const FilterIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
  </svg>
)

const XIcon = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

export interface FilterState {
  search: string
  sector: string[]
  stage: string[]
  region: string[]
  timeframe: string
  activity: string
}

interface FilterBarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

const SECTORS = ["AI", "Fintech", "Climate", "SaaS", "Health", "DevTools", "Energy"]
const STAGES = ["Pre-seed", "Seed", "Series A", "Series B", "Series C", "Series D"]
const REGIONS = ["San Francisco, US", "New York, US", "London, UK", "Berlin, Germany", "Singapore", "Toronto, Canada"]
const TIMEFRAMES = ["All time", "Next 30 days", "Next 90 days", "Next 6 months", "Next year"]
const ACTIVITIES = ["Most active", "Recently created", "Ending soon", "High volume"]

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const updateFilters = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (key: "sector" | "stage" | "region", value: string) => {
    const currentArray = filters[key]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
    updateFilters(key, newArray)
  }

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      sector: [],
      stage: [],
      region: [],
      timeframe: "All time",
      activity: "Most active",
    })
  }

  const activeFilterCount =
    filters.sector.length +
    filters.stage.length +
    filters.region.length +
    (filters.timeframe !== "All time" ? 1 : 0) +
    (filters.activity !== "Most active" ? 1 : 0)

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <SearchIcon />
          </div>
          <Input
            placeholder="Search startups or forecasts..."
            value={filters.search}
            onChange={(e) => updateFilters("search", e.target.value)}
            className="pl-10"
          />
        </div>

        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative bg-transparent">
              <div className="mr-2">
                <FilterIcon />
              </div>
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              </div>

              {/* Sector Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Sector</label>
                <div className="flex flex-wrap gap-2">
                  {SECTORS.map((sector) => (
                    <Badge
                      key={sector}
                      variant={filters.sector.includes(sector) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayFilter("sector", sector)}
                    >
                      {sector}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stage Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Stage</label>
                <div className="flex flex-wrap gap-2">
                  {STAGES.map((stage) => (
                    <Badge
                      key={stage}
                      variant={filters.stage.includes(stage) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayFilter("stage", stage)}
                    >
                      {stage}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Region Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Region</label>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map((region) => (
                    <Badge
                      key={region}
                      variant={filters.region.includes(region) ? "default" : "outline"}
                      className="cursor-pointer text-xs"
                      onClick={() => toggleArrayFilter("region", region)}
                    >
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Timeframe and Activity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Timeframe</label>
                  <Select value={filters.timeframe} onValueChange={(value) => updateFilters("timeframe", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEFRAMES.map((timeframe) => (
                        <SelectItem key={timeframe} value={timeframe}>
                          {timeframe}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Activity</label>
                  <Select value={filters.activity} onValueChange={(value) => updateFilters("activity", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIVITIES.map((activity) => (
                        <SelectItem key={activity} value={activity}>
                          {activity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.sector.map((sector) => (
            <Badge key={sector} variant="secondary" className="gap-1">
              {sector}
              <div className="cursor-pointer" onClick={() => toggleArrayFilter("sector", sector)}>
                <XIcon />
              </div>
            </Badge>
          ))}
          {filters.stage.map((stage) => (
            <Badge key={stage} variant="secondary" className="gap-1">
              {stage}
              <div className="cursor-pointer" onClick={() => toggleArrayFilter("stage", stage)}>
                <XIcon />
              </div>
            </Badge>
          ))}
          {filters.region.map((region) => (
            <Badge key={region} variant="secondary" className="gap-1">
              {region.split(",")[0]}
              <div className="cursor-pointer" onClick={() => toggleArrayFilter("region", region)}>
                <XIcon />
              </div>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
