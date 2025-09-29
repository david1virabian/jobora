"use client"

import { Trophy, Medal, Award, TrendingUp, MessageSquare, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

interface LeaderboardTableProps {
  category?: string
}

export function LeaderboardTable({ category = "participation" }: LeaderboardTableProps) {
  // Mock leaderboard data
  const baseUsers = [
    {
      username: "PredictionMaster",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      badge: "Expert",
    },
    {
      username: "StartupGuru",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b780?w=150&h=150&fit=crop&crop=face",
      badge: "Pro",
    },
    {
      username: "TechOracle",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      badge: "Expert",
    },
    {
      username: "VCInsider",
      avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
      badge: "Pro",
    },
    {
      username: "FutureSeeker",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      badge: "Advanced",
    },
    {
      username: "DataDriven",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      badge: "Advanced",
    },
    {
      username: "MarketMind",
      avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
      badge: "Advanced",
    },
    {
      username: "TrendSpotter",
      avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
      badge: "Intermediate",
    },
  ]

  const getLeaderboardData = () => {
    switch (category) {
      case "accuracy":
        return baseUsers.map((user, index) => ({
          rank: index + 1,
          ...user,
          accuracy: [92.3, 89.7, 87.1, 85.4, 83.8, 81.2, 79.6, 77.9][index],
          totalPredictions: [89, 124, 156, 203, 167, 145, 178, 123][index],
          points: [3124, 2987, 2847, 2634, 2456, 2289, 2156, 2034][index],
          streak: [18, 14, 12, 8, 15, 5, 7, 3][index],
        }))

      case "participation":
        return baseUsers.map((user, index) => ({
          rank: index + 1,
          ...user,
          accuracy: [87.5, 84.2, 82.1, 79.8, 78.3, 76.9, 75.4, 74.1][index],
          totalPredictions: [156, 203, 189, 134, 167, 145, 178, 123][index],
          points: [2847, 2634, 2456, 2289, 2156, 2034, 1923, 1834][index],
          streak: [12, 8, 15, 5, 7, 3, 9, 4][index],
        }))

      case "activity":
        return baseUsers.map((user, index) => ({
          rank: index + 1,
          ...user,
          accuracy: [84.7, 88.1, 79.3, 91.2, 76.8, 82.4, 85.9, 78.5][index],
          totalPredictions: [234, 189, 267, 156, 298, 201, 178, 245][index],
          points: [3456, 3201, 2987, 2834, 2678, 2456, 2234, 2123][index],
          streak: [21, 16, 11, 19, 8, 13, 6, 14][index],
          dailyActivity: [47, 42, 38, 35, 33, 29, 26, 24][index],
          commentsCount: [89, 76, 102, 67, 134, 58, 91, 73][index],
        }))

      default:
        return []
    }
  }

  const mockLeaders = getLeaderboardData()

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-warning" />
      case 2:
        return <Medal className="h-5 w-5 text-muted-foreground" />
      case 3:
        return <Award className="h-5 w-5 text-warning" />
      default:
        return <span className="text-muted-foreground font-mono">#{rank}</span>
    }
  }

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case "Expert":
        return "default"
      case "Pro":
        return "secondary"
      case "Advanced":
        return "outline"
      default:
        return "outline"
    }
  }

  const getTableHeaders = () => {
    const baseHeaders = ["Rank", "User", "Accuracy", "Predictions", "Points", "Streak", "Badge"]

    if (category === "activity") {
      return ["Rank", "User", "Daily Activity", "Comments", "Points", "Streak", "Badge"]
    }

    return baseHeaders
  }

  const renderTableCell = (leader: any, header: string) => {
    switch (header) {
      case "Daily Activity":
        return (
          <div className="flex items-center space-x-2">
            <Zap className="h-3 w-3 text-warning" />
            <span className="font-mono font-bold text-primary">{leader.dailyActivity}</span>
          </div>
        )
      case "Comments":
        return (
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-3 w-3 text-primary" />
            <span className="font-mono">{leader.commentsCount}</span>
          </div>
        )
      case "Accuracy":
        return (
          <div className="flex items-center space-x-2">
            <span className="font-mono font-bold text-primary">{leader.accuracy}%</span>
            <TrendingUp className="h-3 w-3 text-success" />
          </div>
        )
      case "Predictions":
        return <span className="font-mono">{leader.totalPredictions}</span>
      case "Points":
        return <span className="font-mono font-semibold">{leader.points.toLocaleString()}</span>
      case "Streak":
        return (
          <div className="flex items-center space-x-1">
            <span className="font-mono">{leader.streak}</span>
            <span className="text-xs text-muted-foreground">days</span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Forecasters</CardTitle>
        <p className="text-sm text-muted-foreground">
          {category === "accuracy" && "Ranked by prediction accuracy and success rate"}
          {category === "participation" && "Ranked by prediction accuracy and community contribution"}
          {category === "activity" && "Ranked by daily engagement and community interaction"}
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {getTableHeaders().map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLeaders.map((leader) => (
                <TableRow key={leader.rank} className="transition-colors">
                  <TableCell>
                    <div className="flex items-center justify-center w-8">{getRankIcon(leader.rank)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={leader.avatar || "/placeholder.svg"} alt={leader.username} />
                        <AvatarFallback>{leader.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <Link
                        href={`/forecaster/${leader.username}`}
                        className="font-medium hover:text-primary transition-colors cursor-pointer"
                      >
                        {leader.username}
                      </Link>
                    </div>
                  </TableCell>
                  {getTableHeaders()
                    .slice(2, -1)
                    .map((header) => (
                      <TableCell key={header}>{renderTableCell(leader, header)}</TableCell>
                    ))}
                  <TableCell>
                    <Badge variant={getBadgeVariant(leader.badge)}>{leader.badge}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Rankings update daily based on prediction accuracy and community engagement</p>
        </div>
      </CardContent>
    </Card>
  )
}
