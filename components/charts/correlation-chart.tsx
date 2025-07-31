"use client"

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CorrelationChartProps {
  title: string
  data: Array<{ x: number; y: number; name?: string }>
  xLabel: string
  yLabel: string
  color?: string
}

export function CorrelationChart({ title, data, xLabel, yLabel, color = "#10b981" }: CorrelationChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-1">{data.name || "Data Point"}</p>
          <p className="text-sm">
            {xLabel}: {data.x.toFixed(2)}
          </p>
          <p className="text-sm">
            {yLabel}: {data.y.toFixed(2)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" dataKey="x" name={xLabel} className="text-xs fill-muted-foreground" />
              <YAxis type="number" dataKey="y" name={yLabel} className="text-xs fill-muted-foreground" />
              <Tooltip content={<CustomTooltip />} />
              <Scatter dataKey="y" fill={color} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
