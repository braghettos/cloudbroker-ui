import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getInstanceTypes, getPrices } from '@/lib/api'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPriceShort } from '@/lib/utils'
import type { InstanceType } from '@/types/api'

const MAX_VCPU = 64
const MAX_RAM = 256

const ALL = '__all__'

export function InstanceTable() {
  const [provider, setProvider] = useState<string>(ALL)
  const [minVcpu, setMinVcpu] = useState<number | ''>('')
  const [minRam, setMinRam] = useState<number | ''>('')
  const [arch, setArch] = useState<string>(ALL)
  const [offset, setOffset] = useState(0)
  const [selectedInstance, setSelectedInstance] = useState<InstanceType | null>(null)

  const limit = 20

  const { data: providersData } = useQuery({
    queryKey: ['providers', { limit: 100 }],
    queryFn: () => import('@/lib/api').then((m) => m.getProviders({ limit: 100 })),
  })
  const providers = providersData?.items ?? []

  const { data, isLoading, error } = useQuery({
    queryKey: ['instance-types', provider, minVcpu, minRam, arch, limit, offset],
    queryFn: () =>
      getInstanceTypes({
        provider: provider === ALL ? undefined : provider,
        min_vcpu: minVcpu === '' ? undefined : Number(minVcpu),
        min_ram_gb: minRam === '' ? undefined : Number(minRam),
        arch: arch === ALL ? undefined : arch,
        limit,
        offset,
      }),
  })

  const instances = data?.items ?? []
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

      {error && <p className="text-destructive">Failed to load instances.</p>}

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <div className="rounded-md border overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Provider</th>
                <th className="text-left p-2">vCPU</th>
                <th className="text-left p-2">RAM</th>
                <th className="text-left p-2">Arch</th>
              </tr>
            </thead>
            <tbody>
              {instances.map((inst) => (
                <tr
                  key={inst.id}
                  className="border-t cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedInstance(inst)}
                >
                  <td className="p-2 font-medium">{inst.name}</td>
                  <td className="p-2">
                    {providers.find((p) => p.id === inst.provider_id)?.slug ?? inst.provider_id}
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded overflow-hidden">
                        <div
                          className="h-full bg-primary rounded"
                          style={{ width: `${Math.min(100, (inst.vcpu / MAX_VCPU) * 100)}%` }}
                        />
                      </div>
                      {inst.vcpu}
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded overflow-hidden">
                        <div
                          className="h-full bg-primary rounded"
                          style={{ width: `${Math.min(100, (inst.ram_gb / MAX_RAM) * 100)}%` }}
                        />
                      </div>
                      {inst.ram_gb}
                    </div>
                  </td>
                  <td className="p-2">{inst.arch ?? '-'}</td>
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

      <InstancePriceSheet
        instance={selectedInstance}
        open={!!selectedInstance}
        onClose={() => setSelectedInstance(null)}
      />
    </div>
  )
}

function InstancePriceSheet({
  instance,
  open,
  onClose,
}: {
  instance: InstanceType | null
  open: boolean
  onClose: () => void
}) {
  const { data: pricesData } = useQuery({
    queryKey: ['prices', instance?.id, instance?.vcpu, instance?.ram_gb, instance?.arch],
    queryFn: () =>
      getPrices({
        min_vcpu: instance!.vcpu,
        min_ram_gb: instance!.ram_gb,
        arch: instance!.arch ?? undefined,
        limit: 100,
      }),
    enabled: open && !!instance,
  })

  const allPrices = pricesData?.items ?? []
  const prices = instance ? allPrices.filter((p) => p.instance_type_id === instance.id) : []

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{instance?.name ?? 'Prices'}</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          {instance && (
            <p className="text-sm text-muted-foreground mb-4">
              {instance.vcpu} vCPU · {instance.ram_gb} GB · {instance.arch ?? 'any'}
            </p>
          )}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {prices.map((p) => (
              <div key={p.id} className="flex justify-between text-sm py-1 border-b">
                <span>{p.purchase_model}</span>
                <span>{formatPriceShort(p.price_per_hour)}/hr ({p.currency})</span>
              </div>
            ))}
          </div>
          {prices.length === 0 && !pricesData && open && (
            <p className="text-muted-foreground">Loading prices...</p>
          )}
          {prices.length === 0 && pricesData && (
            <p className="text-muted-foreground">No prices found.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

