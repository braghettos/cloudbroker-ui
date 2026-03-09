import { UseFormReturn } from 'react-hook-form'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getPresets, savePreset, getHistory } from '@/lib/utils'
import type { RecommendationFormValues } from '@/pages/RecommendationsPage'

interface PresetsSectionProps {
  form: UseFormReturn<RecommendationFormValues>
}

const defaultPresets = [
  { name: 'Cheapest EU Spot', config: { min_vcpu: 2, min_ram_gb: 4, arch: 'x86_64', max_price_eur_per_hour: 0.1, region_constraint: 'EU', purchase_model: 'spot' } as Partial<RecommendationFormValues> },
  { name: 'High-Memory On-Demand', config: { min_vcpu: 4, min_ram_gb: 16, arch: 'x86_64', max_price_eur_per_hour: 1, purchase_model: 'on_demand' } as Partial<RecommendationFormValues> },
  { name: 'ARM64 Burst Node', config: { min_vcpu: 2, min_ram_gb: 4, arch: 'arm64', max_price_eur_per_hour: 0.2, purchase_model: 'spot' } as Partial<RecommendationFormValues> },
]

export function PresetsSection({ form }: PresetsSectionProps) {
  const [saveName, setSaveName] = useState('')
  const presets = getPresets()
  const history = getHistory()

  const applyConfig = (config: Record<string, unknown>) => {
    Object.entries(config).forEach(([k, v]) => {
      if (v !== undefined && k in form.getValues()) {
        form.setValue(k as keyof RecommendationFormValues, v as never)
      }
    })
  }

  const handleSave = () => {
    if (!saveName.trim()) return
    const values = form.getValues()
    savePreset(saveName, values as unknown as Record<string, unknown>)
    setSaveName('')
  }

  return (
    <div className="space-y-3">
      <Label>Presets & History</Label>
      <div className="flex gap-2 flex-wrap">
        {defaultPresets.map((p) => (
          <Button
            key={p.name}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => applyConfig(p.config)}
          >
            {p.name}
          </Button>
        ))}
        {presets.map((p) => (
          <Button
            key={p.id}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => applyConfig(p.config as Record<string, unknown>)}
          >
            {p.name}
          </Button>
        ))}
      </div>
      {history.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">Recent</p>
          <div className="flex gap-2 flex-wrap">
            {history.slice(0, 5).map((h) => (
              <Button
                key={h.id}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => applyConfig(h.config)}
              >
                Replay
              </Button>
            ))}
          </div>
        </div>
      )}
      <div className="flex gap-2">
        <Input
          placeholder="Save as preset..."
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          className="flex-1"
        />
        <Button type="button" variant="secondary" onClick={handleSave} disabled={!saveName.trim()}>
          Save
        </Button>
      </div>
    </div>
  )
}
