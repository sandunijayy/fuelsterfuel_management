"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

const EditSaleModal = ({ transaction, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    fuelType: "",
    quantity: "",
    price: "",
    paymentMethod: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (transaction) {
      setFormData({
        name: transaction.name || "",
        fuelType: transaction.fuelType || "",
        quantity: transaction.quantity || "",
        price: transaction.price || "",
        paymentMethod: transaction.paymentMethod || "",
      })
    }
  }, [transaction])

  const validateForm = () => {
    const newErrors = {}

    // Validate customer name
    if (!formData.name) {
      newErrors.name = "Customer name is required"
    }

    // Validate fuel type
    if (!formData.fuelType) {
      newErrors.fuelType = "Fuel type is required"
    }

    // Validate quantity
    if (!formData.quantity) {
      newErrors.quantity = "Quantity is required"
    } else if (isNaN(formData.quantity) || Number(formData.quantity) <= 0) {
      newErrors.quantity = "Quantity must be a positive number"
    }

    // Validate price
    if (!formData.price) {
      newErrors.price = "Price is required"
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number"
    }

    // Validate payment method
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Payment method is required"
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

    const result = await onSubmit({
      ...formData,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
    })

    if (result && result.error) {
      setErrors({ form: result.error })
    }

    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Sale</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {errors.form && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{errors.form}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.name ? "border-red-300" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Enter customer name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

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
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity (Liters) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              className={`w-full px-3 py-2 border ${
                errors.quantity ? "border-red-300" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Enter quantity in liters"
            />
            {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Total Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              className={`w-full px-3 py-2 border ${
                errors.price ? "border-red-300" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Enter total price"
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method <span className="text-red-500">*</span>
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.paymentMethod ? "border-red-300" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            >
              <option value="">Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Mobile Payment">Mobile Payment</option>
            </select>
            {errors.paymentMethod && <p className="mt-1 text-sm text-red-600">{errors.paymentMethod}</p>}
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
              {loading ? "Updating..." : "Update Sale"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditSaleModal
