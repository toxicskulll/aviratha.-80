"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, Clock, Search, Filter } from "lucide-react"
import { useSensorData } from "@/contexts/sensor-data-context"
import { useToast } from "@/hooks/use-toast"

export default function AlertsPage() {
  const { alerts, clearAlert, clearAllAlerts } = useSensorData()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterSeverity, setFilterSeverity] = useState("all")

  const handleClearAlert = (alertId: string) => {
    clearAlert(alertId)
    toast({
      title: "Alert cleared",
      description: "The alert has been marked as resolved.",
    })
  }

  const handleClearAll = () => {
    clearAllAlerts()
    toast({
      title: "All alerts cleared",
      description: "All alerts have been marked as resolved.",
    })
  }

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.sensor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || alert.status === filterStatus
    const matchesSeverity = filterSeverity === "all" || alert.severity === filterSeverity

    return matchesSearch && matchesStatus && matchesSeverity
  })

  const activeAlerts = filteredAlerts.filter((alert) => alert.status === "active")
  const resolvedAlerts = filteredAlerts.filter((alert) => alert.status === "resolved")

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "warning":
        return "secondary"
      case "info":
        return "outline"
      default:
        return "outline"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4" />
      case "warning":
        return <Clock className="h-4 w-4" />
      case "info":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const AlertCard = ({ alert }: { alert: any }) => (
    <Card className={`${alert.status === "active" ? "border-l-4 border-l-destructive" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {getSeverityIcon(alert.severity)}
              <CardTitle className="text-base">{alert.sensor.toUpperCase()} Alert</CardTitle>
              <Badge variant={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
              <Badge variant={alert.status === "active" ? "destructive" : "secondary"}>{alert.status}</Badge>
            </div>
            <CardDescription className="text-sm">{new Date(alert.timestamp).toLocaleString()}</CardDescription>
          </div>
          {alert.status === "active" && (
            <Button variant="outline" size="sm" onClick={() => handleClearAlert(alert.id)}>
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-3">{alert.message}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Value: {alert.value} {alert.unit}
          </span>
          <span>Threshold: {alert.threshold}</span>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
            <p className="text-muted-foreground">Monitor and manage system alerts and notifications</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClearAll}>
              Clear All
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Alert Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
                  <p className="text-2xl font-bold text-destructive">{activeAlerts.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolved Today</p>
                  <p className="text-2xl font-bold text-green-600">{resolvedAlerts.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Alerts</p>
                  <p className="text-2xl font-bold">{alerts.length}</p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active ({activeAlerts.length})</TabsTrigger>
            <TabsTrigger value="resolved">Resolved ({resolvedAlerts.length})</TabsTrigger>
            <TabsTrigger value="all">All ({filteredAlerts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeAlerts.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Alerts</h3>
                  <p className="text-muted-foreground">All systems are operating within normal parameters.</p>
                </CardContent>
              </Card>
            ) : (
              activeAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
            )}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            {resolvedAlerts.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Resolved Alerts</h3>
                  <p className="text-muted-foreground">Resolved alerts will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              resolvedAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Alerts Found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
                </CardContent>
              </Card>
            ) : (
              filteredAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
