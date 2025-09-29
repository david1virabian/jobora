import { MapPin, Newspaper, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Startup } from "@/lib/mock-data"

interface StartupAboutProps {
  startup: Startup
}

export function StartupAbout({ startup }: StartupAboutProps) {
  // Mock founders data
  const mockFounders = [
    {
      name: "Alex Chen",
      role: "CEO & Co-founder",
      avatar: "/placeholder.svg?key=founder1",
    },
    {
      name: "Sarah Johnson",
      role: "CTO & Co-founder",
      avatar: "/placeholder.svg?key=founder2",
    },
  ]

  // Mock news data
  const mockNews = [
    {
      title: `${startup.name} Announces Strategic Partnership`,
      date: "2024-12-15",
      source: "TechCrunch",
    },
    {
      title: `${startup.name} Expands to European Markets`,
      date: "2024-11-28",
      source: "VentureBeat",
    },
    {
      title: `${startup.name} Raises ${startup.funding.lastRound} Round`,
      date: startup.funding.lastRoundDate,
      source: "Forbes",
    },
  ]

  return (
    <Tabs defaultValue="team" className="space-y-4">
      <TabsList>
        <TabsTrigger value="team">Team</TabsTrigger>
        <TabsTrigger value="location">Location</TabsTrigger>
        <TabsTrigger value="news">News</TabsTrigger>
      </TabsList>

      <TabsContent value="team">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Leadership Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockFounders.map((founder) => (
                <div key={founder.name} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={founder.avatar || "/placeholder.svg"} alt={founder.name} />
                    <AvatarFallback>
                      {founder.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{founder.name}</div>
                    <div className="text-sm text-muted-foreground">{founder.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="location">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Headquarters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="font-semibold">{startup.location}</div>
                <div className="text-sm text-muted-foreground">Primary office location</div>
              </div>

              <div className="bg-muted/50 rounded-lg p-8 text-center">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Interactive map placeholder</p>
                <p className="text-xs text-muted-foreground mt-1">Map integration would show exact office location</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="news">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5" />
              Recent News
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockNews.map((article, index) => (
                <div key={index} className="border-l-2 border-primary/20 pl-4 py-2">
                  <h4 className="font-semibold text-sm">{article.title}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{new Date(article.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{article.source}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
