"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)

  // Configure axios
  const api = axios.create({
    baseURL: "http://localhost:5000/api",
  })

  // Add token to requests
  api.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  // Register user
  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData)
      const { user, token } = response.data

      // Save user and token to state and localStorage
      setUser(user)
      setToken(token)
      localStorage.setItem("token", token)
      console.log("Registration successful:", user)

      return { success: true, data: user }
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      }
    }
  }

  // Login user
  const login = async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials)
      const { user, token } = response.data

      // Save user and token to state and localStorage
      setUser(user)
      setToken(token)
      localStorage.setItem("token", token)
      console.log("Login successful:", user)

      return { success: true, data: user }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      }
    }
  }

  // Logout user
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
  }

  // Get all users (admin only)
  const getAllUsers = async () => {
    try {
      const response = await api.get("/users")
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch users",
      }
    }
  }

  // Update user role (admin only)
  const updateUserRole = async (userId, role) => {
    try {
      const response = await api.patch("/users/update-role", { userId, role })
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update role",
      }
    }
  }

  // Update user profile image
  const updateProfileImage = async (userId, imageUrl) => {
    try {
      const response = await api.patch("/users/update-profile-image", { userId, imageUrl })

      // Update local user state with new image
      if (response.data.user) {
        setUser((prev) => ({
          ...prev,
          profileImage: imageUrl,
        }))
      }

      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update profile image",
      }
    }
  }

  // Check if user is authenticated on app load
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          // We'll use the token to get the current user
          // Since we don't have a /auth/me endpoint, we'll check if the token is valid
          // by making a request to a protected endpoint
          const response = await api.get("/users/me").catch(() => null)

          if (response && response.data) {
            setUser(response.data.user)
          } else {
            // If we can't verify the token, clear everything
            setUser(null)
            setToken(null)
            localStorage.removeItem("token")
          }
        } catch (error) {
          // If token is invalid, clear everything
          console.error("Token verification error:", error)
          setUser(null)
          setToken(null)
          localStorage.removeItem("token")
        }
      }
      setLoading(false)
    }

    verifyToken()
  }, [token])

  // For debugging
  useEffect(() => {
    console.log("Auth state updated:", { user, token, loading })
  }, [user, token, loading])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        getAllUsers,
        updateUserRole,
        updateProfileImage,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isStaff: user?.role === "staff",
        isCustomer: user?.role === "customer",
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
