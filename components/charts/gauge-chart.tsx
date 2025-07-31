"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GaugeChartProps {
  title: string
  value: number
  min: number
  max: number
  unit: string
  color?: string
  size?: number
}

export function GaugeChart({ title, value, min, max, unit, color = "#10b981", size = 200 }: GaugeChartProps) {
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100)

  const data = [
    { name: "value", value: percentage },
    { name: "remaining", value: 100 - percentage },
  ]

  const getColor = () => {
    if (percentage < 20 || percentage > 80) return "#ef4444" // red
    if (percentage < 40 || percentage > 60) return "#f59e0b" // yellow
    return color // green
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size / 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={size * 0.3}
                outerRadius={size * 0.45}
                dataKey="value"
                stroke="none"
              >
                <Cell fill={getColor()} />
                <Cell fill="hsl(var(--muted))" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
            <div className="text-2xl font-bold">{value.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">{unit}</div>
            <div className="text-xs text-muted-foreground">
              {min} - {max} {unit}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
