"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, XCircle, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface SystemHealthIndicatorProps {
  overallHealth: number
  components: Array<{
    name: string
    status: "healthy" | "warning" | "critical"
    value: number
    message?: string
  }>
}

export function SystemHealthIndicator({ overallHealth, components }: SystemHealthIndicatorProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "critical":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-100 dark:bg-green-900"
      case "warning":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900"
      case "critical":
        return "text-red-600 bg-red-100 dark:bg-red-900"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900"
    }
  }

  const getHealthColor = (health: number) => {
    if (health >= 80) return "text-green-600"
    if (health >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Health Score */}
        <div className="text-center space-y-2">
          <div className={cn("text-4xl font-bold", getHealthColor(overallHealth))}>{overallHealth}%</div>
          <Progress value={overallHealth} className="h-3" />
          <p className="text-sm text-muted-foreground">Overall System Health</p>
        </div>

        {/* Component Status */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Component Status</h4>
          {components.map((component, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                {getStatusIcon(component.status)}
                <div>
                  <p className="font-medium text-sm">{component.name}</p>
                  {component.message && <p className="text-xs text-muted-foreground">{component.message}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{component.value}%</span>
                <Badge className={cn("text-xs", getStatusColor(component.status))}>{component.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
