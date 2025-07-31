"use client"

import { RadialBarChart, RadialBar, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RadialChartProps {
  title: string
  data: Array<{
    name: string
    value: number
    fill: string
    max: number
  }>
}

export function CustomRadialChart({ title, data }: RadialChartProps) {
  const processedData = data.map((item, index) => ({
    ...item,
    value: (item.value / item.max) * 100,
    innerRadius: 20 + index * 20,
    outerRadius: 35 + index * 20,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="90%" data={processedData}>
              <RadialBar dataKey="value" cornerRadius={4} fill="#8884d8" />
              <Legend
                iconSize={10}
                layout="vertical"
                verticalAlign="middle"
                align="right"
                formatter={(value, entry: any) => (
                  <span style={{ color: entry.color, fontSize: "12px" }}>
                    {value}: {data.find((d) => d.name === value)?.value.toFixed(1)}
                  </span>
                )}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
