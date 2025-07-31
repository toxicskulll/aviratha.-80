"use client"

import { useEffect, useState, useRef } from "react"

interface UseWebSocketReturn {
  data: any
  connected: boolean
  error: string | null
  send: (data: any) => void
}

export function useWebSocket(url: string | null, enabled = true): UseWebSocketReturn {
  const [data, setData] = useState<any>(null)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 3

  const connect = () => {
    // Don't connect if URL is not provided, not enabled, or URL is localhost without a real server
    if (!url || !enabled || url.includes("localhost:8080")) {
      console.log("WebSocket connection skipped - no valid URL or disabled")
      return
    }

    try {
      wsRef.current = new WebSocket(url)

      wsRef.current.onopen = () => {
        console.log("WebSocket connected")
        setConnected(true)
        setError(null)
        reconnectAttempts.current = 0
      }

      wsRef.current.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data)
          setData(parsedData)
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err)
        }
      }

      wsRef.current.onclose = (event) => {
        console.log("WebSocket disconnected", event.code, event.reason)
        setConnected(false)

        // Only attempt to reconnect for unexpected closures and if we have a valid URL
        if (
          event.code !== 1000 &&
          reconnectAttempts.current < maxReconnectAttempts &&
          url &&
          !url.includes("localhost")
        ) {
          reconnectAttempts.current++
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000)

          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`)
            connect()
          }, delay)
        }
      }

      wsRef.current.onerror = (event) => {
        console.log("WebSocket connection failed - this is expected in development")
        // Don't set error state for expected connection failures
        if (url && !url.includes("localhost")) {
          setError("WebSocket connection error")
        }
      }
    } catch (err) {
      console.log("WebSocket not available - using mock data")
      // Don't set error state for expected failures
    }
  }

  const send = (data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data))
    } else {
      console.warn("WebSocket is not connected")
    }
  }

  useEffect(() => {
    if (enabled) {
      connect()
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounting")
      }
    }
  }, [url, enabled])

  return { data, connected, error, send }
}
