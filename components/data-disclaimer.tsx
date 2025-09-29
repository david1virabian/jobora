import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function DataDisclaimer() {
  return (
    <Alert className="border-muted-foreground/20 bg-muted/30">
      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
      <AlertDescription className="text-sm text-muted-foreground">
        <strong>Data Notice:</strong> Profile information, metrics, and company details shown are mock data for
        demonstration purposes. In a production environment, this would be replaced with real data from Crunchbase API
        and other verified sources.
      </AlertDescription>
    </Alert>
  )
}
