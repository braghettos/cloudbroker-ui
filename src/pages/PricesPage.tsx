import { PricesTable } from '@/components/features/prices/PricesTable'

export function PricesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Prices</h1>
        <p className="text-muted-foreground">
          Browse instance prices across providers and regions.
        </p>
      </div>
      <PricesTable />
    </div>
  )
}
