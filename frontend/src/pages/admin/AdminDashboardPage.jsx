"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"
import { Users, UserCheck, Package, User, BarChart2, Calendar, DollarSign, Droplet } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const AdminDashboardPage = () => {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [apiDebug, setApiDebug] = useState({
    usersApi: { status: "pending", data: null, error: null },
    suppliersApi: { status: "pending", data: null, error: null },
    inventoryApi: { status: "pending", data: null, error: null },
    salesApi: { status: "pending", data: null, error: null },
  })
  const [dashboardData, setDashboardData] = useState({
    userStats: {
      totalUsers: 0,
      staffCount: 0,
      customerCount: 0,
      supplierCount: 0,
    },
    fuelStats: {
      totalStock: 0,
      fuelTypes: [],
    },
    salesData: [],
    inventoryData: [],
  })

  // Define the base URL for API calls
  const API_BASE_URL = "/api" // This should match your backend API base URL

  // Fetch all required data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      setError(null)

      try {
        console.log("Starting to fetch dashboard data...")
        console.log("Auth token available:", !!token)

        // Set up axios headers with authentication token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

        // Debug API endpoints
        console.log("API endpoints being called:")
        console.log(`${API_BASE_URL}/users`)
        console.log(`${API_BASE_URL}/suppliers/get-all`)
        console.log(`${API_BASE_URL}/inventory/get-all`)
        console.log(`${API_BASE_URL}/sales/transactions`)

        // Fetch users data
        let usersData = { users: [] }
        try {
          setApiDebug((prev) => ({ ...prev, usersApi: { ...prev.usersApi, status: "loading" } }))
          const usersResponse = await axios.get(`${API_BASE_URL}/users`, config)
          usersData = usersResponse.data
          console.log("Users data fetched successfully:", usersData)
          setApiDebug((prev) => ({
            ...prev,
            usersApi: {
              status: "success",
              data: usersData,
              error: null,
            },
          }))
        } catch (error) {
          console.error("Error fetching users:", error.response || error)
          setApiDebug((prev) => ({
            ...prev,
            usersApi: {
              status: "error",
              data: null,
              error: error.response?.data || error.message,
            },
          }))
        }

        // Fetch suppliers data
        let suppliersData = { suppliers: [] }
        try {
          setApiDebug((prev) => ({ ...prev, suppliersApi: { ...prev.suppliersApi, status: "loading" } }))
          const suppliersResponse = await axios.get(`${API_BASE_URL}/suppliers/get-all`, config)
          suppliersData = suppliersResponse.data
          console.log("Suppliers data fetched successfully:", suppliersData)
          setApiDebug((prev) => ({
            ...prev,
            suppliersApi: {
              status: "success",
              data: suppliersData,
              error: null,
            },
          }))
        } catch (error) {
          console.error("Error fetching suppliers:", error.response || error)
          setApiDebug((prev) => ({
            ...prev,
            suppliersApi: {
              status: "error",
              data: null,
              error: error.response?.data || error.message,
            },
          }))
        }

        // Fetch inventory data
        let inventoryData = { inventoryItems: [] }
        try {
          setApiDebug((prev) => ({ ...prev, inventoryApi: { ...prev.inventoryApi, status: "loading" } }))
          const inventoryResponse = await axios.get(`${API_BASE_URL}/inventory/get-all`, config)
          inventoryData = inventoryResponse.data
          console.log("Inventory data fetched successfully:", inventoryData)
          setApiDebug((prev) => ({
            ...prev,
            inventoryApi: {
              status: "success",
              data: inventoryData,
              error: null,
            },
          }))
        } catch (error) {
          console.error("Error fetching inventory:", error.response || error)
          setApiDebug((prev) => ({
            ...prev,
            inventoryApi: {
              status: "error",
              data: null,
              error: error.response?.data || error.message,
            },
          }))
        }

        // Fetch sales data
        let salesData = { transactions: [] }
        try {
          setApiDebug((prev) => ({ ...prev, salesApi: { ...prev.salesApi, status: "loading" } }))
          const salesResponse = await axios.get(`${API_BASE_URL}/sales/transactions`, config)
          salesData = salesResponse.data
          console.log("Sales data fetched successfully:", salesData)
          setApiDebug((prev) => ({
            ...prev,
            salesApi: {
              status: "success",
              data: salesData,
              error: null,
            },
          }))
        } catch (error) {
          console.error("Error fetching sales:", error.response || error)
          setApiDebug((prev) => ({
            ...prev,
            salesApi: {
              status: "error",
              data: null,
              error: error.response?.data || error.message,
            },
          }))
        }

        // Process users data
        const users = usersData.users || []
        const staffCount = users.filter((u) => u.role === "staff").length
        const customerCount = users.filter((u) => u.role === "customer").length

        // Process suppliers data
        const suppliers = suppliersData.suppliers || []

        // Process inventory data
        const inventory = inventoryData.inventoryItems || []
        const totalStock = inventory.reduce((sum, item) => sum + (item.availableQuantity || 0), 0)

        // Process fuel types with their quantities and prices
        const fuelTypes = inventory.map((item) => ({
          name: item.fuelType,
          quantity: item.availableQuantity || 0,
          price: item.pricePerLiter || 0,
        }))

        // Process sales data for chart (group by date)
        const transactions = salesData.transactions || []
        const salesByDate = {}

        transactions.forEach((transaction) => {
          const date = new Date(transaction.createdAt).toLocaleDateString()
          if (!salesByDate[date]) {
            salesByDate[date] = {
              date,
              sales: 0,
              revenue: 0,
            }
          }
          salesByDate[date].sales += 1
          salesByDate[date].revenue += transaction.price || 0
        })

        const processedSalesData = Object.values(salesByDate)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(-7) // Get last 7 days

        // Process inventory additions (group by date)
        const inventoryByDate = {}

        inventory.forEach((item) => {
          const date = new Date(item.createdAt).toLocaleDateString()
          if (!inventoryByDate[date]) {
            inventoryByDate[date] = {
              date,
              quantity: 0,
            }
          }
          inventoryByDate[date].quantity += item.literQuantity || 0
        })

        const processedInventoryData = Object.values(inventoryByDate).sort(
          (a, b) => new Date(a.date) - new Date(b.date),
        )

        // Set all dashboard data
        const finalData = {
          userStats: {
            totalUsers: users.length,
            staffCount,
            customerCount,
            supplierCount: suppliers.length,
          },
          fuelStats: {
            totalStock,
            fuelTypes,
          },
          salesData: processedSalesData,
          inventoryData: processedInventoryData,
        }

        console.log("Final dashboard data:", finalData)
        setDashboardData(finalData)
        setLoading(false)
      } catch (err) {
        console.error("Error in dashboard data fetching:", err)
        setError("Failed to load dashboard data. Please check console for details.")
        setLoading(false)
      }
    }

    if (token) {
      fetchDashboardData()
    }
  }, [token, API_BASE_URL])

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading dashboard data...</p>
      </div>
    )
  }

  const { userStats, fuelStats, salesData, inventoryData } = dashboardData

  // Prepare data for fuel type pie chart
  const fuelPieData = fuelStats.fuelTypes.map((fuel) => ({
    name: fuel.name,
    value: fuel.quantity,
  }))

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">Dashboard Overview</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* API Debug Information (only visible in development) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">API Debug Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <p>
                <strong>Users API:</strong> {apiDebug.usersApi.status}
              </p>
              {apiDebug.usersApi.error && <p className="text-red-500">{JSON.stringify(apiDebug.usersApi.error)}</p>}
            </div>
            <div>
              <p>
                <strong>Suppliers API:</strong> {apiDebug.suppliersApi.status}
              </p>
              {apiDebug.suppliersApi.error && (
                <p className="text-red-500">{JSON.stringify(apiDebug.suppliersApi.error)}</p>
              )}
            </div>
            <div>
              <p>
                <strong>Inventory API:</strong> {apiDebug.inventoryApi.status}
              </p>
              {apiDebug.inventoryApi.error && (
                <p className="text-red-500">{JSON.stringify(apiDebug.inventoryApi.error)}</p>
              )}
            </div>
            <div>
              <p>
                <strong>Sales API:</strong> {apiDebug.salesApi.status}
              </p>
              {apiDebug.salesApi.error && <p className="text-red-500">{JSON.stringify(apiDebug.salesApi.error)}</p>}
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Welcome back, {user?.name || "Admin"}!</h2>
        <p className="text-gray-600">Here's what's happening with your fuel management system today.</p>
      </div>

      {/* User Statistics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{userStats.totalUsers}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Staff Members</p>
              <p className="text-3xl font-bold text-gray-900">{userStats.staffCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Suppliers</p>
              <p className="text-3xl font-bold text-gray-900">{userStats.supplierCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <div className="rounded-full bg-yellow-100 p-3 mr-4">
              <User className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Customers</p>
              <p className="text-3xl font-bold text-gray-900">{userStats.customerCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fuel Inventory Statistics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Fuel Inventory</h2>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <Droplet className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Fuel Stock</p>
              <p className="text-3xl font-bold text-gray-900">{fuelStats.totalStock.toLocaleString()} Liters</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Fuel Type
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Available Quantity (Liters)
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Price Per Liter
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fuelStats.fuelTypes.length > 0 ? (
                    fuelStats.fuelTypes.map((fuel, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm">{fuel.name}</td>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm">{fuel.quantity.toLocaleString()}</td>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm">${fuel.price.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-4 px-4 text-center text-gray-500">
                        No fuel inventory data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="h-64">
              {fuelPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fuelPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {fuelPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value.toLocaleString()} Liters`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-full bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No fuel data available for chart</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Sales Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <BarChart2 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">Daily Fuel Sales</h3>
          </div>

          {salesData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sales" name="Number of Sales" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="revenue" name="Revenue ($)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No sales data available</p>
            </div>
          )}
        </div>

        {/* Fuel Additions Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold">Fuel Inventory Additions</h3>
          </div>

          {inventoryData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={inventoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="quantity" name="Liters Added" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No inventory addition data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
        {salesData.length > 0 ? (
          <div className="space-y-4">
            {salesData.slice(0, 5).map((sale, index) => (
              <div key={index} className="flex items-center py-2 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                  <DollarSign className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {sale.sales} sales on {sale.date}
                  </p>
                  <p className="text-xs text-gray-500">Total revenue: ${sale.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-32 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No recent activity available</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboardPage
