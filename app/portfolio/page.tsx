import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MyAssetsOverview } from "@/components/my-assets-overview"
import { MyAssetsTabs } from "@/components/my-assets-tabs"
import { WatchlistSidebar } from "@/components/watchlist-sidebar"

export default function PortfolioPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container px-4 py-6">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My assets</h1>
              <p className="text-muted-foreground mt-2">Track your investments, performance, and watchlist</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-8">
                <MyAssetsOverview />
                <MyAssetsTabs />
              </div>
              <div className="lg:col-span-1">
                <WatchlistSidebar />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
