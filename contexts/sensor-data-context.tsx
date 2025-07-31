"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useWebSocket } from "@/hooks/use-websocket"
import { useAuth } from "@/contexts/auth-context"

interface SensorData {
  [key: string]: number
}

interface Alert {
  id: string
  sensor: string
  message: string
  severity: "critical" | "warning" | "info"
  status: "active" | "resolved"
  timestamp: string
  value: number
  unit: string
  threshold: string
}

interface Thresholds {
  [sensor: string]: {
    min: number
    max: number
  }
}

interface SensorDataContextType {
  sensorData: SensorData
  historicalData: { [sensor: string]: Array<{ timestamp: string; value: number }> }
  alerts: Alert[]
  thresholds: Thresholds
  loading: boolean
  lastUpdated: string | null
  updateThresholds: (newThresholds: Thresholds) => void
  clearAlert: (alertId: string) => void
  clearAllAlerts: () => void
}

const SensorDataContext = createContext<SensorDataContextType | undefined>(undefined)

export function useSensorData() {
  const context = useContext(SensorDataContext)
  if (context === undefined) {
    throw new Error("useSensorData must be used within a SensorDataProvider")
  }
  return context
}

export function SensorDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [sensorData, setSensorData] = useState<SensorData>({})
  const [historicalData, setHistoricalData] = useState<{
    [sensor: string]: Array<{ timestamp: string; value: number }>
  }>({})
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const [thresholds, setThresholds] = useState<Thresholds>({
    temperature: { min: 18, max: 28 },
    humidity: { min: 60, max: 80 },
    ph: { min: 5.5, max: 6.5 },
    tds: { min: 800, max: 1200 },
    light: { min: 20000, max: 40000 },
    ec: { min: 1.2, max: 2.0 },
  })

  // Only connect WebSocket when user is authenticated
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || null
  const { data: wsData, connected } = useWebSocket(wsUrl, !!user)

  // Generate mock sensor data
  const generateMockData = () => {
    const mockData = {
      temperature: 22 + Math.random() * 8 - 4, // 18-26°C
      humidity: 70 + Math.random() * 20 - 10, // 60-80%
      ph: 6.0 + Math.random() * 1 - 0.5, // 5.5-6.5
      tds: 1000 + Math.random() * 400 - 200, // 800-1200 ppm
      light: 30000 + Math.random() * 20000 - 10000, // 20000-40000 lux
      ec: 1.6 + Math.random() * 0.8 - 0.4, // 1.2-2.0 mS/cm
    }

    setSensorData(mockData)
    setLastUpdated(new Date().toISOString())

    // Update historical data
    const timestamp = new Date().toISOString()
    setHistoricalData((prev) => {
      const updated = { ...prev }
      Object.entries(mockData).forEach(([sensor, value]) => {
        if (!updated[sensor]) updated[sensor] = []
        updated[sensor].push({ timestamp, value })
        // Keep only last 100 data points
        if (updated[sensor].length > 100) {
          updated[sensor] = updated[sensor].slice(-100)
        }
      })
      return updated
    })

    // Check for threshold violations and create alerts
    Object.entries(mockData).forEach(([sensor, value]) => {
      const threshold = thresholds[sensor]
      if (threshold) {
        if (value < threshold.min || value > threshold.max) {
          const existingAlert = alerts.find((alert) => alert.sensor === sensor && alert.status === "active")

          if (!existingAlert) {
            const newAlert: Alert = {
              id: Date.now().toString() + sensor,
              sensor,
              message: `${sensor.toUpperCase()} is ${value < threshold.min ? "below" : "above"} safe threshold`,
              severity:
                Math.abs(value - (value < threshold.min ? threshold.min : threshold.max)) >
                (threshold.max - threshold.min) * 0.2
                  ? "critical"
                  : "warning",
              status: "active",
              timestamp: new Date().toISOString(),
              value: Math.round(value * 100) / 100,
              unit: getUnit(sensor),
              threshold: `${threshold.min} - ${threshold.max}`,
            }

            setAlerts((prev) => [newAlert, ...prev])
          }
        }
      }
    })
  }

  const getUnit = (sensor: string) => {
    const units: { [key: string]: string } = {
      temperature: "°C",
      humidity: "%",
      ph: "",
      tds: "ppm",
      light: "lux",
      ec: "mS/cm",
    }
    return units[sensor] || ""
  }

  const updateThresholds = (newThresholds: Thresholds) => {
    setThresholds(newThresholds)
    localStorage.setItem("sensor-thresholds", JSON.stringify(newThresholds))
  }

  const clearAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, status: "resolved" as const } : alert)))
  }

  const clearAllAlerts = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, status: "resolved" as const })))
  }

  useEffect(() => {
    // Load saved thresholds
    const savedThresholds = localStorage.getItem("sensor-thresholds")
    if (savedThresholds) {
      setThresholds(JSON.parse(savedThresholds))
    }

    // Only generate mock data and start intervals when user is authenticated
    if (user) {
      generateMockData()
      setLoading(false)

      // Set up interval for mock data updates
      const interval = setInterval(generateMockData, 5000) // Update every 5 seconds
      return () => clearInterval(interval)
    } else {
      setLoading(false)
    }
  }, [user])

  // Handle WebSocket data (when available)
  useEffect(() => {
    if (wsData && user) {
      setSensorData(wsData)
      setLastUpdated(new Date().toISOString())
    }
  }, [wsData, user])

  const value = {
    sensorData,
    historicalData,
    alerts,
    thresholds,
    loading,
    lastUpdated,
    updateThresholds,
    clearAlert,
    clearAllAlerts,
  }

  return <SensorDataContext.Provider value={value}>{children}</SensorDataContext.Provider>
}
