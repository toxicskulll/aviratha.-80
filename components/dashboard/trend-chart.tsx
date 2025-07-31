"use client"

import { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useSensorData } from "@/contexts/sensor-data-context"
import { format } from "date-fns"

interface TrendChartProps {
  sensors: string[]
  timeframe: "1h" | "6h" | "24h" | "7d"
}

const sensorColors = {
  temperature: "#f97316",
  humidity: "#3b82f6",
  ph: "#8b5cf6",
  tds: "#10b981",
  light: "#eab308",
  ec: "#6366f1",
}

export function TrendChart({ sensors, timeframe }: TrendChartProps) {
  const { historicalData } = useSensorData()

  const chartData = useMemo(() => {
    if (!historicalData || Object.keys(historicalData).length === 0) {
      return []
    }

    // Get the time range based on timeframe
    const now = new Date()
    let startTime: Date

    switch (timeframe) {
      case "1h":
        startTime = new Date(now.getTime() - 60 * 60 * 1000)
        break
      case "6h":
        startTime = new Date(now.getTime() - 6 * 60 * 60 * 1000)
        break
      case "24h":
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case "7d":
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    }

    // Combine data from all sensors
    const combinedData: { [timestamp: string]: any } = {}

    sensors.forEach((sensor) => {
      const sensorData = historicalData[sensor] || []
      sensorData
        .filter((point) => new Date(point.timestamp) >= startTime)
        .forEach((point) => {
          const timestamp = point.timestamp
          if (!combinedData[timestamp]) {
            combinedData[timestamp] = { timestamp }
          }
          combinedData[timestamp][sensor] = point.value
        })
    })

    return Object.values(combinedData).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }, [historicalData, sensors, timeframe])

  const formatXAxisLabel = (timestamp: string) => {
    const date = new Date(timestamp)
    switch (timeframe) {
      case "1h":
      case "6h":
        return format(date, "HH:mm")
      case "24h":
        return format(date, "HH:mm")
      case "7d":
        return format(date, "MM/dd")
      default:
        return format(date, "HH:mm")
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-2">{format(new Date(label), "MMM dd, yyyy HH:mm")}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey.toUpperCase()}: ${entry.value.toFixed(1)}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No data available for the selected timeframe
      </div>
    )
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="timestamp" tickFormatter={formatXAxisLabel} className="text-xs fill-muted-foreground" />
          <YAxis className="text-xs fill-muted-foreground" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {sensors.map((sensor) => (
            <Line
              key={sensor}
              type="monotone"
              dataKey={sensor}
              stroke={sensorColors[sensor as keyof typeof sensorColors]}
              strokeWidth={2}
              dot={false}
              name={sensor.toUpperCase()}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
