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
import { Checkbox } from '@/components/ui/checkbox'
import type { RecommendationFormValues } from '@/pages/RecommendationsPage'

interface TcoSectionProps {
  form: UseFormReturn<RecommendationFormValues>
}

export function TcoSection({ form }: TcoSectionProps) {
  return (
    <div className="mt-2 space-y-4 pt-2 border-t">
      <div>
        <Label htmlFor="data_source_provider">Data source provider</Label>
        <Input
          id="data_source_provider"
          placeholder="e.g. gcp"
          {...form.register('data_source_provider')}
        />
      </div>
      <div>
        <Label htmlFor="data_source_region">Data source region</Label>
        <Input
          id="data_source_region"
          placeholder="e.g. us-central1"
          {...form.register('data_source_region')}
        />
      </div>
      <div>
        <Label htmlFor="estimated_egress_gb_per_hour">Egress (GB/hr)</Label>
        <Input
          id="estimated_egress_gb_per_hour"
          type="number"
          step={0.1}
          min={0}
          {...form.register('estimated_egress_gb_per_hour', { valueAsNumber: true })}
        />
      </div>
      <div>
        <Label htmlFor="min_storage_gb">Min storage (GB)</Label>
        <Input
          id="min_storage_gb"
          type="number"
          step={1}
          min={0}
          {...form.register('min_storage_gb', { valueAsNumber: true })}
        />
      </div>
      <div>
        <Label>Storage type</Label>
        <Select
          value={form.watch('storage_type') || 'ssd'}
          onValueChange={(v) => form.setValue('storage_type', v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ssd">SSD</SelectItem>
            <SelectItem value="hdd">HDD</SelectItem>
            <SelectItem value="balanced">Balanced</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="include_public_ip"
          checked={form.watch('include_public_ip') ?? false}
          onCheckedChange={(c) => form.setValue('include_public_ip', !!c)}
        />
        <Label htmlFor="include_public_ip" className="text-sm font-normal">
          Include public IP
        </Label>
      </div>
      <div>
        <Label>OS type</Label>
        <Select
          value={form.watch('os_type') || 'linux'}
          onValueChange={(v) => form.setValue('os_type', v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linux">Linux</SelectItem>
            <SelectItem value="windows">Windows</SelectItem>
            <SelectItem value="rhel">RHEL</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="max_tco_eur_per_hour">Max TCO (EUR/hr)</Label>
        <Input
          id="max_tco_eur_per_hour"
          type="number"
          step={0.01}
          min={0}
          {...form.register('max_tco_eur_per_hour', { valueAsNumber: true })}
        />
      </div>
    </div>
  )
}
