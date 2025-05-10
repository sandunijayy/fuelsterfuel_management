"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"

// Admin pages
import AdminLayout from "./layouts/AdminLayout"
import AdminDashboardPage from "./pages/admin/AdminDashboardPage"
import UsersPage from "./pages/admin/UsersPage"
import SuppliersPage from "./pages/admin/SuppliersPage"
import OrdersPage from "./pages/admin/OrdersPage"
import InventoriesPage from "./pages/admin/InventoriesPage"

// Staff pages
import StaffLayout from "./layouts/StaffLayout"
import StaffDashboard from "./pages/StaffDashboard"
import SalesPage from "./pages/staff/SalesPage"
import CustomersPage from "./pages/staff/CustomersPage"
import ReportsPage from "./pages/staff/ReportsPage"
import StaffSettingsPage from "./pages/staff/StaffSettingsPage"

// Customer pages
import CustomerLayout from "./layouts/CustomerLayout"
import CustomerDashboard from "./pages/CustomerDashboard"
import ReservationsPage from "./pages/customer/ReservationsPage"

// Protected route component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth()

  // Show loading indicator while checking authentication
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check if user has the required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect based on role
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />
    } else if (user.role === "staff") {
      return <Navigate to="/sales-dashboard" replace />
    } else {
      return <Navigate to="/customer-dashboard" replace />
    }
  }

  return children
}

// Admin route wrapper
const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  )
}

// Staff route wrapper
const StaffRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={["staff"]}>
      <StaffLayout>{children}</StaffLayout>
    </ProtectedRoute>
  )
}

// Customer route wrapper
const CustomerRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={["customer", "admin", "staff"]}>
      <CustomerLayout>{children}</CustomerLayout>
    </ProtectedRoute>
  )
}

// App component with routes
function AppRoutes() {
  const { isAuthenticated, user } = useAuth()

  // Helper function to redirect based on user role
  const getHomePage = () => {
    if (!isAuthenticated) return <HomePage />

    switch (user.role) {
      case "admin":
        return <Navigate to="/admin" replace />
      case "staff":
        return <Navigate to="/sales-dashboard" replace />
      default:
        return <Navigate to="/customer-dashboard" replace />
    }
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={getHomePage()} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <UsersPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/suppliers"
        element={
          <AdminRoute>
            <SuppliersPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <OrdersPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/inventories"
        element={
          <AdminRoute>
            <InventoriesPage />
          </AdminRoute>
        }
      />

      {/* Staff routes */}
      <Route
        path="/sales-dashboard"
        element={
          <StaffRoute>
            <StaffDashboard />
          </StaffRoute>
        }
      />
      <Route
        path="/sales-dashboard/sales"
        element={
          <StaffRoute>
            <SalesPage />
          </StaffRoute>
        }
      />
      <Route
        path="/sales-dashboard/customers"
        element={
          <StaffRoute>
            <CustomersPage />
          </StaffRoute>
        }
      />
      <Route
        path="/sales-dashboard/reports"
        element={
          <StaffRoute>
            <ReportsPage />
          </StaffRoute>
        }
      />
      <Route
        path="/sales-dashboard/settings"
        element={
          <StaffRoute>
            <StaffSettingsPage />
          </StaffRoute>
        }
      />

      {/* Customer routes */}
      <Route
        path="/customer-dashboard"
        element={
          <CustomerRoute>
            <CustomerDashboard />
          </CustomerRoute>
        }
      />
      <Route
        path="/customer-dashboard/reservations"
        element={
          <CustomerRoute>
            <ReservationsPage />
          </CustomerRoute>
        }
      />
      <Route
        path="/customer-dashboard/*"
        element={
          <CustomerRoute>
            <CustomerDashboard />
          </CustomerRoute>
        }
      />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App
