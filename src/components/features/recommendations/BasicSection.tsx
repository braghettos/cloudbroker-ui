import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { RecommendationFormValues } from '@/pages/RecommendationsPage'
import { formatPriceShort } from '@/lib/utils'

interface BasicSectionProps {
  form: UseFormReturn<RecommendationFormValues>
}

export function BasicSection({ form }: BasicSectionProps) {
  const maxPrice = form.watch('max_price_eur_per_hour')
  const monthlyEstimate = maxPrice ? maxPrice * 720 : 0

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="min_vcpu">Min vCPU</Label>
          <Input
            id="min_vcpu"
            type="number"
            min={1}
            {...form.register('min_vcpu', { valueAsNumber: true })}
          />
          {form.formState.errors.min_vcpu && (
            <p className="text-xs text-destructive mt-1">
              {form.formState.errors.min_vcpu.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="min_ram_gb">Min RAM (GB)</Label>
          <Input
            id="min_ram_gb"
            type="number"
            step={0.5}
            min={0.5}
            {...form.register('min_ram_gb', { valueAsNumber: true })}
          />
          {form.formState.errors.min_ram_gb && (
            <p className="text-xs text-destructive mt-1">
              {form.formState.errors.min_ram_gb.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label>Architecture</Label>
        <Select
          value={form.watch('arch')}
          onValueChange={(v) => form.setValue('arch', v as RecommendationFormValues['arch'])}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="x86_64">x86_64</SelectItem>
            <SelectItem value="amd64">amd64</SelectItem>
            <SelectItem value="arm64">arm64</SelectItem>
            <SelectItem value="aarch64">aarch64</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="max_price_eur_per_hour">Max price (EUR/hr)</Label>
        <Input
          id="max_price_eur_per_hour"
          type="number"
          step={0.01}
          min={0}
          {...form.register('max_price_eur_per_hour', { valueAsNumber: true })}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Up to {formatPriceShort(monthlyEstimate)}/mo
        </p>
        {form.formState.errors.max_price_eur_per_hour && (
          <p className="text-xs text-destructive mt-1">
            {form.formState.errors.max_price_eur_per_hour.message}
          </p>
        )}
      </div>

      <div>
        <Label>Purchase model</Label>
        <Select
          value={form.watch('purchase_model') || 'on_demand'}
          onValueChange={(v) => form.setValue('purchase_model', v)}
        >
          <SelectTrigger>
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
        <Label>Region constraint</Label>
        <Select
          value={form.watch('region_constraint') || 'ANY'}
          onValueChange={(v) => form.setValue('region_constraint', v as 'EU' | 'ANY')}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ANY">Any</SelectItem>
            <SelectItem value="EU">EU only</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
