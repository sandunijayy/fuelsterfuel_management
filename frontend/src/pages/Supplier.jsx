import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // To navigate to FuelDataPage
import { SupplierAuth } from '../store/SupplierAuth';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';

function Supplier() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentSupplierId, setCurrentSupplierId] = useState(null);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [address, setAddress] = useState('');
  const [fuelType, setFuelType] = useState('');

  const { suppliers, fetchSuppliers, isLoading, error, addSupplier, updateSupplier, deleteSupplier } = SupplierAuth();

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleAddSupplier = async (e) => {
    e.preventDefault();
  
    if (!fullName || !email || !contactNo || !address || !fuelType) {
      toast.error('Please fill in all fields');
      return;
    }
  
    try {
      await addSupplier(fullName, email, contactNo, address, fuelType);
      toast.success('Supplier added successfully!');
      await fetchSuppliers();
      setShowModal(false);
      setFullName('');
      setEmail('');
      setContactNo('');
      setAddress('');
      setFuelType('');
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Error adding supplier. Please try again';
      toast.error(errorMessage);
    }
  };

  const handleUpdateSupplier = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !contactNo || !address || !fuelType) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await updateSupplier(currentSupplierId, fullName, email, contactNo, address, fuelType);
      toast.success('Supplier updated successfully!');
      setShowModal(false);
      setFullName('');
      setEmail('');
      setContactNo('');
      setAddress('');
      setFuelType('');
      setIsEdit(false);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Error updating supplier. Please try again';
      toast.error(errorMessage);
    }
  };

  const handleEditClick = (supplier) => {
    setIsEdit(true);
    setCurrentSupplierId(supplier._id);
    setFullName(supplier.fullName);
    setEmail(supplier.email);
    setContactNo(supplier.contactNo);
    setAddress(supplier.address);
    setFuelType(supplier.fuelType);
    setShowModal(true);
  };

  const handleDeleteSupplier = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this supplier?");
    if (confirmDelete) {
      try {
        await deleteSupplier(id);
        toast.success('Supplier deleted successfully!');
        setSuppliers((prevSuppliers) => prevSuppliers.filter((supplier) => supplier._id !== id));
      } catch (error) {
        toast.error(error?.response?.data?.message || "Error deleting supplier. Please try again.");
      }
    }
  };

 

 
  

  return (
    <div className='min-h-screen text-[#252422] bg-[#f3f5f0] px-4 md:px-14'>
      <h1 className='text-center font-semibold pt-16 md:text-2xl w-full max-w-xl mx-auto'>Suppliers</h1>

      {/* Add Supplier Button */}
      <div className="mb-4 flex items-center justify-between w-3/4 mx-auto">
        <button
          className="w-40 px-4 py-2 text-white bg-blue-600 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> Add Supplier
        </button>
      </div>

      {/* Table of Suppliers */}
      <table className="w-full text-sm text-left text-gray-500 mx-auto">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-4 py-2">Full Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Contact No</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">Fuel Type</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="7" className="text-center py-4">Loading...</td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="7" className="text-center py-4 text-red-500">{error}</td>
            </tr>
          ) : (
            suppliers.map((supplier) => (
              <tr key={supplier._id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-2">{supplier.fullName}</td>
                <td className="px-4 py-2">{supplier.email}</td>
                <td className="px-4 py-2">{supplier.contactNo}</td>
                <td className="px-4 py-2">{supplier.address}</td>
                <td className="px-4 py-2">{supplier.fuelType}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    className="px-3 py-1 text-white bg-green-500 rounded flex items-center gap-1 hover:bg-green-600"
                    onClick={() => handleEditClick(supplier)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="px-3 py-1 text-white bg-red-500 rounded flex items-center gap-1 hover:bg-red-600"
                    onClick={() => handleDeleteSupplier(supplier._id)}
                  >
                    <FaTrashAlt />
                  </button>
                  
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal for Adding/Editing Supplier */}
      {showModal && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl border border-gray-300">
            <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">
              {isEdit ? "Update Supplier" : "Add New Supplier"}
            </h2>
            <form className="flex flex-col space-y-4" onSubmit={isEdit ? handleUpdateSupplier : handleAddSupplier}>
              <div className="flex flex-col">
                <label className="md:text-lg">Full Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="md:text-lg">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="md:text-lg">Contact No</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="md:text-lg">Address</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="md:text-lg">Fuel Type</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="w-1/2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {isEdit ? "Update" : "Add"}
                </button>
                <button
                  className="w-1/2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
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
  );
}

export default Supplier;
