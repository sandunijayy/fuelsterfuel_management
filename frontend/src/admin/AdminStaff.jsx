import React, { useState,useEffect  } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import {employeeAuth} from "../store/employeeAuth"
import toast from 'react-hot-toast';
import AdminNavbar from '../components/AdminNavbar';

function AdminStaff() {

  const [showModal, setShowModal] = useState(false);

  const [isEdit, setIsEdit] = useState(false);  
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { employees, fetchEmployees, isLoading, error, addEmployee,updateEmployee , deleteEmployee} = employeeAuth();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);


  const handleAddEmployee = async (e) => {
    e.preventDefault();
  
    // Validate if all fields are filled
    if (!fullName || !email || !position || !joinDate || !username || !password) {
      toast.error('Please fill in all fields');  // Error toast if any field is empty
      return;
    }
  
    try {
      // Call the addEmployee function from your store
      await addEmployee(fullName, email, position, joinDate, username, password);
      toast.success('Employee added successfully!'); // Success toast
      setShowModal(false);  // Close the modal after adding the employee
  
      // Optionally, clear the form fields after adding employee
      setFullName('');
      setEmail('');
      setPosition('');
      setJoinDate('');
      setUsername('');
      setPassword('');
    } catch (error) {
      // Handle error when adding employee
      const errorMessage = error?.response?.data?.message || 'Please try again';
      toast.error(`Error adding employee: ${errorMessage}`);
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !position || !joinDate || !username || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await updateEmployee(currentEmployeeId, fullName, email, position, joinDate, username, password);
      toast.success('Employee updated successfully!');
      setShowModal(false);
      setFullName('');
      setEmail('');
      setPosition('');
      setJoinDate('');
      setUsername('');
      setPassword('');
      setIsEdit(false);  // Reset edit flag after updating
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Please try again';
      toast.error(`Error updating employee: ${errorMessage}`);
    }
  };

  const handleEditClick = (employee) => {
    setIsEdit(true);
    setCurrentEmployeeId(employee._id);  // Set the current employee ID for update
    setFullName(employee.fullName);
    setEmail(employee.email);
    setPosition(employee.position);
    setJoinDate(employee.joinDate);
    setUsername(employee.username);
    setPassword(employee.password);
    setShowModal(true);
  };

  const handleDeleteEmployee = async (id) => {
    toast.promise(
      new Promise((resolve, reject) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
        if (confirmDelete) {
          deleteEmployee(id);
          resolve();
        } else {
          reject("Delete action cancelled");
        }
      }),
      {
        loading: 'Deleting employee...',
        success: 'Employee deleted successfully!',
        error: (error) => error || 'Error deleting employee',
      }
    );
  };

  return (

    <>
    <AdminNavbar/>
    <div className="ml-64 p-10 bg-gray-100">
    {/* Title */}
    <h2 className="text-4xl font-semibold text-gray-700 mb-16 text-center">Current Employees</h2>

    {/* Search Box & Add Button */}
    <div className="mb-4 flex items-center justify-between w-3/4 mx-auto">
      <input
        type="text"
        className="p-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Search for employees"
      />
      <button className="w-40 px-4 py-2 text-white bg-blue-600 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 " onClick={() => setShowModal(true)}>
      <FaPlus /> Add Employee
      </button>
    </div>

    {/* Table */}
    <table className="w-3/4 max-w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mx-auto">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Email</th>
          <th className="px-4 py-2">Position</th>
          <th className="px-4 py-2">Join Date</th>
          <th className="px-4 py-2">Username</th>
          <th className="px-4 py-2">Password</th>
          <th className="px-4 py-2">Action</th>
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
            employees.map((employee) => (
              <tr key={employee.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-4 py-2">{employee.fullName}</td>
                <td className="px-4 py-2">{employee.email}</td>
                <td className="px-4 py-2">{employee.position}</td>
                {new Date(employee.joinDate).toLocaleDateString('en-GB')}
                <td className="px-4 py-2">{employee.username}</td>
                <td className="px-4 py-2">{employee.password}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button className="px-3 py-1 text-white bg-green-500 rounded flex items-center gap-1 hover:bg-green-600" onClick={() => handleEditClick(employee)}><FaEdit /></button>
                  <button className="px-3 py-1 text-white bg-red-500 rounded flex items-center gap-1 hover:bg-red-600" onClick={() => handleDeleteEmployee(employee._id)}><FaTrashAlt /></button>
                </td>
              </tr>
            ))
          )}
      </tbody>
    </table>

    {/* Modal for Adding Employee */}
    {showModal && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl border border-gray-300">
            <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">{isEdit ? "Update Employee" : "Add New Employee"}</h2>
            <form className="flex flex-col space-y-4" onSubmit={isEdit ? handleUpdateEmployee : handleAddEmployee}>
              <div className="flex flex-col">
                <label className="md:text-lg">Full Name</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="flex flex-col">
                <label className="md:text-lg">Email</label>
                <input type="email" className="w-full px-3 py-2 border rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="flex flex-col">
                <label className="md:text-lg">Position</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg" value={position} onChange={(e) => setPosition(e.target.value)} />
              </div>
              <div className="flex flex-col">
                <label className="md:text-lg">Join Date</label>
                <input type="date" className="w-full px-3 py-2 border rounded-lg" value={joinDate} onChange={(e) => setJoinDate(e.target.value)}/>
              </div>
              <div className="flex flex-col">
                <label className="md:text-lg">Username</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="flex flex-col">
                <label className="md:text-lg">Password</label>
                <input type="password" className="w-full px-3 py-2 border rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} />
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

  </>
  )
}

export default AdminStaff
