"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Plus, Edit, Trash2, ShoppingCart, Search, FileText } from "lucide-react"
import AddSupplierModal from "../../components/suppliers/AddSupplierModal"
import EditSupplierModal from "../../components/suppliers/EditSupplierModal"
import DeleteConfirmationModal from "../../components/suppliers/DeleteConfirmationModal"
import PlaceOrderModal from "../../components/suppliers/PlaceOrderModal"
import SupplierOrdersModal from "../../components/suppliers/SupplierOrdersModal"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([])
  const [filteredSuppliers, setFilteredSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showOrdersListModal, setShowOrdersListModal] = useState(false)
  const [currentSupplier, setCurrentSupplier] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  // Fetch all suppliers
  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      const response = await api.get("/suppliers/getAllsuppliers")
      setSuppliers(response.data.suppliers)
      setFilteredSuppliers(response.data.suppliers)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching suppliers:", error)
      setError(error.response?.data?.message || "Failed to fetch suppliers")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  // Filter suppliers based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSuppliers(suppliers)
    } else {
      const filtered = suppliers.filter(
        (supplier) =>
          supplier.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.contactNo.toString().includes(searchTerm) ||
          supplier.address.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredSuppliers(filtered)
    }
  }, [searchTerm, suppliers])

  // Show success message for 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  // Handle add supplier
  const handleAddSupplier = async (supplierData) => {
    try {
      const response = await api.post("/suppliers/addsupplier", supplierData)
      setSuccessMessage(response.data.message)
      setShowAddModal(false)
      fetchSuppliers()
    } catch (error) {
      console.error("Error adding supplier:", error)
      return { error: error.response?.data?.message || "Failed to add supplier" }
    }
  }

  // Handle edit supplier
  const handleEditSupplier = async (id, supplierData) => {
    try {
      const response = await api.put(`/suppliers/updatesupplier/${id}`, supplierData)
      setSuccessMessage(response.data.message)
      setShowEditModal(false)
      fetchSuppliers()
    } catch (error) {
      console.error("Error updating supplier:", error)
      return { error: error.response?.data?.message || "Failed to update supplier" }
    }
  }

  // Handle delete supplier
  const handleDeleteSupplier = async (id) => {
    try {
      const response = await api.delete(`/suppliers/deletesupplier/${id}`)
      setSuccessMessage(response.data.message)
      setShowDeleteModal(false)
      fetchSuppliers()
    } catch (error) {
      console.error("Error deleting supplier:", error)
      setError(error.response?.data?.message || "Failed to delete supplier")
    }
  }

  // Handle place order
  const handlePlaceOrder = async (orderData) => {
    try {
      const response = await api.post("/orders/placeorder", orderData)
      setSuccessMessage(
        `Order placed successfully! An email notification has been sent to ${currentSupplier.fullName} at ${currentSupplier.email}.`,
      )
      setShowOrderModal(false)
      return { success: true }
    } catch (error) {
      console.error("Error placing order:", error)
      return { error: error.response?.data?.message || "Failed to place order" }
    }
  }

  // Generate PDF report
  const generatePDFReport = () => {
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(18)
    doc.text("Suppliers Report", 14, 22)

    // Add date
    doc.setFontSize(11)
    doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 30)

    // Define the columns for the table
    const tableColumn = ["Name", "Email", "Contact", "Address"]

    // Define the rows for the table
    const tableRows = []

    // Add data to rows
    filteredSuppliers.forEach((supplier) => {
      const supplierData = [supplier.fullName, supplier.email, supplier.contactNo, supplier.address]
      tableRows.push(supplierData)
    })

    // Generate the table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        overflow: "linebreak",
        halign: "left",
      },
      headStyles: {
        fillColor: [66, 66, 66],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    })

    // Save the PDF
    doc.save(`suppliers-report-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Suppliers Management</h1>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
            >
              <Plus size={18} className="mr-1" />
              Add New Supplier
            </button>
            <button
              onClick={generatePDFReport}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
            >
              <FileText size={18} className="mr-1" />
              Generate Report
            </button>
          </div>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <p className="text-gray-600 mb-4">
          Manage your fuel suppliers. Add new suppliers, update information, or remove suppliers as needed.
        </p>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? "No suppliers match your search criteria." : "No suppliers found. Add your first supplier!"}
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
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contact
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Address
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
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{supplier.fullName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{supplier.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{supplier.contactNo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{supplier.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setCurrentSupplier(supplier)
                            setShowOrderModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Place Order"
                        >
                          <ShoppingCart size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setCurrentSupplier(supplier)
                            setShowOrdersListModal(true)
                          }}
                          className="text-purple-600 hover:text-purple-900"
                          title="View Orders"
                        >
                          <ShoppingCart size={18} className="rotate-180" />
                        </button>
                        <button
                          onClick={() => {
                            setCurrentSupplier(supplier)
                            setShowEditModal(true)
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setCurrentSupplier(supplier)
                            setShowDeleteModal(true)
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Supplier Modal */}
      {showAddModal && <AddSupplierModal onClose={() => setShowAddModal(false)} onSubmit={handleAddSupplier} />}

      {/* Edit Supplier Modal */}
      {showEditModal && currentSupplier && (
        <EditSupplierModal
          supplier={currentSupplier}
          onClose={() => setShowEditModal(false)}
          onSubmit={(data) => handleEditSupplier(currentSupplier._id, data)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentSupplier && (
        <DeleteConfirmationModal
          supplier={currentSupplier}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDeleteSupplier(currentSupplier._id)}
        />
      )}

      {/* Place Order Modal */}
      {showOrderModal && currentSupplier && (
        <PlaceOrderModal
          supplier={currentSupplier}
          onClose={() => setShowOrderModal(false)}
          onSubmit={(data) => handlePlaceOrder({ ...data, supplierId: currentSupplier._id })}
        />
      )}

      {/* Supplier Orders Modal */}
      {showOrdersListModal && currentSupplier && (
        <SupplierOrdersModal supplier={currentSupplier} onClose={() => setShowOrdersListModal(false)} />
      )}
    </div>
  )
}

export default SuppliersPage
