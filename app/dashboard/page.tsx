"use client"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SensorCard } from "@/components/dashboard/sensor-card"
import { TrendChart } from "@/components/dashboard/trend-chart"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { ChatPlaceholder } from "@/components/dashboard/chat-placeholder"
import { useSensorData } from "@/contexts/sensor-data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Activity, Droplets, Thermometer, Sun, Zap, Beaker } from "lucide-react"

export default function DashboardPage() {
  const { sensorData, loading, lastUpdated } = useSensorData()

  const sensorConfigs = [
    {
      id: "temperature",
      title: "Temperature",
      icon: Thermometer,
      unit: "°C",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      thresholds: { min: 18, max: 28 },
    },
    {
      id: "humidity",
      title: "Humidity",
      icon: Droplets,
      unit: "%",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      thresholds: { min: 60, max: 80 },
    },
    {
      id: "ph",
      title: "pH Level",
      icon: Beaker,
      unit: "",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      thresholds: { min: 5.5, max: 6.5 },
    },
    {
      id: "tds",
      title: "TDS",
      icon: Activity,
      unit: "ppm",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      thresholds: { min: 800, max: 1200 },
    },
    {
      id: "light",
      title: "Light Intensity",
      icon: Sun,
      unit: "lux",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      thresholds: { min: 20000, max: 40000 },
    },
    {
      id: "ec",
      title: "EC Level",
      icon: Zap,
      unit: "mS/cm",
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      thresholds: { min: 1.2, max: 2.0 },
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your hydroponic system in real-time</p>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground">Last updated: {new Date(lastUpdated).toLocaleTimeString()}</p>
          )}
        </div>

        {/* Sensor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sensorConfigs.map((config) => (
            <SensorCard
              key={config.id}
              title={config.title}
              value={sensorData[config.id] || 0}
              unit={config.unit}
              icon={config.icon}
              color={config.color}
              bgColor={config.bgColor}
              thresholds={config.thresholds}
              loading={loading}
            />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Environmental Trends</CardTitle>
              <CardDescription>Temperature and humidity over time</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <TrendChart sensors={["temperature", "humidity"]} timeframe="24h" />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nutrient Levels</CardTitle>
              <CardDescription>pH, TDS, and EC monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <TrendChart sensors={["ph", "tds", "ec"]} timeframe="24h" />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Alerts Panel */}
        <AlertsPanel />
      </div>

      {/* Chat Placeholder */}
      <ChatPlaceholder />
    </DashboardLayout>
  )
}
