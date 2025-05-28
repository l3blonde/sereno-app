"use client"

interface SliderProps {
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}

export function Slider({ value, min, max, step, onChange }: SliderProps) {
  return (
      <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer"
      />
  )
}
