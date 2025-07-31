"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { SparklineChart } from "@/components/charts/sparkline-chart"
import { useSensorData } from "@/contexts/sensor-data-context"

interface SensorCardProps {
  title: string
  value: number
  unit: string
  icon: LucideIcon
  color: string
  bgColor: string
  thresholds: { min: number; max: number }
  loading?: boolean
}

export function SensorCard({
  title,
  value,
  unit,
  icon: Icon,
  color,
  bgColor,
  thresholds,
  loading = false,
}: SensorCardProps) {
  const [previousValue, setPreviousValue] = useState(value)
  const [isAnimating, setIsAnimating] = useState(false)
  const { historicalData } = useSensorData()

  const getStatus = () => {
    if (value < thresholds.min || value > thresholds.max) {
      return "critical"
    }
    if (value < thresholds.min * 1.1 || value > thresholds.max * 0.9) {
      return "warning"
    }
    return "normal"
  }

  const status = getStatus()

  const getStatusColor = () => {
    switch (status) {
      case "critical":
        return "text-red-500 bg-red-500/10"
      case "warning":
        return "text-yellow-500 bg-yellow-500/10"
      default:
        return "text-green-500 bg-green-500/10"
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "warning":
        return <Badge variant="secondary">Warning</Badge>
      default:
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Normal
          </Badge>
        )
    }
  }

  const sparklineData = historicalData[title.toLowerCase()]?.slice(-10).map((point) => ({ value: point.value })) || []

  useEffect(() => {
    if (value !== previousValue) {
      setIsAnimating(true)
      setPreviousValue(value)
      const timer = setTimeout(() => setIsAnimating(false), 500)
      return () => clearTimeout(timer)
    }
  }, [value, previousValue])

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-4 w-20" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        "sensor-card-gradient transition-all duration-300 hover:shadow-md",
        status === "critical" && "border-red-500/50",
        status === "warning" && "border-yellow-500/50",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("p-2 rounded-full", bgColor)}>
          <Icon className={cn("h-4 w-4", color)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className={cn("text-2xl font-bold transition-all duration-300", isAnimating && "animate-pulse-value")}>
              {value.toFixed(1)}
              {unit}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Range: {thresholds.min}-{thresholds.max}
              {unit}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">{getStatusBadge()}</div>
        </div>
        <div className="mt-3">
          <SparklineChart data={sparklineData} color={color.replace("text-", "#")} height={30} />
        </div>
      </CardContent>
    </Card>
  )
}
