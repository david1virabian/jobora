"use client"

import { useState } from "react"
import { MoreHorizontal, Edit, Archive, Trash2, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { mockStartups, mockForecasts as mockInvestments } from "@/lib/mock-data"

export function ManageInvestments() {
  const [investments, setInvestments] = useState(mockInvestments)
  const { toast } = useToast()

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount.toLocaleString()}`
  }

  const getStartupById = (startupId: string) => {
    return mockStartups.find((s) => s.id === startupId)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "funded":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleAction = (action: string, investmentId: string, investmentTitle: string) => {
    switch (action) {
      case "edit":
        toast({
          title: "Edit opportunity",
          description: `Demo: Would open edit form for "${investmentTitle}"`,
        })
        break
      case "archive":
        setInvestments((prev) =>
          prev.map((inv) => (inv.id === investmentId ? { ...inv, status: "closed" as const } : inv)),
        )
        toast({
          title: "Opportunity archived",
          description: `"${investmentTitle}" has been archived.`,
        })
        break
      case "delete":
        setInvestments((prev) => prev.filter((inv) => inv.id !== investmentId))
        toast({
          title: "Opportunity deleted",
          description: `"${investmentTitle}" has been deleted.`,
          variant: "destructive",
        })
        break
      case "view":
        toast({
          title: "View opportunity",
          description: `Demo: Would open detailed view for "${investmentTitle}"`,
        })
        break
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Opportunities</CardTitle>
        <p className="text-sm text-muted-foreground">View, edit, and manage all opportunities on the platform</p>
      </CardHeader>
      <CardContent>
        {investments.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Opportunity</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Days Left</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investments.map((investment) => {
                  const startup = getStartupById(investment.startupId)
                  const progressPercentage = (investment.raisedAmount / investment.targetAmount) * 100

                  return (
                    <TableRow key={investment.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={startup?.logoUrl || "/placeholder.svg"} alt={startup?.name} />
                            <AvatarFallback>{startup?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{startup?.name}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-48">{investment.title}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{formatCurrency(investment.targetAmount)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Progress value={progressPercentage} className="w-16 h-2" />
                          <div className="text-xs text-muted-foreground">{Math.round(progressPercentage)}%</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-xs", getRiskColor(investment.riskLevel))}>
                          {investment.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-xs", getStatusColor(investment.status))}>
                          {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{investment.daysLeft}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleAction("view", investment.id, investment.title)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("edit", investment.id, investment.title)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("archive", investment.id, investment.title)}>
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction("delete", investment.id, investment.title)}
                              className="text-blue-600"
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
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No opportunities found</p>
            <p className="text-sm text-muted-foreground mt-1">Create your first opportunity to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
