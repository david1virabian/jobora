"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateInvestmentForm } from "@/components/create-investment-form"
import { ManageInvestments } from "@/components/manage-investments"
import { AdminStats } from "@/components/admin-stats"

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      <AdminStats />

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList>
          <TabsTrigger value="create">Create Investment</TabsTrigger>
          <TabsTrigger value="manage">Manage Investments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <CreateInvestmentForm />
        </TabsContent>

        <TabsContent value="manage">
          <ManageInvestments />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Analytics dashboard would be implemented here</p>
            <p className="text-sm text-muted-foreground mt-1">
              Charts showing investor engagement, investment performance, and platform metrics
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
