"use client"

import { useState } from "react"
import { X, Info, Mail } from "lucide-react"
import emailjs from "@emailjs/browser"

const PlaceOrderModal = ({ supplier, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fuelType: "",
    quantity: "",
    deliveryDate: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    // Required fields
    if (!formData.fuelType) {
      setError("Please select a fuel type")
      return false
    }

    if (!formData.quantity) {
      setError("Please enter a quantity")
      return false
    }

    if (!formData.deliveryDate) {
      setError("Please select a delivery date")
      return false
    }

    // Validate quantity
    if (isNaN(formData.quantity) || Number(formData.quantity) <= 0) {
      setError("Quantity must be a positive number")
      return false
    }

    // Minimum order quantity
    if (Number(formData.quantity) < 100) {
      setError("Minimum order quantity is 100 liters")
      return false
    }

    // Maximum order quantity
    if (Number(formData.quantity) > 50000) {
      setError("Maximum order quantity is 50,000 liters")
      return false
    }

    // Validate delivery date (must be in the future)
    const deliveryDate = new Date(formData.deliveryDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (deliveryDate < today) {
      setError("Delivery date must be today or in the future")
      return false
    }

    // Maximum lead time (30 days)
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30)
    if (deliveryDate > maxDate) {
      setError("Delivery date cannot be more than 30 days in the future")
      return false
    }

    return true
  }

  const sendEmailNotification = async () => {
    try {
      setEmailLoading(true)

      // EmailJS configuration
      const serviceId = "service_zaxp2fr"
      const templateId = "template_gwnveze"
      const publicKey = "S6uqyHRkXzol1Xhrx"

      // Create template parameters for EmailJS
      const templateParams = {
        from_email: supplier.email,
        from_fueltype: formData.fuelType,
        from_quantity: formData.quantity,
        from_deliverydate: formData.deliveryDate,
        supplier_name: supplier.fullName,
        order_id: `ORD-${Date.now().toString().slice(-6)}`,
        company_name: "FuelCare Management System",
      }

      // Send email using EmailJS
      const response = await emailjs.send(serviceId, templateId, templateParams, publicKey)

      console.log("Email sent successfully:", response)
      setEmailSent(true)
      setEmailLoading(false)
      return true
    } catch (error) {
      console.error("Error sending email:", error)
      setError(`Email sending failed: ${error.message || "Unknown error"}`)
      setEmailLoading(false)
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setEmailSent(false)

    // Validate form
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // First send the email notification
      const emailResult = await sendEmailNotification()

      if (!emailResult) {
        setLoading(false)
        return // Stop if email sending failed
      }

      // Then submit the order
      const result = await onSubmit(formData)

      if (result && result.error) {
        setError(result.error)
        setLoading(false)
        return
      }

      // Close modal after both operations are successful
      setTimeout(() => {
        onClose()
      }, 2000) // Give user time to see the success message
    } catch (error) {
      console.error("Error in order submission:", error)
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Place Order</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {error && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

        {emailSent && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-start">
            <Mail className="mr-2 h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-medium">Email notification sent!</p>
              <p className="text-sm">A confirmation email has been sent to {supplier.email}</p>
            </div>
          </div>
        )}

        <div className="mb-6 bg-indigo-50 p-4 rounded-md">
          <div className="flex items-start">
            <Info size={20} className="text-indigo-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-indigo-800">Supplier Information</h3>
              <p className="text-sm text-indigo-700 mt-1">
                <strong>Name:</strong> {supplier.fullName}
              </p>
              <p className="text-sm text-indigo-700">
                <strong>Email:</strong> {supplier.email}
              </p>
              <p className="text-sm text-indigo-700">
                <strong>Contact:</strong> {supplier.contactNo}
              </p>
              <p className="text-xs mt-2 text-indigo-600">
                An email notification will be sent to this supplier when the order is placed.
              </p>
            </div>
          </div>
        </div>

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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select Fuel Type</option>
              <option value="Petrol 92">Petrol 92</option>
              <option value="Petrol 95">Petrol 95</option>
              <option value="Diesel">Diesel</option>
              <option value="Lanka Auto Diesel">Lanka Auto Diesel</option>
              <option value="Lanka Super Diesel">Lanka Super Diesel</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">Select the type of fuel you want to order</p>
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
              min="100"
              max="50000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter quantity (min: 100)"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Minimum: 100 liters, Maximum: 50,000 liters</p>
          </div>

          <div className="mb-6">
            <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="deliveryDate"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              max={new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Select a date between today and 30 days from now</p>
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
              disabled={loading || emailLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading || emailLoading ? (
                <>
                  <span className="inline-block mr-2 animate-spin">⟳</span>
                  {emailLoading ? "Sending Email..." : "Placing Order..."}
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PlaceOrderModal
