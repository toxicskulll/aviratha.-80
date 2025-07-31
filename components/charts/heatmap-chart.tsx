"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface HeatmapChartProps {
  title: string
  data: Array<Array<{ value: number; label: string }>>
  xLabels: string[]
  yLabels: string[]
}

export function HeatmapChart({ title, data, xLabels, yLabels }: HeatmapChartProps) {
  const getIntensity = (value: number, min: number, max: number) => {
    return (value - min) / (max - min)
  }

  const allValues = data.flat().map((cell) => cell.value)
  const minValue = Math.min(...allValues)
  const maxValue = Math.max(...allValues)

  const getColor = (intensity: number) => {
    if (intensity < 0.2) return "bg-blue-100 dark:bg-blue-900"
    if (intensity < 0.4) return "bg-green-100 dark:bg-green-900"
    if (intensity < 0.6) return "bg-yellow-100 dark:bg-yellow-900"
    if (intensity < 0.8) return "bg-orange-100 dark:bg-orange-900"
    return "bg-red-100 dark:bg-red-900"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-[auto_1fr] gap-2">
            <div></div>
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${xLabels.length}, 1fr)` }}>
              {xLabels.map((label, index) => (
                <div key={index} className="text-xs text-center text-muted-foreground p-1">
                  {label}
                </div>
              ))}
            </div>
          </div>

          {data.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-[auto_1fr] gap-2">
              <div className="text-xs text-muted-foreground p-2 flex items-center">{yLabels[rowIndex]}</div>
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${row.length}, 1fr)` }}>
                {row.map((cell, cellIndex) => {
                  const intensity = getIntensity(cell.value, minValue, maxValue)
                  return (
                    <div
                      key={cellIndex}
                      className={cn(
                        "aspect-square rounded flex items-center justify-center text-xs font-medium transition-colors hover:ring-2 hover:ring-primary cursor-pointer",
                        getColor(intensity),
                      )}
                      title={`${cell.label}: ${cell.value.toFixed(1)}`}
                    >
                      {cell.value.toFixed(0)}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
          <span>Low</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900 rounded"></div>
            <div className="w-4 h-4 bg-green-100 dark:bg-green-900 rounded"></div>
            <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-900 rounded"></div>
            <div className="w-4 h-4 bg-orange-100 dark:bg-orange-900 rounded"></div>
            <div className="w-4 h-4 bg-red-100 dark:bg-red-900 rounded"></div>
          </div>
          <span>High</span>
        </div>
      </CardContent>
    </Card>
  )
}
