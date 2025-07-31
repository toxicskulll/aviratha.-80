"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { GaugeChart } from "@/components/charts/gauge-chart"
import { CustomAreaChart } from "@/components/charts/area-chart"
import { DonutChart } from "@/components/charts/donut-chart"
import { HeatmapChart } from "@/components/charts/heatmap-chart"
import { CustomRadialChart } from "@/components/charts/radial-chart"
import { CorrelationChart } from "@/components/charts/correlation-chart"
import { SystemHealthIndicator } from "@/components/charts/system-health-indicator"
import { useSensorData } from "@/contexts/sensor-data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function AnalyticsPage() {
  const { sensorData, historicalData, alerts } = useSensorData()

  // Generate mock data for demonstrations
  const alertsDistribution = [
    {
      name: "Critical",
      value: alerts.filter((a) => a.severity === "critical" && a.status === "active").length,
      color: "#ef4444",
    },
    {
      name: "Warning",
      value: alerts.filter((a) => a.severity === "warning" && a.status === "active").length,
      color: "#f59e0b",
    },
    {
      name: "Info",
      value: alerts.filter((a) => a.severity === "info" && a.status === "active").length,
      color: "#3b82f6",
    },
  ]

  const systemComponents = [
    { name: "Temperature Control", status: "healthy" as const, value: 95, message: "Operating normally" },
    { name: "Nutrient System", status: "warning" as const, value: 78, message: "pH slightly elevated" },
    { name: "Lighting System", status: "healthy" as const, value: 92, message: "Optimal intensity" },
    { name: "Water Circulation", status: "healthy" as const, value: 88, message: "Flow rate normal" },
    { name: "Environmental Control", status: "critical" as const, value: 65, message: "Humidity sensor offline" },
  ]

  const overallHealth = Math.round(
    systemComponents.reduce((sum, comp) => sum + comp.value, 0) / systemComponents.length,
  )

  // Generate heatmap data (24 hours x 7 days)
  const heatmapData = Array.from({ length: 7 }, (_, day) =>
    Array.from({ length: 24 }, (_, hour) => ({
      value: 20 + Math.random() * 10,
      label: `Day ${day + 1}, Hour ${hour}`,
    })),
  )

  const radialData = [
    { name: "Temperature", value: sensorData.temperature || 22, fill: "#f97316", max: 35 },
    { name: "Humidity", value: sensorData.humidity || 70, fill: "#3b82f6", max: 100 },
    { name: "pH", value: (sensorData.ph || 6) * 10, fill: "#8b5cf6", max: 100 },
    { name: "Light", value: (sensorData.light || 30000) / 500, fill: "#eab308", max: 100 },
  ]

  // Generate correlation data
  const correlationData =
    historicalData.temperature?.slice(-50).map((temp, index) => ({
      x: temp.value,
      y: historicalData.humidity?.[index]?.value || 0,
      name: `Point ${index + 1}`,
    })) || []

  const sensorComparison = [
    { name: "Temperature", current: sensorData.temperature || 0, optimal: 24, unit: "°C" },
    { name: "Humidity", current: sensorData.humidity || 0, optimal: 75, unit: "%" },
    { name: "pH", current: sensorData.ph || 0, optimal: 6.0, unit: "" },
    { name: "TDS", current: (sensorData.tds || 0) / 100, optimal: 10, unit: "x100 ppm" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Advanced visualizations and system insights</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="correlations">Correlations</TabsTrigger>
            <TabsTrigger value="health">System Health</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Gauge Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <GaugeChart
                title="Temperature"
                value={sensorData.temperature || 22}
                min={15}
                max={35}
                unit="°C"
                color="#f97316"
              />
              <GaugeChart
                title="Humidity"
                value={sensorData.humidity || 70}
                min={0}
                max={100}
                unit="%"
                color="#3b82f6"
              />
              <GaugeChart title="pH Level" value={sensorData.ph || 6} min={4} max={8} unit="" color="#8b5cf6" />
              <GaugeChart
                title="Light Intensity"
                value={(sensorData.light || 30000) / 1000}
                min={0}
                max={50}
                unit="k lux"
                color="#eab308"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DonutChart title="Alert Distribution" data={alertsDistribution} />
              <CustomRadialChart title="Sensor Overview" data={radialData} />
            </div>

            {/* Sensor Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Current vs Optimal Values</CardTitle>
                <CardDescription>Comparison of current sensor readings with optimal ranges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sensorComparison}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
                      <YAxis className="text-xs fill-muted-foreground" />
                      <Tooltip
                        formatter={(value: any, name: string) => [
                          `${value.toFixed(1)}${sensorComparison.find((s) => s.name === name)?.unit || ""}`,
                          name === "current" ? "Current" : "Optimal",
                        ]}
                      />
                      <Bar dataKey="current" fill="#10b981" name="current" />
                      <Bar dataKey="optimal" fill="#6b7280" name="optimal" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CustomAreaChart
                title="Temperature Trend"
                data={historicalData.temperature?.slice(-20) || []}
                color="#f97316"
                unit="°C"
              />
              <CustomAreaChart
                title="Humidity Trend"
                data={historicalData.humidity?.slice(-20) || []}
                color="#3b82f6"
                unit="%"
              />
              <CustomAreaChart title="pH Level Trend" data={historicalData.ph?.slice(-20) || []} color="#8b5cf6" />
              <CustomAreaChart
                title="Light Intensity Trend"
                data={historicalData.light?.slice(-20) || []}
                color="#eab308"
                unit=" lux"
              />
            </div>

            <HeatmapChart
              title="Temperature Heatmap (Last 7 Days)"
              data={heatmapData}
              xLabels={Array.from({ length: 24 }, (_, i) => `${i}:00`)}
              yLabels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
            />
          </TabsContent>

          <TabsContent value="correlations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CorrelationChart
                title="Temperature vs Humidity"
                data={correlationData}
                xLabel="Temperature (°C)"
                yLabel="Humidity (%)"
                color="#10b981"
              />
              <CorrelationChart
                title="pH vs TDS Correlation"
                data={
                  historicalData.ph?.slice(-30).map((ph, index) => ({
                    x: ph.value,
                    y: historicalData.tds?.[index]?.value || 0,
                    name: `Reading ${index + 1}`,
                  })) || []
                }
                xLabel="pH Level"
                yLabel="TDS (ppm)"
                color="#8b5cf6"
              />
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SystemHealthIndicator overallHealth={overallHealth} components={systemComponents} />
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key system performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">99.2%</div>
                      <div className="text-sm text-muted-foreground">Uptime</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">24/7</div>
                      <div className="text-sm text-muted-foreground">Monitoring</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">5s</div>
                      <div className="text-sm text-muted-foreground">Update Rate</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">6</div>
                      <div className="text-sm text-muted-foreground">Sensors</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
