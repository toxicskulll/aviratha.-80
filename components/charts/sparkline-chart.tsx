"use client"

import { LineChart, Line, ResponsiveContainer } from "recharts"

interface SparklineChartProps {
  data: Array<{ value: number }>
  color?: string
  height?: number
}

export function SparklineChart({ data, color = "#10b981", height = 40 }: SparklineChartProps) {
  if (!data || data.length === 0) {
    return <div className="w-full bg-muted/20 rounded" style={{ height }} />
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} activeDot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
