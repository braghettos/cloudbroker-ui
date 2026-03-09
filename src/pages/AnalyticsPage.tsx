import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PriceChangesTable } from '@/components/features/analytics/PriceChangesTable'
import { TrendChart } from '@/components/features/analytics/TrendChart'
import { ProviderPriceBar } from '@/components/features/analytics/ProviderPriceBar'
import { ProviderRadar } from '@/components/features/analytics/ProviderRadar'

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Price Analytics</h1>
        <p className="text-muted-foreground">
          Track price changes, trends, and compare providers.
        </p>
      </div>

      <Tabs defaultValue="changes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="changes">Price Changes</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="comparison">Provider Comparison</TabsTrigger>
          <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
        </TabsList>
        <TabsContent value="changes">
          <PriceChangesTable />
        </TabsContent>
        <TabsContent value="trends">
          <TrendChart />
        </TabsContent>
        <TabsContent value="comparison">
          <ProviderPriceBar />
        </TabsContent>
        <TabsContent value="scorecard">
          <ProviderRadar />
        </TabsContent>
      </Tabs>
    </div>
  )
}
