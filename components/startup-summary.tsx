import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Startup } from "@/lib/mock-data"

interface StartupSummaryProps {
  startup: Startup
}

export function StartupSummary({ startup }: StartupSummaryProps) {
  // Mock investors data
  const mockInvestors = ["Andreessen Horowitz", "Sequoia Capital", "Y Combinator", "Accel Partners"]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            {startup.name} is revolutionizing the {startup.sector[0].toLowerCase()} space with innovative solutions.
            Founded in {startup.foundedYear}, the company has quickly established itself as a leader in{" "}
            {startup.oneLiner.toLowerCase()}. With a team of {startup.employees.split("-")[0]}+ talented individuals,{" "}
            {startup.name} is building the future of technology and creating value for customers worldwide.
          </p>

          <div className="space-y-2">
            <h4 className="font-semibold">Key Focus Areas:</h4>
            <div className="flex flex-wrap gap-2">
              {startup.sector.map((sector) => (
                <Badge key={sector} variant="outline">
                  {sector}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Funding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Last Round</div>
            <div className="font-semibold">{startup.funding.lastRound}</div>
            <div className="text-sm text-muted-foreground">
              {new Date(startup.funding.lastRoundDate).toLocaleDateString()}
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Total Pool</div>
            <div className="font-mono font-bold text-lg">${(startup.funding.totalRaisedUSD / 1000000).toFixed(1)}M</div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-2">Notable Investors</div>
            <div className="space-y-1">
              {mockInvestors.slice(0, 3).map((investor) => (
                <Badge key={investor} variant="secondary" className="text-xs">
                  {investor}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
