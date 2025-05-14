"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const ReservationSummary = ({ reservations }) => {
  const [statusData, setStatusData] = useState([])
  const [fuelTypeData, setFuelTypeData] = useState([])
  const [priorityData, setPriorityData] = useState([])
  const [dailyData, setDailyData] = useState([])

  useEffect(() => {
    if (!reservations || reservations.length === 0) return

    // Process status data
    const statusCounts = {
      pending: 0,
      approved: 0,
      rejected: 0,
    }

    // Process fuel type data
    const fuelTypeCounts = {}

    // Process priority data
    const priorityCounts = {
      high: 0,
      medium: 0,
      low: 0,
    }

    // Process daily data (last 7 days)
    const dailyCounts = {}
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateString = date.toISOString().split("T")[0]
      dailyCounts[dateString] = 0
    }

    reservations.forEach((reservation) => {
      // Count statuses
      if (statusCounts.hasOwnProperty(reservation.status)) {
        statusCounts[reservation.status]++
      }

      // Count fuel types
      if (fuelTypeCounts[reservation.fuelType]) {
        fuelTypeCounts[reservation.fuelType]++
      } else {
        fuelTypeCounts[reservation.fuelType] = 1
      }

      // Count priorities
      if (priorityCounts.hasOwnProperty(reservation.priority)) {
        priorityCounts[reservation.priority]++
      }

      // Count daily reservations (last 7 days)
      const reservationDate = new Date(reservation.createdAt).toISOString().split("T")[0]
      if (dailyCounts.hasOwnProperty(reservationDate)) {
        dailyCounts[reservationDate]++
      }
    })

    // Format data for charts
    setStatusData(
      Object.keys(statusCounts).map((status) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: statusCounts[status],
      })),
    )

    setFuelTypeData(
      Object.keys(fuelTypeCounts).map((fuelType) => ({
        name: fuelType,
        value: fuelTypeCounts[fuelType],
      })),
    )

    setPriorityData(
      Object.keys(priorityCounts).map((priority) => ({
        name: priority.charAt(0).toUpperCase() + priority.slice(1),
        value: priorityCounts[priority],
      })),
    )

    setDailyData(
      Object.keys(dailyCounts).map((date) => ({
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count: dailyCounts[date],
      })),
    )
  }, [reservations])

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]
  const STATUS_COLORS = {
    Pending: "#3b82f6", // blue
    Approved: "#10b981", // green
    Rejected: "#ef4444", // red
  }

  const PRIORITY_COLORS = {
    High: "#ef4444", // red
    Medium: "#f59e0b", // amber
    Low: "#10b981", // green
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Reservation Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Reservation Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} reservations`, "Count"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Priority Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} reservations`, "Count"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Reservations (Last 7 Days) */}
        <div className="bg-gray-50 p-4 rounded-lg lg:col-span-2">
          <h3 className="text-lg font-medium mb-3">Daily Reservations (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value) => [`${value} reservations`, "Count"]} />
                <Legend />
                <Bar dataKey="count" name="Reservations" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fuel Type Distribution */}
        <div className="bg-gray-50 p-4 rounded-lg lg:col-span-2">
          <h3 className="text-lg font-medium mb-3">Fuel Type Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fuelTypeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip formatter={(value) => [`${value} reservations`, "Count"]} />
                <Legend />
                <Bar dataKey="value" name="Reservations" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReservationSummary
