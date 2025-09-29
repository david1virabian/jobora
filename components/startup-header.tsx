import { ExternalLink, MapPin, Calendar, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Startup } from "@/lib/mock-data"

interface StartupHeaderProps {
  startup: Startup
}

export function StartupHeader({ startup }: StartupHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={startup.logoUrl || "/placeholder.svg"} alt={startup.name} />
          <AvatarFallback className="text-2xl bg-white text-foreground">
            {startup.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{startup.name}</h1>
            <p className="text-lg text-muted-foreground mt-1">{startup.oneLiner}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {startup.sector.map((sector) => (
              <Badge key={sector} variant="secondary">
                {sector}
              </Badge>
            ))}
            <Badge variant="outline">{startup.stage}</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{startup.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Founded {startup.foundedYear}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{startup.employees} employees</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" asChild>
            <a href={startup.website} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Website
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
