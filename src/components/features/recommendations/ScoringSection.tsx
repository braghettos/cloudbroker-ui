import { UseFormReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import type { RecommendationFormValues } from '@/pages/RecommendationsPage'

interface ScoringSectionProps {
  form: UseFormReturn<RecommendationFormValues>
}

export function ScoringSection({ form }: ScoringSectionProps) {
  const priceWeight = form.watch('price_weight') ?? 0.5
  const fitWeight = form.watch('fit_weight') ?? 0.5
  const costWeight = form.watch('cost_weight')
  const perfWeight = form.watch('performance_weight')
  const relWeight = form.watch('reliability_weight')

  const useMultiCriteria = costWeight != null || perfWeight != null || relWeight != null

  const normalizeLegacy = (p: number, f: number) => {
    const sum = p + f
    if (sum === 0) return { p: 0.5, f: 0.5 }
    return { p: p / sum, f: f / sum }
  }

  const normalizeMulti = (c: number, p: number, r: number) => {
    const sum = c + p + r
    if (sum === 0) return { c: 0.4, p: 0.3, r: 0.3 }
    return { c: c / sum, p: p / sum, r: r / sum }
  }

  const handlePriceChange = (v: number) => {
    const { p, f } = normalizeLegacy(v, fitWeight)
    form.setValue('price_weight', p)
    form.setValue('fit_weight', f)
  }

  const handleFitChange = (v: number) => {
    const { p, f } = normalizeLegacy(priceWeight, v)
    form.setValue('price_weight', p)
    form.setValue('fit_weight', f)
  }

  const handleCostChange = (v: number) => {
    const p = perfWeight ?? 0.3
    const r = relWeight ?? 0.3
    const { c: nc, p: np, r: nr } = normalizeMulti(v, p, r)
    form.setValue('cost_weight', nc)
    form.setValue('performance_weight', np)
    form.setValue('reliability_weight', nr)
  }

  const handlePerfChange = (v: number) => {
    const c = costWeight ?? 0.4
    const r = relWeight ?? 0.3
    const { c: nc, p: np, r: nr } = normalizeMulti(c, v, r)
    form.setValue('cost_weight', nc)
    form.setValue('performance_weight', np)
    form.setValue('reliability_weight', nr)
  }

  const handleRelChange = (v: number) => {
    const c = costWeight ?? 0.4
    const p = perfWeight ?? 0.3
    const { c: nc, p: np, r: nr } = normalizeMulti(c, p, v)
    form.setValue('cost_weight', nc)
    form.setValue('performance_weight', np)
    form.setValue('reliability_weight', nr)
  }

  const switchToLegacy = () => {
    form.setValue('cost_weight', undefined)
    form.setValue('performance_weight', undefined)
    form.setValue('reliability_weight', undefined)
    form.setValue('price_weight', 0.5)
    form.setValue('fit_weight', 0.5)
  }

  const switchToMulti = () => {
    form.setValue('price_weight', undefined)
    form.setValue('fit_weight', undefined)
    form.setValue('cost_weight', 0.4)
    form.setValue('performance_weight', 0.3)
    form.setValue('reliability_weight', 0.3)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={switchToLegacy}
          className={`text-sm px-2 py-1 rounded ${!useMultiCriteria ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
        >
          Legacy
        </button>
        <button
          type="button"
          onClick={switchToMulti}
          className={`text-sm px-2 py-1 rounded ${useMultiCriteria ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
        >
          Multi-criteria
        </button>
      </div>

      {!useMultiCriteria ? (
        <>
          <div>
            <Label>Price weight: {(priceWeight * 100).toFixed(0)}%</Label>
            <Slider
              value={priceWeight}
              onValueChange={handlePriceChange}
              min={0}
              max={1}
              step={0.05}
            />
          </div>
          <div>
            <Label>Fit weight: {(fitWeight * 100).toFixed(0)}%</Label>
            <Slider
              value={fitWeight}
              onValueChange={handleFitChange}
              min={0}
              max={1}
              step={0.05}
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <Label>Cost: {((costWeight ?? 0.4) * 100).toFixed(0)}%</Label>
            <Slider
              value={costWeight ?? 0.4}
              onValueChange={handleCostChange}
              min={0}
              max={1}
              step={0.05}
            />
          </div>
          <div>
            <Label>Performance: {((perfWeight ?? 0.3) * 100).toFixed(0)}%</Label>
            <Slider
              value={perfWeight ?? 0.3}
              onValueChange={handlePerfChange}
              min={0}
              max={1}
              step={0.05}
            />
          </div>
          <div>
            <Label>Reliability: {((relWeight ?? 0.3) * 100).toFixed(0)}%</Label>
            <Slider
              value={relWeight ?? 0.3}
              onValueChange={handleRelChange}
              min={0}
              max={1}
              step={0.05}
            />
          </div>
        </>
      )}
    </div>
  )
}
