import { TrendingUp, Users, Briefcase } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Startup } from "@/lib/mock-data"

interface StartupMetricsProps {
  startup: Startup
}

export function StartupMetrics({ startup }: StartupMetricsProps) {
  // Mock metrics data
  const mockMetrics = {
    webTraffic: {
      value: "2.4M",
      change: "+12.5%",
      trend: "up" as const,
    },
    socialFollowers: {
      value: "45.2K",
      change: "+8.3%",
      trend: "up" as const,
    },
    hiring: {
      value: "23",
      change: "+15.0%",
      trend: "up" as const,
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Metrics</CardTitle>
        <p className="text-sm text-muted-foreground">Growth indicators and engagement metrics (mock data)</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Monthly Web Traffic</div>
              <div className="font-mono font-bold text-lg">{mockMetrics.webTraffic.value}</div>
              <div className="text-sm text-success">{mockMetrics.webTraffic.change} vs last month</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Users className="h-5 w-5 text-accent" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Social Followers</div>
              <div className="font-mono font-bold text-lg">{mockMetrics.socialFollowers.value}</div>
              <div className="text-sm text-success">{mockMetrics.socialFollowers.change} vs last month</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-chart-3 rounded-lg">
              <Briefcase className="h-5 w-5 text-chart-4" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Open Positions</div>
              <div className="font-mono font-bold text-lg">{mockMetrics.hiring.value}</div>
              <div className="text-sm text-success">{mockMetrics.hiring.change} vs last month</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
