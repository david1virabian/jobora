import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { StartupHeader } from "@/components/startup-header"
import { StartupSummary } from "@/components/startup-summary"
import { StartupMetrics } from "@/components/startup-metrics"
import { StartupInvestments } from "@/components/startup-investments"
import { StartupAbout } from "@/components/startup-about"
import { DataDisclaimer } from "@/components/data-disclaimer"
import { mockStartups, mockForecasts as mockInvestments } from "@/lib/mock-data"

interface StartupPageProps {
  params: {
    id: string
  }
}

export default function StartupPage({ params }: StartupPageProps) {
  const startup = mockStartups.find((s) => s.id === params.id)

  if (!startup) {
    notFound()
  }

  const startupInvestments = mockInvestments.filter((inv) => inv.startupId === startup.id)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container px-4 py-6">
          <div className="space-y-8">
            <StartupHeader startup={startup} />
            <StartupSummary startup={startup} />
            <StartupMetrics startup={startup} />
            <StartupInvestments startup={startup} investments={startupInvestments} />
            <StartupAbout startup={startup} />
            <DataDisclaimer />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export async function generateStaticParams() {
  return mockStartups.map((startup) => ({
    id: startup.id,
  }))
}
