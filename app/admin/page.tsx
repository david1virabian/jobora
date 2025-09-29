import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container px-4 py-6">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-2">Manage investment opportunities and platform content</p>
            </div>

            <Alert className="border-accent/20 bg-accent/5">
              <Shield className="h-4 w-4 text-accent" />
              <AlertDescription className="text-sm">
                <strong>Admin Access:</strong> This is a demonstration admin interface. In production, this would be
                protected by authentication and authorization.
              </AlertDescription>
            </Alert>

            <AdminDashboard />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
