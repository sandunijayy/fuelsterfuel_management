"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Plus, Edit, Trash2, Database, Search, FileText } from "lucide-react"
import AddInventoryModal from "../../components/inventory/AddInventoryModal"
import EditInventoryModal from "../../components/inventory/EditInventoryModal"
import DeleteConfirmationModal from "../../components/inventory/DeleteConfirmationModal"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

const InventoriesPage = () => {
  const [inventories, setInventories] = useState([])
  const [filteredInventories, setFilteredInventories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentInventory, setCurrentInventory] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  // Fetch all inventories
  const fetchInventories = async () => {
    try {
      setLoading(true)
      const response = await api.get("/inventory/get-all")
      setInventories(response.data.inventoryItems)
      setFilteredInventories(response.data.inventoryItems)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching inventories:", error)
      setError(error.response?.data?.message || "Failed to fetch inventories")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventories()
  }, [])

  // Filter inventories based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredInventories(inventories)
    } else {
      const filtered = inventories.filter(
        (inventory) =>
          inventory.fuelType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inventory.pricePerLiter.toString().includes(searchTerm) ||
          inventory.literQuantity.toString().includes(searchTerm) ||
          inventory.availableQuantity.toString().includes(searchTerm),
      )
      setFilteredInventories(filtered)
    }
  }, [searchTerm, inventories])

  // Show success message for 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  // Handle add inventory
  const handleAddInventory = async (inventoryData) => {
    try {
      const response = await api.post("/inventory/add", inventoryData)
      setSuccessMessage(response.data.message)
      setShowAddModal(false)
      fetchInventories()
      return { success: true }
    } catch (error) {
      console.error("Error adding inventory:", error)
      return { error: error.response?.data?.message || "Failed to add inventory" }
    }
  }

  // Handle edit inventory
  const handleEditInventory = async (id, inventoryData) => {
    try {
      const response = await api.put(`/inventory/update/${id}`, inventoryData)
      setSuccessMessage(response.data.message)
      setShowEditModal(false)
      fetchInventories()
      return { success: true }
    } catch (error) {
      console.error("Error updating inventory:", error)
      return { error: error.response?.data?.message || "Failed to update inventory" }
    }
  }

  // Handle delete inventory
  const handleDeleteInventory = async (id) => {
    try {
      const response = await api.delete(`/inventory/delete/${id}`)
      setSuccessMessage(response.data.message)
      setShowDeleteModal(false)
      fetchInventories()
    } catch (error) {
      console.error("Error deleting inventory:", error)
      setError(error.response?.data?.message || "Failed to delete inventory")
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Generate PDF report
  const generatePDFReport = () => {
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(18)
    doc.text("Inventory Report", 14, 22)

    // Add date
    doc.setFontSize(11)
    doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 30)

    // Define the columns for the table
    const tableColumn = ["Fuel Type", "Price/Liter ($)", "Quantity Added", "Available Quantity", "Expiry Date"]

    // Define the rows for the table
    const tableRows = []

    // Add data to rows
    filteredInventories.forEach((inventory) => {
      const inventoryData = [
        inventory.fuelType,
        inventory.pricePerLiter.toFixed(2),
        `${inventory.literQuantity.toLocaleString()} liters`,
        `${inventory.availableQuantity.toLocaleString()} liters`,
        formatDate(inventory.expiryDate),
      ]
      tableRows.push(inventoryData)
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
    doc.save(`inventory-report-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Inventory Management</h1>

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
              Add New Inventory
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
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <p className="text-gray-600 mb-4">
          Manage your fuel inventory. Add new fuel types, update quantities, or remove inventory items as needed.
        </p>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredInventories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm
              ? "No inventory items match your search criteria."
              : "No inventory items found. Add your first inventory item!"}
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
                    Fuel Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price Per Liter
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Quantity Added
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Available Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Expiry Date
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
                {filteredInventories.map((inventory) => (
                  <tr key={inventory._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-indigo-100 rounded-full">
                          <Database className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{inventory.fuelType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${inventory.pricePerLiter.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{inventory.literQuantity.toLocaleString()} liters</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{inventory.availableQuantity.toLocaleString()} liters</div>
                      <div
                        className={`h-2 w-24 bg-gray-200 rounded-full mt-1 overflow-hidden ${
                          inventory.availableQuantity < 1000
                            ? "bg-red-100"
                            : inventory.availableQuantity < 5000
                              ? "bg-yellow-100"
                              : "bg-green-100"
                        }`}
                      >
                        <div
                          className={`h-full ${
                            inventory.availableQuantity < 1000
                              ? "bg-red-500"
                              : inventory.availableQuantity < 5000
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              (inventory.availableQuantity / (inventory.literQuantity || 1)) * 100,
                              100,
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(inventory.expiryDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setCurrentInventory(inventory)
                            setShowEditModal(true)
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setCurrentInventory(inventory)
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

      {/* Add Inventory Modal */}
      {showAddModal && <AddInventoryModal onClose={() => setShowAddModal(false)} onSubmit={handleAddInventory} />}

      {/* Edit Inventory Modal */}
      {showEditModal && currentInventory && (
        <EditInventoryModal
          inventory={currentInventory}
          onClose={() => setShowEditModal(false)}
          onSubmit={(data) => handleEditInventory(currentInventory._id, data)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentInventory && (
        <DeleteConfirmationModal
          inventory={currentInventory}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDeleteInventory(currentInventory._id)}
        />
      )}
    </div>
  )
}

export default InventoriesPage
