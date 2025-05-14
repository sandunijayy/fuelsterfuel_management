"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Search, AlertCircle, Filter, Trash2, FileText } from "lucide-react"
import DeleteConfirmationModal from "../../components/reservations/DeleteConfirmationModal"
import ReportModal from "../../components/admin/ReportModal"

const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState([])
  const [filteredReservations, setFilteredReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [currentReservation, setCurrentReservation] = useState(null)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  // Fetch all reservations
  const fetchReservations = async () => {
    try {
      setLoading(true)
      const response = await api.get("/reservations/admin/all")
      setReservations(response.data.reservations)
      setFilteredReservations(response.data.reservations)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching reservations:", error)
      setError(error.response?.data?.message || "Failed to fetch reservations")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  // Filter reservations based on search term and status
  useEffect(() => {
    let filtered = reservations

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((reservation) => reservation.status === statusFilter)
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (reservation) =>
          reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.fuelType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.phoneNumber.includes(searchTerm),
      )
    }

    setFilteredReservations(filtered)
  }, [searchTerm, statusFilter, reservations])

  // Show success message for 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  // Handle reservation status update
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await api.patch(`/reservations/admin/${id}`, { status: newStatus })
      setSuccessMessage(
        `Reservation status updated to ${newStatus}. ${newStatus === "approved" ? "QR code is now available to the customer." : ""}`,
      )
      fetchReservations()
    } catch (error) {
      console.error("Error updating reservation status:", error)
      setError(error.response?.data?.message || "Failed to update reservation status")
    }
  }

  // Handle delete reservation
  const handleDeleteReservation = async (id) => {
    try {
      const response = await api.delete(`/reservations/admin/${id}`)
      setSuccessMessage(response.data.message || "Reservation deleted successfully")
      setShowDeleteModal(false)
      fetchReservations()
    } catch (error) {
      console.error("Error deleting reservation:", error)
      setError(error.response?.data?.message || "Failed to delete reservation")
    }
  }

  // Handle show delete modal
  const handleShowDeleteModal = (reservation) => {
    setCurrentReservation(reservation)
    setShowDeleteModal(true)
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Get priority badge color
  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Generate and download CSV report
  const generateCSVReport = (data, includeAll = false) => {
    setIsGeneratingReport(true)

    try {
      // Define the columns for the CSV
      const columns = [
        "Customer Name",
        "Email",
        "Phone",
        "Vehicle Number",
        "Fuel Type",
        "Requested Amount (L)",
        "Allocated Amount (L)",
        "Total Price ($)",
        "Priority",
        "Status",
        "Created Date",
        "QR Code Available",
      ]

      // Create CSV header row
      let csvContent = columns.join(",") + "\n"

      // Determine which data to use
      const reportData = includeAll ? reservations : filteredReservations

      // Add data rows
      reportData.forEach((reservation) => {
        const row = [
          `"${reservation.customerName.replace(/"/g, '""')}"`, // Escape quotes in CSV
          `"${reservation.email.replace(/"/g, '""')}"`,
          `"${reservation.phoneNumber}"`,
          `"${reservation.vehicleNumber}"`,
          `"${reservation.fuelType}"`,
          reservation.requestedAmount,
          reservation.allocatedAmount,
          reservation.totalPrice.toFixed(2),
          `"${reservation.priority}"`,
          `"${reservation.status}"`,
          `"${formatDate(reservation.createdAt)}"`,
          reservation.status === "approved" ? "Yes" : "No",
        ]
        csvContent += row.join(",") + "\n"
      })

      // Create a blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `fuel-reservations-report-${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setSuccessMessage("Report generated and downloaded successfully")
    } catch (error) {
      console.error("Error generating report:", error)
      setError("Failed to generate report. Please try again.")
    } finally {
      setIsGeneratingReport(false)
      setShowReportModal(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Fuel Reservations Management</h1>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search reservations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setShowReportModal(true)}
            disabled={isGeneratingReport || filteredReservations.length === 0}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText size={18} className="mr-2" />
            {isGeneratingReport ? "Generating..." : "Generate Report"}
          </button>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                When you approve a reservation, a QR code will be made available to the customer. They can use this QR
                code at the fuel station.
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-4">
          Manage customer fuel reservations. Review and approve or reject reservation requests.
        </p>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reservations found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "No reservations match your search criteria."
                : "There are no fuel reservations in the system."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Vehicle
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fuel Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Priority
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    QR Code
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.map((reservation) => (
                  <tr key={reservation._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{reservation.customerName}</div>
                      <div className="text-xs text-gray-500">{reservation.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{reservation.vehicleNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{reservation.fuelType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{reservation.allocatedAmount} liters</div>
                      {reservation.requestedAmount !== reservation.allocatedAmount && (
                        <div className="text-xs text-gray-500">Requested: {reservation.requestedAmount} liters</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${reservation.totalPrice.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeColor(
                          reservation.priority,
                        )}`}
                      >
                        {reservation.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={reservation.status}
                        onChange={(e) => handleStatusChange(reservation._id, e.target.value)}
                        className={`px-2 py-1 text-xs font-semibold rounded border ${getStatusBadgeColor(
                          reservation.status,
                        )}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(reservation.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {reservation.status === "approved" ? (
                          <span className="text-green-600 font-medium">Available</span>
                        ) : (
                          <span className="text-gray-400">Unavailable</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleShowDeleteModal(reservation)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Reservation"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentReservation && (
        <DeleteConfirmationModal
          reservation={currentReservation}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDeleteReservation(currentReservation._id)}
        />
      )}

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          onClose={() => setShowReportModal(false)}
          onGenerateFiltered={() => generateCSVReport(filteredReservations, false)}
          onGenerateAll={() => generateCSVReport(reservations, true)}
          filteredCount={filteredReservations.length}
          totalCount={reservations.length}
          isGenerating={isGeneratingReport}
        />
      )}
    </div>
  )
}

export default AdminReservationsPage
