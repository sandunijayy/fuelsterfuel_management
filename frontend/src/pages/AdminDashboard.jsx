"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"
import DashboardHeader from "../components/DashboardHeader"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const AdminDashboard = () => {
  const {
    isAuthenticated,
    isAdmin,
    getAllUsers,
    updateUserRole,
    getAllSuppliers,
    getFuelStock,
    getDailyFuelSales,
    getFuelInventory,
  } = useAuth()

  const [users, setUsers] = useState([])
  const [supplierCount, setSupplierCount] = useState(0)
  const [fuelStock, setFuelStock] = useState([])
  const [salesData, setSalesData] = useState([])
  const [inventoryData, setInventoryData] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedRole, setSelectedRole] = useState("")
  const [updateSuccess, setUpdateSuccess] = useState(false)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)

      try {
        const userRes = await getAllUsers()
        const supplierRes = await getAllSuppliers()
        const stockRes = await getFuelStock()
        const salesRes = await getDailyFuelSales()
        const inventoryRes = await getFuelInventory()

        if (userRes.success) setUsers(userRes.data.users)
        if (supplierRes.success) setSupplierCount(supplierRes.data.totalSuppliers)
        if (stockRes.success) setFuelStock(stockRes.data.fuels)
        if (salesRes.success) setSalesData(salesRes.data)
        if (inventoryRes.success) setInventoryData(inventoryRes.data)
      } catch (err) {
        setError("Error loading dashboard data.")
      }

      setLoading(false)
    }

    if (isAuthenticated && isAdmin) {
      fetchDashboardData()
    }
  }, [isAuthenticated, isAdmin])

  const handleRoleUpdate = async () => {
    if (!selectedUser || !selectedRole) return

    const { success } = await updateUserRole(selectedUser._id, selectedRole)

    if (success) {
      setUsers(users.map(user =>
        user._id === selectedUser._id ? { ...user, role: selectedRole } : user
      ))

      setUpdateSuccess(true)
      setTimeout(() => setUpdateSuccess(false), 3000)
      setSelectedUser(null)
      setSelectedRole("")
    }
  }

  if (isAuthenticated && !isAdmin) return <Navigate to="/customer-dashboard" />
  if (!isAuthenticated && !loading) return <Navigate to="/login" />

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader title="Admin Dashboard" />

      <main className="max-w-7xl mx-auto py-6 px-4">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-2xl font-semibold">{users.length}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Suppliers</h3>
            <p className="text-2xl font-semibold">{supplierCount}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Fuel Types</h3>
            <ul className="text-sm">
              {fuelStock.map(fuel => (
                <li key={fuel._id}>
                  {fuel.type}: {fuel.liters}L @ Rs.{fuel.price}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Daily Fuel Sales</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="litersSold" stroke="#4F46E5" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Fuel Inventory Updates</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="litersAdded" stroke="#10B981" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>

          {updateSuccess && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              User role updated successfully!
            </div>
          )}

          {loading ? (
            <p>Loading users...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user._id}>
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "admin" ? "bg-purple-100 text-purple-800" :
                          user.role === "staff" ? "bg-green-100 text-green-800" :
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Change Role
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Role Update Modal */}
          {selectedUser && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-medium mb-4">
                  Update Role for {selectedUser.name}
                </h3>

                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="mb-4 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">Select a role</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="customer">Customer</option>
                </select>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setSelectedUser(null)
                      setSelectedRole("")
                    }}
                    className="px-4 py-2 border rounded text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRoleUpdate}
                    disabled={!selectedRole}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Update Role
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
