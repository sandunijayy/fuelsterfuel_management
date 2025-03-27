import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { InventoryAuth } from '../store/InventoryAuth';
import toast from 'react-hot-toast';
import AdminNavbar from '../components/AdminNavbar';

function InventoryPage() {
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentInventoryId, setCurrentInventoryId] = useState(null);
    const [fuelType, setFuelType] = useState('');
    const [pricePerLiter, setPricePerLiter] = useState('');
    const [literQuantity, setLiterQuantity] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');  // ✅ Search state

    const { inventoryItems, fetchInventory, isLoading, error, addInventory, updateInventory, deleteInventory } = InventoryAuth();

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    const handleAddInventory = async (e) => {
        e.preventDefault();
        if (!fuelType || !pricePerLiter || !literQuantity || !expiryDate) {
            toast.error('Please fill in all fields');
            return;
        }
        try {
            await addInventory(fuelType, pricePerLiter, literQuantity, expiryDate);
            toast.success('Inventory added successfully!');

            // Fetch updated inventory list after adding new item
            await fetchInventory();  // Reload the inventory items

            setShowModal(false);
            setFuelType('');
            setPricePerLiter('');
            setLiterQuantity('');
            setExpiryDate('');
        } catch (error) {
            toast.error(`Error adding inventory: ${error?.response?.data?.message || 'Please try again'}`);
        }
    };


    const handleUpdateInventory = async (e) => {
        e.preventDefault();
        if (!fuelType || !pricePerLiter || !literQuantity || !expiryDate) {
            toast.error('Please fill in all fields');
            return;
        }
        try {
            await updateInventory(currentInventoryId, fuelType, pricePerLiter, literQuantity, expiryDate);
            toast.success('Inventory updated successfully!');
            setShowModal(false);
            setFuelType('');
            setPricePerLiter('');
            setLiterQuantity('');
            setExpiryDate('');
            setIsEdit(false);
        } catch (error) {
            toast.error(`Error updating inventory: ${error?.response?.data?.message || 'Please try again'}`);
        }
    };

    const handleEditClick = (inventory) => {
        setIsEdit(true);
        setCurrentInventoryId(inventory._id);
        setFuelType(inventory.fuelType);
        setPricePerLiter(inventory.pricePerLiter);
        setLiterQuantity(inventory.literQuantity);
        setExpiryDate(inventory.expiryDate);
        setShowModal(true);
    };

    const handleDeleteInventory = async (id) => {
        toast.promise(
            new Promise((resolve, reject) => {
                if (window.confirm("Are you sure you want to delete this inventory item?")) {
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

    // ✅ Filter inventory based on search input
    const filteredInventory = inventoryItems.filter((item) =>
        item.fuelType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.pricePerLiter.toString().includes(searchQuery) ||
        item.literQuantity.toString().includes(searchQuery) ||
        new Date(item.expiryDate).toLocaleDateString('en-GB').includes(searchQuery)
    );

    return (
        <>
            <AdminNavbar />
            <div className="ml-64 p-10 bg-gray-100">
                <h2 className="text-4xl font-semibold text-gray-700 mb-16 text-center">Current Inventory</h2>

                {/* ✅ Search Input & Add Button */}
                <div className="mb-4 flex items-center justify-between w-3/4 mx-auto">
                    <input
                        type="text"
                        className="p-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search for inventory"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="w-40 px-4 py-2 text-white bg-blue-600 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700" onClick={() => setShowModal(true)}>
                        <FaPlus /> Add Inventory
                    </button>
                </div>

                {/* ✅ Inventory Table */}
                <table className="w-3/4 max-w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mx-auto">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-4 py-2">Fuel Type</th>
                            <th className="px-4 py-2">Price per Liter</th>
                            <th className="px-4 py-2">Liter Quantity</th>
                            <th className="px-4 py-2">Available Quantity</th>
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
                            filteredInventory.map((inventory) => (
                                <tr key={inventory._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-4 py-2">{inventory.fuelType}</td>
                                    <td className="px-4 py-2">{inventory.pricePerLiter}</td>
                                    <td className="px-4 py-2">{inventory.literQuantity}</td>
                                    <td className="px-4 py-2">{inventory.availableQuantity}</td>
                                    <td className="px-4 py-2">{new Date(inventory.expiryDate).toLocaleDateString('en-GB')}</td>
                                    <td className="px-4 py-2 flex space-x-2">
                                        <button className="px-3 py-1 text-white bg-green-500 rounded flex items-center gap-1 hover:bg-green-600" onClick={() => handleEditClick(inventory)}>
                                            <FaEdit />
                                        </button>
                                        <button className="px-3 py-1 text-white bg-red-500 rounded flex items-center gap-1 hover:bg-red-600" onClick={() => handleDeleteInventory(inventory._id)}>
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Modal for Add/Update Inventory */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h3 className="text-2xl font-semibold mb-4">{isEdit ? 'Edit Inventory' : 'Add Inventory'}</h3>
                            <form onSubmit={isEdit ? handleUpdateInventory : handleAddInventory}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
                                    <input
                                        type="text"
                                        value={fuelType}
                                        onChange={(e) => setFuelType(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        placeholder="Fuel Type"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Price per Liter</label>
                                    <input
                                        type="number"
                                        value={pricePerLiter}
                                        onChange={(e) => setPricePerLiter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        placeholder="Price per Liter"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Liter Quantity</label>
                                    <input
                                        type="number"
                                        value={literQuantity}
                                        onChange={(e) => setLiterQuantity(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        placeholder="Liter Quantity"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                    <input
                                        type="date"
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 text-white bg-blue-600 rounded"
                                    >
                                        {isEdit ? 'Update Inventory' : 'Add Inventory'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-2 text-white bg-gray-500 rounded"
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

export default InventoryPage;