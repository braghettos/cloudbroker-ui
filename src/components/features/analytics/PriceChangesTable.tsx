import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPriceChanges } from '@/lib/api'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { formatPriceShort, formatPercent } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

const SINCE_OPTIONS = [1, 6, 24, 72] as const

export function PriceChangesTable() {
  const [purchaseModel, setPurchaseModel] = useState<string>('on_demand')
  const [sinceHours, setSinceHours] = useState<number>(24)

  const { data, isLoading, error } = useQuery({
    queryKey: ['price-changes', purchaseModel, sinceHours],
    queryFn: () =>
      getPriceChanges({
        purchase_model: purchaseModel || undefined,
        since_hours: sinceHours,
      }),
    refetchInterval: 60_000,
  })

  const changes = data?.changes ?? []

  if (error) {
    return <p className="text-destructive">Failed to load price changes.</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="text-sm font-medium mr-2">Purchase model</label>
          <Select value={purchaseModel} onValueChange={setPurchaseModel}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="on_demand">On-demand</SelectItem>
              <SelectItem value="spot">Spot</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mr-2">Since (hours)</label>
          <Select
            value={String(sinceHours)}
            onValueChange={(v) => setSinceHours(Number(v))}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SINCE_OPTIONS.map((h) => (
                <SelectItem key={h} value={String(h)}>
                  {h}h
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="rounded-md border overflow-auto max-h-96">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 sticky top-0">
              <tr>
                <th className="text-left p-2">Instance</th>
                <th className="text-left p-2">Region</th>
                <th className="text-left p-2">Old</th>
                <th className="text-left p-2">New</th>
                <th className="text-left p-2">Change</th>
              </tr>
            </thead>
            <tbody>
              {changes
                .sort((a, b) => Math.abs(b.price_change_percent) - Math.abs(a.price_change_percent))
                .map((c) => (
                  <tr key={`${c.instance_type_id}-${c.region_id}`} className="border-t">
                    <td className="p-2">{c.instance_type_name}</td>
                    <td className="p-2">{c.region_slug}</td>
                    <td className="p-2">
                      {c.old_price_eur_per_hour != null
                        ? formatPriceShort(c.old_price_eur_per_hour)
                        : '-'}
                    </td>
                    <td className="p-2">
                      {c.new_price_eur_per_hour != null
                        ? formatPriceShort(c.new_price_eur_per_hour)
                        : '-'}
                    </td>
                    <td className="p-2">
                      <Badge
                        variant={
                          c.price_change_percent < 0 ? 'success' : c.price_change_percent > 0 ? 'destructive' : 'secondary'
                        }
                      >
                        {formatPercent(c.price_change_percent)}
                      </Badge>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      {!isLoading && changes.length === 0 && (
        <p className="text-muted-foreground text-center py-8">No price changes in this period.</p>
      )}
    </div>
  )
}
