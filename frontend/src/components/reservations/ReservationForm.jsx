"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"

const ReservationForm = ({ onClose, onSubmit }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    customerName: user?.name || "",
    vehicleNumber: "",
    fuelType: "",
    requestedAmount: "",
    email: user?.email || "",
    phoneNumber: "",
  })
  const [priority, setPriority] = useState("medium")
  const [totalPrice, setTotalPrice] = useState(0)
  const [pricePerLiter, setPricePerLiter] = useState(0)
  const [availableFuel, setAvailableFuel] = useState(0)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [fetchingPrice, setFetchingPrice] = useState(false)

  // Emergency vehicles list
  const emergencyVehicles = ["ABC1234", "XYZ5678", "EMS9999", "ABC4556"]

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  // Fuel type options
  const fuelTypes = ["Petrol 92", "Petrol 95", "Diesel", "Lanka Auto Diesel", "Lanka Super Diesel"]

  // Check if vehicle is emergency vehicle
  useEffect(() => {
    if (formData.vehicleNumber) {
      const isEmergency = emergencyVehicles.includes(formData.vehicleNumber.toUpperCase())
      setPriority(isEmergency ? "high" : "medium")
    }
  }, [formData.vehicleNumber])

  // Fetch fuel price when fuel type changes
  useEffect(() => {
    const fetchFuelPrice = async () => {
      if (!formData.fuelType) return

      try {
        setFetchingPrice(true)
        const response = await api.get(`/reservations/fuel-price/${formData.fuelType}`)
        setPricePerLiter(response.data.pricePerLiter)
        setAvailableFuel(response.data.availableQuantity)
        setFetchingPrice(false)
      } catch (error) {
        console.error("Error fetching fuel price:", error)
        setErrors((prev) => ({
          ...prev,
          fuelType: "Failed to fetch fuel price. Please try again.",
        }))
        setFetchingPrice(false)
      }
    }

    fetchFuelPrice()
  }, [formData.fuelType])

  // Calculate total price when amount or price per liter changes
  useEffect(() => {
    if (formData.requestedAmount && pricePerLiter) {
      const amount = Number.parseFloat(formData.requestedAmount)
      const price = Number.parseFloat(pricePerLiter)
      if (!isNaN(amount) && !isNaN(price)) {
        setTotalPrice(amount * price)
      }
    } else {
      setTotalPrice(0)
    }
  }, [formData.requestedAmount, pricePerLiter])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validate customer name
    if (!formData.customerName) {
      newErrors.customerName = "Customer name is required"
    }

    // Validate vehicle number
    if (!formData.vehicleNumber) {
      newErrors.vehicleNumber = "Vehicle number is required"
    }

    // Validate fuel type
    if (!formData.fuelType) {
      newErrors.fuelType = "Fuel type is required"
    }

    // Validate requested amount
    if (!formData.requestedAmount) {
      newErrors.requestedAmount = "Fuel amount is required"
    } else if (isNaN(formData.requestedAmount) || Number(formData.requestedAmount) <= 0) {
      newErrors.requestedAmount = "Fuel amount must be a positive number"
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    // Validate phone number
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ""))) {
      newErrors.phoneNumber = "Phone number must be 10 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      return
    }

    setLoading(true)

    const result = await onSubmit({
      ...formData,
      requestedAmount: Number(formData.requestedAmount),
    })

    if (result && result.error) {
      setErrors({ form: result.error })
    }

    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Fuel Reservation</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {errors.form && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{errors.form}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.customerName ? "border-red-300" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter your name"
              />
              {errors.customerName && <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>}
            </div>

            <div>
              <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="vehicleNumber"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.vehicleNumber ? "border-red-300" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="e.g., ABC1234"
              />
              {errors.vehicleNumber && <p className="mt-1 text-sm text-red-600">{errors.vehicleNumber}</p>}
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <input
                type="text"
                id="priority"
                value={priority}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">Priority is determined by vehicle number</p>
            </div>

            <div>
              <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-1">
                Fuel Type <span className="text-red-500">*</span>
              </label>
              <select
                id="fuelType"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.fuelType ? "border-red-300" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              >
                <option value="">Select Fuel Type</option>
                {fuelTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.fuelType && <p className="mt-1 text-sm text-red-600">{errors.fuelType}</p>}
              {formData.fuelType && !fetchingPrice && (
                <p className="mt-1 text-xs text-gray-500">
                  Available: {availableFuel} liters | Price: ${pricePerLiter}/liter
                </p>
              )}
              {fetchingPrice && <p className="mt-1 text-xs text-gray-500">Fetching price...</p>}
            </div>

            <div>
              <label htmlFor="requestedAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Fuel Amount (Liters) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="requestedAmount"
                name="requestedAmount"
                value={formData.requestedAmount}
                onChange={handleChange}
                min="1"
                step="0.1"
                className={`w-full px-3 py-2 border ${
                  errors.requestedAmount ? "border-red-300" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter amount in liters"
              />
              {errors.requestedAmount && <p className="mt-1 text-sm text-red-600">{errors.requestedAmount}</p>}
            </div>

            <div>
              <label htmlFor="totalPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Total Price
              </label>
              <input
                type="text"
                id="totalPrice"
                value={`$${totalPrice.toFixed(2)}`}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.phoneNumber ? "border-red-300" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter your phone number"
              />
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Make Reservation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReservationForm
