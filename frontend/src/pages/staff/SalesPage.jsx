"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Plus, Edit, Trash2, Search, FileText } from "lucide-react"
import AddSaleModal from "../../components/sales/AddSaleModal"
import EditSaleModal from "../../components/sales/EditSaleModal"
import DeleteConfirmationModal from "../../components/sales/DeleteConfirmationModal"
import jsPDF from "jspdf"
// Fix: Import jspdf-autotable correctly
import autoTable from "jspdf-autotable"

const SalesPage = () => {
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentTransaction, setCurrentTransaction] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  // Fetch all transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await api.get("/sales/transactions")
      setTransactions(response.data.transactions)
      setFilteredTransactions(response.data.transactions)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching transactions:", error)
      setError(error.response?.data?.message || "Failed to fetch transactions")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  // Filter transactions based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTransactions(transactions)
    } else {
      const filtered = transactions.filter(
        (transaction) =>
          transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.fuelType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.quantity.toString().includes(searchTerm) ||
          transaction.price.toString().includes(searchTerm) ||
          transaction.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredTransactions(filtered)
    }
  }, [searchTerm, transactions])

  // Show success message for 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  // Handle add transaction
  const handleAddTransaction = async (transactionData) => {
    try {
      const response = await api.post("/sales/add-transaction", transactionData)
      setSuccessMessage(response.data.message)
      setShowAddModal(false)
      fetchTransactions()
      return { success: true }
    } catch (error) {
      console.error("Error adding transaction:", error)
      return { error: error.response?.data?.message || "Failed to add transaction" }
    }
  }

  // Handle edit transaction
  const handleEditTransaction = async (id, transactionData) => {
    try {
      const response = await api.put(`/sales/update-transaction/${id}`, transactionData)
      setSuccessMessage(response.data.message)
      setShowEditModal(false)
      fetchTransactions()
      return { success: true }
    } catch (error) {
      console.error("Error updating transaction:", error)
      return { error: error.response?.data?.message || "Failed to update transaction" }
    }
  }

  // Handle delete transaction
  const handleDeleteTransaction = async (id) => {
    try {
      const response = await api.delete(`/sales/delete-transaction/${id}`)
      setSuccessMessage(response.data.message)
      setShowDeleteModal(false)
      fetchTransactions()
    } catch (error) {
      console.error("Error deleting transaction:", error)
      setError(error.response?.data?.message || "Failed to delete transaction")
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Generate PDF report
  const generatePDFReport = () => {
    // Fix: Create jsPDF instance correctly
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(18)
    doc.text("Sales Report", 14, 22)

    // Add date
    doc.setFontSize(11)
    doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 30)

    // Calculate total sales and revenue
    const totalSales = filteredTransactions.length
    const totalRevenue = filteredTransactions.reduce((sum, transaction) => sum + transaction.price, 0)
    const totalQuantity = filteredTransactions.reduce((sum, transaction) => sum + transaction.quantity, 0)

    // Add summary
    doc.setFontSize(12)
    doc.text(`Total Sales: ${totalSales}`, 14, 40)
    doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 14, 47)
    doc.text(`Total Quantity: ${totalQuantity.toLocaleString()} liters`, 14, 54)

    // Define the columns for the table
    const tableColumn = ["Customer", "Fuel Type", "Quantity", "Price", "Payment Method", "Date"]

    // Define the rows for the table
    const tableRows = []

    // Add data to rows
    filteredTransactions.forEach((transaction) => {
      const transactionData = [
        transaction.name,
        transaction.fuelType,
        `${transaction.quantity.toLocaleString()} liters`,
        `$${transaction.price.toFixed(2)}`,
        transaction.paymentMethod,
        formatDate(transaction.createdAt),
      ]
      tableRows.push(transactionData)
    })

    // Generate the table using autoTable directly
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 65,
      styles: {
        fontSize: 9,
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
    doc.save(`sales-report-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Sales Management</h1>

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
              New Sale
            </button>
            <button
              onClick={generatePDFReport}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
            >
              <FileText size={18} className="mr-1" />
              Generate Report
            </button>
            {/* <button
              onClick={fetchTransactions}
              className="text-gray-600 hover:text-gray-900 flex items-center"
              title="Refresh"
            >
              <RefreshCw size={18} className="mr-1" />
              Refresh
            </button> */}
          </div>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search sales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? "No transactions match your search criteria." : "No transactions found. Add your first sale!"}
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
                    Customer Name
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
                    Quantity
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
                    Payment Method
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
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{transaction.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.fuelType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.quantity.toLocaleString()} liters</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${transaction.price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.paymentMethod === "Cash"
                            ? "bg-green-100 text-green-800"
                            : transaction.paymentMethod === "Card"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {transaction.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setCurrentTransaction(transaction)
                            setShowEditModal(true)
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setCurrentTransaction(transaction)
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

      {/* Add Transaction Modal */}
      {showAddModal && <AddSaleModal onClose={() => setShowAddModal(false)} onSubmit={handleAddTransaction} />}

      {/* Edit Transaction Modal */}
      {showEditModal && currentTransaction && (
        <EditSaleModal
          transaction={currentTransaction}
          onClose={() => setShowEditModal(false)}
          onSubmit={(data) => handleEditTransaction(currentTransaction._id, data)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentTransaction && (
        <DeleteConfirmationModal
          transaction={currentTransaction}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDeleteTransaction(currentTransaction._id)}
        />
      )}
    </div>
  )
}

export default SalesPage
