import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { InventoryAuth } from '../store/InventoryAuth'; // Updated import to inventoryAuth
import toast from 'react-hot-toast';

function InventoryPage() {

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentInventoryId, setCurrentInventoryId] = useState(null);

  const [fuelType, setFuelType] = useState('');
  const [pricePerLiter, setPricePerLiter] = useState('');
  const [literQuantity, setLiterQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const { inventoryItems, fetchInventory, isLoading, error, addInventory, updateInventory, deleteInventory } = InventoryAuth();

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleAddInventory = async (e) => {
    e.preventDefault();

    // Validate if all fields are filled
    if (!fuelType || !pricePerLiter || !literQuantity || !expiryDate) {
      toast.error('Please fill in all fields');  // Error toast if any field is empty
      return;
    }

    try {
      // Call the addInventory function from your store
      await addInventory(fuelType, pricePerLiter, literQuantity, expiryDate);
      toast.success('Inventory added successfully!'); // Success toast
      setShowModal(false);  // Close the modal after adding the inventory

      // Optionally, clear the form fields after adding inventory
      setFuelType('');
      setPricePerLiter('');
      setLiterQuantity('');
      setExpiryDate('');
    } catch (error) {
      // Handle error when adding inventory
      const errorMessage = error?.response?.data?.message || 'Please try again';
      toast.error(`Error adding inventory: ${errorMessage}`);
    }
  };

  const handleUpdateInventory = async (e) => {
    e.preventDefault();
  
    if (!fuelType || !pricePerLiter || !literQuantity || !expiryDate) {
      toast.error('Please fill in all fields');
      return;
    }
  
    console.log('Updating inventory with ID:', currentInventoryId);  // Debugging
  
    try {
      await updateInventory(currentInventoryId, fuelType, pricePerLiter, literQuantity, expiryDate);
      toast.success('Inventory updated successfully!');
      
      // Check if modal close is after update
      setShowModal(false);
      setFuelType('');
      setPricePerLiter('');
      setLiterQuantity('');
      setExpiryDate('');
      setIsEdit(false);
    } catch (error) {
      console.error("Update error:", error);  // Log the full error
      const errorMessage = error?.response?.data?.message || 'Please try again';
      toast.error(`Error updating inventory: ${errorMessage}`);
    }
  };

  const handleEditClick = (inventory) => {
    setIsEdit(true);
    setCurrentInventoryId(inventory._id);  // Set the current inventory ID for update
    setFuelType(inventory.fuelType);
    setPricePerLiter(inventory.pricePerLiter);
    setLiterQuantity(inventory.literQuantity);
    setExpiryDate(inventory.expiryDate);
    setShowModal(true);
  };

  const handleDeleteInventory = async (id) => {
    toast.promise(
      new Promise((resolve, reject) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this inventory item?");
        if (confirmDelete) {
          deleteInventory(id);
          resolve();
        } else {
          reject("Delete action cancelled");
        }
      }),
      {
        loading: 'Deleting inventory...',
        success: 'Inventory item deleted successfully!',
        error: (error) => error || 'Error deleting inventory item',
      }
    );
  };

  return (
    <div className="ml-64 p-10 bg-gray-100">
      {/* Title */}
      <h2 className="text-4xl font-semibold text-gray-700 mb-16 text-center">Current Inventory</h2>

      {/* Search Box & Add Button */}
      <div className="mb-4 flex items-center justify-between w-3/4 mx-auto">
        <input
          type="text"
          className="p-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search for inventory"
        />
        <button className="w-40 px-4 py-2 text-white bg-blue-600 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700" onClick={() => setShowModal(true)}>
          <FaPlus /> Add Inventory
        </button>
      </div>

      {/* Table */}
      <table className="w-3/4 max-w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mx-auto">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-4 py-2">Fuel Type</th>
            <th className="px-4 py-2">Price per Liter</th>
            <th className="px-4 py-2">Liter Quantity</th>
            <th className="px-4 py-2">Expiry Date</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="5" className="text-center py-4">Loading...</td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="5" className="text-center py-4 text-red-500">{error}</td>
            </tr>
          ) : (
            inventoryItems.map((inventory) => (
              <tr key={inventory._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-4 py-2">{inventory.fuelType}</td>
                <td className="px-4 py-2">{inventory.pricePerLiter}</td>
                <td className="px-4 py-2">{inventory.literQuantity}</td>
                <td className="px-4 py-2">{new Date(inventory.expiryDate).toLocaleDateString('en-GB')}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button className="px-3 py-1 text-white bg-green-500 rounded flex items-center gap-1 hover:bg-green-600" onClick={() => handleEditClick(inventory)}><FaEdit /></button>
                  <button className="px-3 py-1 text-white bg-red-500 rounded flex items-center gap-1 hover:bg-red-600" onClick={() => handleDeleteInventory(inventory._id)}><FaTrashAlt /></button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal for Adding Inventory */}
      {showModal && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl border border-gray-300">
            <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">{isEdit ? "Update Inventory" : "Add New Inventory"}</h2>
            <form className="flex flex-col space-y-4" onSubmit={isEdit ? handleUpdateInventory : handleAddInventory}>
              <div className="flex flex-col">
                <label className="md:text-lg">Fuel Type</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg" value={fuelType} onChange={(e) => setFuelType(e.target.value)} />
              </div>
              <div className="flex flex-col">
                <label className="md:text-lg">Price per Liter</label>
                <input type="number" className="w-full px-3 py-2 border rounded-lg" value={pricePerLiter} onChange={(e) => setPricePerLiter(e.target.value)} />
              </div>
              <div className="flex flex-col">
                <label className="md:text-lg">Liter Quantity</label>
                <input type="number" className="w-full px-3 py-2 border rounded-lg" value={literQuantity} onChange={(e) => setLiterQuantity(e.target.value)} />
              </div>
              <div className="flex flex-col">
                <label className="md:text-lg">Expiry Date</label>
                <input type="date" className="w-full px-3 py-2 border rounded-lg" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
              </div>

              <div className="flex justify-between">
                <button type="submit" className="w-1/2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">{isEdit ? "Update" : "Add"}</button>
                <button className="w-1/2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 ml-2" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default InventoryPage;