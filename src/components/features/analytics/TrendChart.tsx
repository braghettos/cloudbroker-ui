import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPriceTrends } from '@/lib/api'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { formatPriceShort } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']

export function TrendChart() {
  const [purchaseModel, setPurchaseModel] = useState<string>('on_demand')
  const [trendDirection, setTrendDirection] = useState<string>('all')
  const [days, setDays] = useState(30)

  const { data, isLoading, error } = useQuery({
    queryKey: ['price-trends', purchaseModel, days],
    queryFn: () =>
      getPriceTrends({
        purchase_model: purchaseModel || undefined,
        days,
      }),
    refetchInterval: 60_000,
  })

  const trends = data?.trends ?? []
  const filtered =
    trendDirection === 'all'
      ? trends
      : trends.filter((t) => t.trend_direction === trendDirection)

  const chartData = filtered.slice(0, 10).map((t) => ({
    id: `${t.instance_type_id}-${t.region_id}`,
    name: `Instance ${t.instance_type_id}`,
    first: t.first_price ?? 0,
    latest: t.latest_price ?? 0,
    change: t.price_change_percent,
    direction: t.trend_direction,
  }))

  if (error) {
    return <p className="text-destructive">Failed to load trends.</p>
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
          <label className="text-sm font-medium mr-2">Trend</label>
          <Select value={trendDirection} onValueChange={setTrendDirection}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="increasing">Increasing</SelectItem>
              <SelectItem value="decreasing">Decreasing</SelectItem>
              <SelectItem value="stable">Stable</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mr-2">Days</label>
          <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7</SelectItem>
              <SelectItem value="14">14</SelectItem>
              <SelectItem value="30">30</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-80 w-full" />
      ) : chartData.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No trend data.</p>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={(v) => formatPriceShort(v)} tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(value: number) => [formatPriceShort(value), '']}
                labelFormatter={(_, payload) =>
                  payload[0]?.payload && `Δ ${(payload[0].payload as { change: number }).change.toFixed(2)}%`
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="first"
                name="First price"
                stroke={COLORS[0]}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="latest"
                name="Latest price"
                stroke={COLORS[1]}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
