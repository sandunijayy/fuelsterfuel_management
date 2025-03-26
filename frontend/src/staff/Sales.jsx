import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { salesAuth } from "../store/salesAuth";
import toast from "react-hot-toast";
import StaffNavbar from "../components/StaffNavbar";

function Sales() {
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState(null);

  const [name, setName] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Added state for search query

  const {
    transactions,
    fetchTransactions,
    isLoading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = salesAuth();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleAddTransaction = async (e) => {
    e.preventDefault();

    // Validate if all fields are filled
    if (!name || !fuelType || !quantity || !price || !paymentMethod) {
      toast.error("Please fill in all fields"); // Error toast if any field is empty
      return;
    }

    try {
      // Call the addTransaction function from your store
      await addTransaction(name, fuelType, quantity, price, paymentMethod);

      fetchTransactions();

      toast.success("Transaction added successfully!"); // Success toast
      setShowModal(false); // Close the modal after adding the transaction

      // Optionally, clear the form fields after adding transaction
      setName("");
      setFuelType("");
      setQuantity("");
      setPrice("");
      setPaymentMethod("");
    } catch (error) {
      // Handle error when adding transaction
      const errorMessage = error?.response?.data?.message || "Please try again";
      toast.error(`Error adding transaction: ${errorMessage}`);
    }
  };

  const handleUpdateTransaction = async (e) => {
    e.preventDefault();

    if (!name || !fuelType || !quantity || !price || !paymentMethod) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await updateTransaction(
        currentTransactionId,
        name,
        fuelType,
        quantity,
        price,
        paymentMethod
      );
      toast.success("Transaction updated successfully!");
      setShowModal(false);
      setName("");
      setFuelType("");
      setQuantity("");
      setPrice("");
      setPaymentMethod("");
      setIsEdit(false); // Reset edit flag after updating
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Please try again";
      toast.error(`Error updating transaction: ${errorMessage}`);
    }
  };

  const handleEditClick = (transaction) => {
    setIsEdit(true);
    setCurrentTransactionId(transaction._id); // Set the current transaction ID for update
    setName(transaction.name);
    setFuelType(transaction.fuelType);
    setQuantity(transaction.quantity);
    setPrice(transaction.price);
    setPaymentMethod(transaction.paymentMethod);
    setShowModal(true);
  };

  const handleDeleteTransaction = async (id) => {
    toast.promise(
      new Promise((resolve, reject) => {
        const confirmDelete = window.confirm(
          "Are you sure you want to delete this transaction?"
        );
        if (confirmDelete) {
          deleteTransaction(id);
          resolve();
        } else {
          reject("Delete action cancelled");
        }
      }),
      {
        loading: "Deleting transaction...",
        success: "Transaction deleted successfully!",
        error: (error) => error || "Error deleting transaction",
      }
    );
  };

  const filteredTransactions = transactions.filter((transaction) => {
    return (
      transaction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.fuelType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.paymentMethod
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

  return (
    <>
      <StaffNavbar />
      <div className="p-10 bg-gray-100 h-screen w-full">
        <h2 className="text-4xl font-semibold text-gray-700 mb-16 text-center">
          Sales Transactions
        </h2>

        {/* Search Bar */}
        <div className="mb-4 flex items-center justify-between w-3/4 mx-auto">
          <input
            type="text"
            className="p-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search for transactions"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
          />
          <button
            className="w-40 px-4 py-2 text-white bg-blue-600 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700"
            onClick={() => setShowModal(true)}
          >
            <FaPlus /> Add Sale
          </button>
        </div>

        {/* Table */}
        <table className="w-3/4 max-w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mx-auto">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Fuel Type</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Total Price</th>
              <th className="px-4 py-2">Payment Method</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-red-500">
                  {error}
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction) => (
                <tr
                  key={transaction._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-4 py-2">{transaction.name}</td>
                  <td className="px-4 py-2">{transaction.fuelType}</td>
                  <td className="px-4 py-2">{transaction.quantity}</td>
                  <td className="px-4 py-2">{transaction.price}</td>
                  <td className="px-4 py-2">{transaction.paymentMethod}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button
                      className="px-3 py-1 text-white bg-green-500 rounded flex items-center gap-1 hover:bg-green-600"
                      onClick={() => handleEditClick(transaction)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="px-3 py-1 text-white bg-red-500 rounded flex items-center gap-1 hover:bg-red-600"
                      onClick={() => handleDeleteTransaction(transaction._id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Modal for Add/Update Transaction */}
        {showModal && (
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl border border-gray-300">
              <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">
                {isEdit ? "Update Transaction" : "Add New Transaction"}
              </h2>
              <form
                className="flex flex-col space-y-4"
                onSubmit={
                  isEdit ? handleUpdateTransaction : handleAddTransaction
                }
              >
                {/* Name Field */}
                <div className="flex flex-col">
                  <label className="md:text-lg">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={name}
                    onChange={(e) => {
                      // Regular expression to allow only alphabets and spaces
                      const nameRegex = /^[A-Za-z\s]*$/;

                      // If the input matches the regex, update the name state
                      if (
                        nameRegex.test(e.target.value) ||
                        e.target.value === ""
                      ) {
                        setName(e.target.value);
                      } else {
                        //toast.error("Special characters are not allowed in name");
                      }
                    }}
                  />
                </div>

                {/* Fuel Type Field */}
                <div className="flex flex-col">
                  <label className="md:text-lg">Fuel Type</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Super Diesel">Super Diesel</option>
                  </select>
                </div>

                {/* Quantity Field */}
                <div className="flex flex-col">
                  <label className="md:text-lg">Quantity</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                {/* Total Price Field */}
                <div className="flex flex-col">
                  <label className="md:text-lg">Total Price</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                {/* Payment Method Field */}
                <div className="flex flex-col">
                  <label className="md:text-lg">Payment Method</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="">Select Payment Method</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Mobile Payment">Mobile Pay</option>
                  </select>
                </div>

                {/* Submit and Cancel Buttons */}
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="w-1/2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    {isEdit ? "Update" : "Add"}
                  </button>
                  <button
                    className="w-1/2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 ml-2"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Sales;
