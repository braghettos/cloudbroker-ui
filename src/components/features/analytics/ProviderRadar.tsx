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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']

export function ProviderRadar() {
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
        max_price_eur_per_hour: 1,
        purchase_model: purchaseModel,
        limit: 50,
        cost_weight: 0.4,
        performance_weight: 0.3,
        reliability_weight: 0.3,
      }),
  })

  const byProvider =
    mutation.data?.recommendations?.reduce<
      Record<
        string,
        { cost: number[]; perf: number[]; rel: number[] }
      >
    >((acc, r) => {
      const slug = r.provider_slug
      if (!acc[slug]) acc[slug] = { cost: [], perf: [], rel: [] }
      acc[slug].cost.push(r.explain.normalized_price)
      acc[slug].perf.push(r.explain.performance_score ?? r.explain.resource_fit)
      acc[slug].rel.push(r.explain.reliability_score ?? 0.5)
      return acc
    }, {}) ?? {}

  const series = Object.entries(byProvider).map(([slug, v], i) => ({
    slug,
    color: COLORS[i % COLORS.length],
    Cost: v.cost.length ? v.cost.reduce((a, b) => a + b, 0) / v.cost.length : 0,
    Performance: v.perf.length ? v.perf.reduce((a, b) => a + b, 0) / v.perf.length : 0,
    Reliability: v.rel.length ? v.rel.reduce((a, b) => a + b, 0) / v.rel.length : 0,
  }))

  const radarData = [
    { subject: 'Cost', fullMark: 1, ...Object.fromEntries(series.map((s) => [s.slug, s.Cost])) },
    { subject: 'Performance', fullMark: 1, ...Object.fromEntries(series.map((s) => [s.slug, s.Performance])) },
    { subject: 'Reliability', fullMark: 1, ...Object.fromEntries(series.map((s) => [s.slug, s.Reliability])) },
  ]

  const bestProvider = series.length
    ? series.reduce((a, b) =>
        a.Cost + a.Performance + a.Reliability >
        b.Cost + b.Performance + b.Reliability
          ? a
          : b
      )
    : null

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
          {mutation.isPending ? 'Loading...' : 'Load Scorecard'}
        </Button>
      </div>

      {bestProvider && (
        <Card>
          <CardHeader>
            <CardTitle>Best provider</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{bestProvider.slug}</p>
            <p className="text-sm text-muted-foreground">
              Cost: {(bestProvider.Cost * 100).toFixed(0)}% · Perf:{(bestProvider.Performance * 100).toFixed(0)}% · Rel: {(bestProvider.Reliability * 100).toFixed(0)}%
            </p>
          </CardContent>
        </Card>
      )}

      {mutation.isPending && (
        <div className="h-80 rounded-md border flex items-center justify-center text-muted-foreground">
          Loading...
        </div>
      )}
      {mutation.isSuccess && series.length === 0 && (
        <p className="text-muted-foreground">No results for this spec.</p>
      )}
      {mutation.isSuccess && series.length > 0 && radarData.length > 0 && (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 1]} />
              {series.map((s) => (
                <Radar
                  key={s.slug}
                  name={s.slug}
                  dataKey={s.slug}
                  stroke={s.color}
                  fill={s.color}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              ))}
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
