import * as React from 'react'
import { cn } from '@/lib/utils'

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value = 0, onValueChange, min = 0, max = 1, step = 0.01, ...props }, ref) => (
    <input
      type="range"
      ref={ref}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onValueChange?.(parseFloat(e.target.value))}
      className={cn(
        'w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary',
        className
      )}
      {...props}
    />
  )
)
Slider.displayName = 'Slider'

export { Slider }
