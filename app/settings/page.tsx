"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useSensorData } from "@/contexts/sensor-data-context"
import { User, Bell, Wifi, Key, Palette } from "lucide-react"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { user } = useAuth()
  const { thresholds, updateThresholds } = useSensorData()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  const [localThresholds, setLocalThresholds] = useState(thresholds)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  })
  const [apiKey, setApiKey] = useState("sk-1234567890abcdef...")

  const handleSaveThresholds = () => {
    updateThresholds(localThresholds)
    toast({
      title: "Settings saved",
      description: "Alert thresholds have been updated successfully.",
    })
  }

  const handleThresholdChange = (sensor: string, type: "min" | "max", value: string) => {
    setLocalThresholds((prev) => ({
      ...prev,
      [sensor]: {
        ...prev[sensor],
        [type]: Number.parseFloat(value) || 0,
      },
    }))
  }

  const sensorSettings = [
    { id: "temperature", name: "Temperature", unit: "°C" },
    { id: "humidity", name: "Humidity", unit: "%" },
    { id: "ph", name: "pH Level", unit: "" },
    { id: "tds", name: "TDS", unit: "ppm" },
    { id: "light", name: "Light Intensity", unit: "lux" },
    { id: "ec", name: "EC Level", unit: "mS/cm" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Configure your dashboard preferences and alert thresholds</p>
        </div>

        <div className="grid gap-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user?.email || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>Customize the look and feel of your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                  >
                    Light
                  </Button>
                  <Button variant={theme === "dark" ? "default" : "outline"} size="sm" onClick={() => setTheme("dark")}>
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("system")}
                  >
                    System
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Configure how you receive alerts and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, push: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts via SMS</p>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, sms: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Alert Thresholds */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                Alert Thresholds
              </CardTitle>
              <CardDescription>Set minimum and maximum values for sensor alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {sensorSettings.map((sensor) => (
                <div key={sensor.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">{sensor.name}</Label>
                    <Badge variant="secondary">{sensor.unit}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${sensor.id}-min`} className="text-sm">
                        Minimum
                      </Label>
                      <Input
                        id={`${sensor.id}-min`}
                        type="number"
                        step="0.1"
                        value={localThresholds[sensor.id]?.min || 0}
                        onChange={(e) => handleThresholdChange(sensor.id, "min", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${sensor.id}-max`} className="text-sm">
                        Maximum
                      </Label>
                      <Input
                        id={`${sensor.id}-max`}
                        type="number"
                        step="0.1"
                        value={localThresholds[sensor.id]?.max || 0}
                        onChange={(e) => handleThresholdChange(sensor.id, "max", e.target.value)}
                      />
                    </div>
                  </div>
                  {sensor.id !== sensorSettings[sensorSettings.length - 1].id && <Separator />}
                </div>
              ))}
              <Button onClick={handleSaveThresholds} className="w-full">
                Save Threshold Settings
              </Button>
            </CardContent>
          </Card>

          {/* API Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Configuration
              </CardTitle>
              <CardDescription>Manage your API keys and integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">WebSocket Endpoint</Label>
                <Input
                  id="websocket-url"
                  placeholder="wss://your-iot-endpoint.com"
                  value={process.env.NEXT_PUBLIC_WS_URL || ""}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input id="api-key" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                Test Connection
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
