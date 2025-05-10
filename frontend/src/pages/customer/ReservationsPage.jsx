"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Plus, Trash2, AlertCircle } from "lucide-react"
import ReservationForm from "../../components/reservations/ReservationForm"
import DeleteConfirmationModal from "../../components/reservations/DeleteConfirmationModal"

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentReservation, setCurrentReservation] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  // Fetch user reservations
  const fetchReservations = async () => {
    try {
      setLoading(true)
      const response = await api.get("/reservations/user")
      setReservations(response.data.reservations)
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

  // Show success message for 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  // Handle reservation creation
  const handleCreateReservation = async (reservationData) => {
    try {
      const response = await api.post("/reservations/create", reservationData)
      setSuccessMessage(response.data.message)
      setShowReservationForm(false)
      fetchReservations()
      return { success: true }
    } catch (error) {
      console.error("Error creating reservation:", error)
      return { error: error.response?.data?.message || "Failed to create reservation" }
    }
  }

  // Handle reservation deletion
  const handleDeleteReservation = async (id) => {
    try {
      const response = await api.delete(`/reservations/${id}`)
      setSuccessMessage(response.data.message)
      setShowDeleteModal(false)
      fetchReservations()
    } catch (error) {
      console.error("Error deleting reservation:", error)
      setError(error.response?.data?.message || "Failed to delete reservation")
    }
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

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Fuel Reservations</h1>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => setShowReservationForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Make Reservation
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reservations</h3>
          <p className="mt-1 text-sm text-gray-500">You haven't made any fuel reservations yet.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowReservationForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Make your first reservation
            </button>
          </div>
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
                  Vehicle Number
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
                  Requested
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Allocated
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Price
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.map((reservation) => (
                <tr key={reservation._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{reservation.vehicleNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reservation.fuelType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reservation.requestedAmount} liters</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reservation.allocatedAmount} liters</div>
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
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                        reservation.status,
                      )}`}
                    >
                      {reservation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(reservation.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reservation.status === "pending" && (
                      <button
                        onClick={() => {
                          setCurrentReservation(reservation)
                          setShowDeleteModal(true)
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Cancel Reservation"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reservation Form Modal */}
      {showReservationForm && (
        <ReservationForm onClose={() => setShowReservationForm(false)} onSubmit={handleCreateReservation} />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentReservation && (
        <DeleteConfirmationModal
          reservation={currentReservation}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDeleteReservation(currentReservation._id)}
        />
      )}
    </div>
  )
}

export default ReservationsPage
