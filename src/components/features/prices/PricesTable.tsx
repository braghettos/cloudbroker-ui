import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPrices, getProviders } from '@/lib/api'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatPriceShort } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

const ALL = '__all__'

export function PricesTable() {
  const [provider, setProvider] = useState<string>(ALL)
  const [region, setRegion] = useState<string>('')
  const [minVcpu, setMinVcpu] = useState<number | ''>('')
  const [minRam, setMinRam] = useState<number | ''>('')
  const [arch, setArch] = useState<string>(ALL)
  const [offset, setOffset] = useState(0)
  const limit = 20

  const { data: providersData } = useQuery({
    queryKey: ['providers', { limit: 100 }],
    queryFn: () => getProviders({ limit: 100 }),
  })
  const providers = providersData?.items ?? []

  const { data, isLoading, error } = useQuery({
    queryKey: ['prices', provider, region, minVcpu, minRam, arch, limit, offset],
    queryFn: () =>
      getPrices({
        provider: provider === ALL ? undefined : provider,
        region: region || undefined,
        min_vcpu: minVcpu === '' ? undefined : Number(minVcpu),
        min_ram_gb: minRam === '' ? undefined : Number(minRam),
        arch: arch === ALL ? undefined : arch,
        limit,
        offset: offset ?? 0,
      }),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  })

  const prices = data?.items ?? []
  const total = data?.total ?? 0

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div>
          <Label>Provider</Label>
          <Select value={provider} onValueChange={(v) => { setProvider(v); setOffset(0) }}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All</SelectItem>
              {providers.map((p) => (
                <SelectItem key={p.id} value={p.slug}>
                  {p.slug}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Region</Label>
          <Input
            placeholder="slug"
            value={region}
            onChange={(e) => { setRegion(e.target.value); setOffset(0) }}
            className="w-32"
          />
        </div>
        <div>
          <Label>Min vCPU</Label>
          <Input
            type="number"
            min={1}
            placeholder="Any"
            value={minVcpu}
            onChange={(e) => { setMinVcpu(e.target.value === '' ? '' : Number(e.target.value)); setOffset(0) }}
            className="w-24"
          />
        </div>
        <div>
          <Label>Min RAM (GB)</Label>
          <Input
            type="number"
            step={0.5}
            min={0.5}
            placeholder="Any"
            value={minRam}
            onChange={(e) => { setMinRam(e.target.value === '' ? '' : Number(e.target.value)); setOffset(0) }}
            className="w-24"
          />
        </div>
        <div>
          <Label>Arch</Label>
          <Select value={arch} onValueChange={(v) => { setArch(v); setOffset(0) }}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All</SelectItem>
              <SelectItem value="x86_64">x86_64</SelectItem>
              <SelectItem value="arm64">arm64</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && <p className="text-destructive">Failed to load prices.</p>}

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <div className="rounded-md border overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-2">Instance ID</th>
                <th className="text-left p-2">Region ID</th>
                <th className="text-left p-2">Model</th>
                <th className="text-left p-2">Price/hr</th>
                <th className="text-left p-2">Currency</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-2">{p.instance_type_id}</td>
                  <td className="p-2">{p.region_id}</td>
                  <td className="p-2">{p.purchase_model}</td>
                  <td className="p-2">{formatPriceShort(p.price_per_hour)}</td>
                  <td className="p-2">{p.currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {total} total
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOffset((o) => Math.max(0, o - limit))}
            disabled={offset === 0}
            className="text-sm px-2 py-1 rounded border disabled:opacity-50"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => setOffset((o) => o + limit)}
            disabled={offset + limit >= total}
            className="text-sm px-2 py-1 rounded border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
