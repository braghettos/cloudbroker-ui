import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { getRecommendations } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { formatPriceShort } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

export function ProviderPriceBar() {
  const [minVcpu, setMinVcpu] = useState(2)
  const [minRam, setMinRam] = useState(4)
  const [arch, setArch] = useState('x86_64')
  const [purchaseModel, setPurchaseModel] = useState('on_demand')

  const mutation = useMutation({
    mutationFn: () =>
      getRecommendations({
        min_vcpu: minVcpu,
        min_ram_gb: minRam,
        arch,
        max_price_eur_per_hour: 10,
        purchase_model: purchaseModel,
        limit: 100,
      }),
  })

  const byProvider =
    mutation.data?.recommendations?.reduce<
      Record<string, { min: number; avg: number; max: number; count: number; sum: number; cheapest: string }>
    >((acc, r) => {
      const slug = r.provider_slug
      const price = r.explain.price_eur_per_hour
      if (!acc[slug]) {
        acc[slug] = { min: price, max: price, avg: price, sum: price, count: 1, cheapest: r.instance_type_name }
      } else {
        acc[slug].min = Math.min(acc[slug].min, price)
        acc[slug].max = Math.max(acc[slug].max, price)
        acc[slug].sum += price
        acc[slug].count += 1
        acc[slug].avg = acc[slug].sum / acc[slug].count
        if (price <= acc[slug].min) acc[slug].cheapest = r.instance_type_name
      }
      return acc
    }, {}) ?? {}

  const chartData = Object.entries(byProvider)
    .map(([slug, v]) => ({
      slug,
      avg: v.sum / v.count,
      min: v.min,
      max: v.max,
      cheapest: v.cheapest,
    }))
    .sort((a, b) => a.avg - b.avg)

  const runQuery = () => mutation.mutate()

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <Label>Min vCPU</Label>
          <Input
            type="number"
            min={1}
            value={minVcpu}
            onChange={(e) => setMinVcpu(Number(e.target.value))}
            className="w-20"
          />
        </div>
        <div>
          <Label>Min RAM (GB)</Label>
          <Input
            type="number"
            step={0.5}
            min={0.5}
            value={minRam}
            onChange={(e) => setMinRam(Number(e.target.value))}
            className="w-20"
          />
        </div>
        <div>
          <Label>Arch</Label>
          <Select value={arch} onValueChange={setArch}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="x86_64">x86_64</SelectItem>
              <SelectItem value="arm64">arm64</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Purchase model</Label>
          <Select value={purchaseModel} onValueChange={setPurchaseModel}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="on_demand">On-demand</SelectItem>
              <SelectItem value="spot">Spot</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={runQuery} disabled={mutation.isPending}>
          {mutation.isPending ? 'Loading...' : 'Compare'}
        </Button>
      </div>

      {mutation.isPending && <Skeleton className="h-64 w-full" />}
      {mutation.isError && (
        <p className="text-destructive">Failed to load comparison.</p>
      )}
      {mutation.isSuccess && chartData.length === 0 && (
        <p className="text-muted-foreground">No results for this spec.</p>
      )}
      {mutation.isSuccess && chartData.length > 0 && (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 60 }} barCategoryGap="20%">
              <XAxis type="number" tickFormatter={(v) => formatPriceShort(v)} domain={['auto', 'auto']} />
              <YAxis type="category" dataKey="slug" width={60} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value: number) => [formatPriceShort(value), '']}
                content={({ active, payload }) =>
                  active && payload?.[0] && (
                    <div className="rounded-md border bg-background p-2 text-sm shadow">
                      <p className="font-medium">{payload[0].payload.slug}</p>
                      <p>Avg: {formatPriceShort(payload[0].payload.avg)}/hr</p>
                      <p>Min: {formatPriceShort(payload[0].payload.min)}/hr</p>
                      <p>Cheapest: {payload[0].payload.cheapest}</p>
                    </div>
                  )
                }
              />
              <Bar dataKey="avg" name="Avg EUR/hr" radius={[0, 4, 4, 0]} minPointSize={8}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
