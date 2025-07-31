"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface User {
  uid: string
  email: string | null
  displayName: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock authentication functions
  const signIn = async (email: string, password: string) => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email === "demo@hydroponics.com" && password === "password123") {
      const mockUser = {
        uid: "123",
        email: email,
        displayName: "Demo User",
      }
      setUser(mockUser)
      localStorage.setItem("auth-user", JSON.stringify(mockUser))
    } else {
      throw new Error("Invalid credentials")
    }
    setLoading(false)
  }

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser = {
      uid: Date.now().toString(),
      email: email,
      displayName: null,
    }
    setUser(mockUser)
    localStorage.setItem("auth-user", JSON.stringify(mockUser))
    setLoading(false)
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem("auth-user")
  }

  const resetPassword = async (email: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // In real app, this would send a password reset email
  }

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("auth-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
