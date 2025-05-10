"use client"

import { useState } from "react"
import { X } from "lucide-react"

const AddInventoryModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fuelType: "",
    pricePerLiter: "",
    literQuantity: "",
    expiryDate: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    // Validate fuel type
    if (!formData.fuelType) {
      newErrors.fuelType = "Fuel type is required"
    }

    // Validate price per liter
    if (!formData.pricePerLiter) {
      newErrors.pricePerLiter = "Price per liter is required"
    } else if (isNaN(formData.pricePerLiter) || Number(formData.pricePerLiter) <= 0) {
      newErrors.pricePerLiter = "Price must be a positive number"
    } else if (Number(formData.pricePerLiter) > 1000) {
      newErrors.pricePerLiter = "Price cannot exceed $1000 per liter"
    }

    // Validate liter quantity
    if (!formData.literQuantity) {
      newErrors.literQuantity = "Quantity is required"
    } else if (isNaN(formData.literQuantity) || Number(formData.literQuantity) <= 0) {
      newErrors.literQuantity = "Quantity must be a positive number"
    } else if (Number(formData.literQuantity) > 1000000) {
      newErrors.literQuantity = "Quantity cannot exceed 1,000,000 liters"
    }

    // Validate expiry date
    if (!formData.expiryDate) {
      newErrors.expiryDate = "Expiry date is required"
    } else {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const expiryDate = new Date(formData.expiryDate)

      if (expiryDate < today) {
        newErrors.expiryDate = "Expiry date cannot be in the past"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      return
    }

    setLoading(true)

    const result = await onSubmit(formData)

    if (result && result.error) {
      setErrors({ form: result.error })
    }

    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Inventory</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {errors.form && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{errors.form}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
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
              <option value="Petrol 92">Petrol 92</option>
              <option value="Petrol 95">Petrol 95</option>
              <option value="Diesel">Diesel</option>
              <option value="Lanka Auto Diesel">Lanka Auto Diesel</option>
              <option value="Lanka Super Diesel">Lanka Super Diesel</option>
              
            </select>
            {errors.fuelType && <p className="mt-1 text-sm text-red-600">{errors.fuelType}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="pricePerLiter" className="block text-sm font-medium text-gray-700 mb-1">
              Price Per Liter ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="pricePerLiter"
              name="pricePerLiter"
              value={formData.pricePerLiter}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              max="1000"
              className={`w-full px-3 py-2 border ${
                errors.pricePerLiter ? "border-red-300" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Enter price per liter"
            />
            {errors.pricePerLiter && <p className="mt-1 text-sm text-red-600">{errors.pricePerLiter}</p>}
            <p className="mt-1 text-xs text-gray-500">Enter the price per liter in dollars (e.g., 3.50)</p>
          </div>

          <div className="mb-4">
            <label htmlFor="literQuantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity (Liters) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="literQuantity"
              name="literQuantity"
              value={formData.literQuantity}
              onChange={handleChange}
              min="1"
              max="1000000"
              className={`w-full px-3 py-2 border ${
                errors.literQuantity ? "border-red-300" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Enter quantity in liters"
            />
            {errors.literQuantity && <p className="mt-1 text-sm text-red-600">{errors.literQuantity}</p>}
            <p className="mt-1 text-xs text-gray-500">Enter the quantity of fuel in liters</p>
          </div>

          <div className="mb-6">
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className={`w-full px-3 py-2 border ${
                errors.expiryDate ? "border-red-300" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>}
            <p className="mt-1 text-xs text-gray-500">Select the expiry date for this fuel batch</p>
          </div>

          <div className="flex justify-end space-x-3">
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
              {loading ? "Adding..." : "Add Inventory"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddInventoryModal
