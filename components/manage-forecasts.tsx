"use client"

import { useState } from "react"
import { MoreHorizontal, Eye, Archive, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { mockForecasts, mockStartups } from "@/lib/mock-data"

export function ManageForecasts() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  const getStartupById = (id: string) => {
    return mockStartups.find((s) => s.id === id)
  }

  const handleAction = (action: string, forecastId: string, question: string) => {
    toast({
      title: `Demo action: ${action}`,
      description: `Action "${action}" performed on forecast: "${question.slice(0, 50)}..."`,
    })
  }

  const filteredForecasts = mockForecasts.filter((forecast) => {
    const startup = getStartupById(forecast.startupId)
    const matchesSearch =
      forecast.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup?.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || forecast.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Forecasts</CardTitle>
        <p className="text-sm text-muted-foreground">View, edit, and manage all platform forecasts</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search forecasts or startups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Forecasts Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Forecast</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>YES/NO</TableHead>
                  <TableHead>Resolution Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredForecasts.map((forecast) => {
                  const startup = getStartupById(forecast.startupId)
                  const resolutionDate = new Date(forecast.resolutionDate)
                  const daysUntilResolution = Math.ceil((resolutionDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

                  return (
                    <TableRow key={forecast.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={startup?.logoUrl || "/placeholder.svg"} alt={startup?.name} />
                            <AvatarFallback>{startup?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{startup?.name}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-64">{forecast.question}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={forecast.status === "active" ? "default" : "secondary"}>
                          {forecast.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{forecast.participation.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm" style={{ color: "var(--yes-soft)" }}>
                            {forecast.yesPct}%
                          </span>
                          <span className="text-muted-foreground">/</span>
                          <span className="font-mono text-sm" style={{ color: "var(--no-soft)" }}>
                            {forecast.noPct}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {resolutionDate.toLocaleDateString()}
                          <div className="text-xs text-muted-foreground">
                            {daysUntilResolution > 0 ? `${daysUntilResolution}d left` : "Ended"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleAction("View", forecast.id, forecast.question)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("Edit", forecast.id, forecast.question)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("Archive", forecast.id, forecast.question)}>
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction("Delete", forecast.id, forecast.question)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {filteredForecasts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No forecasts match your current filters</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
