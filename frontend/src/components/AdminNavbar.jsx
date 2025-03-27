import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { userAuth } from '../store/userAuth';
import toast from 'react-hot-toast';
import logoImage from "../assets/logoImage.png" 

function AdminNavbar() {

  const { user, logout } = userAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {

    const { message } = await logout()
    toast.success(message)
    navigate('/');
  }

  return (

    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col justify-between p-4 fixed">
      {/* Logo Placeholder */}
      <div className="h-16 flex items-center justify-center border-b border-gray-700 mb-4">
        <img src={logoImage} alt="" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-3">
        <div>
          <Link to="/admindash" className="flex items-center p-2 hover:bg-gray-700 rounded-md">🏠 Dashboard</Link>
          <Link to="/staff" className="flex items-center p-2 hover:bg-gray-700 rounded-md">🧑‍💻  Staff</Link>
          <Link to="/suppliers" className="flex items-center p-2 hover:bg-gray-700 rounded-md">🚚 Suppliers</Link>
          <Link to="/customerdetails" className="flex items-center p-2 hover:bg-gray-700 rounded-md">👥 Customers</Link>
          <Link to="/AdminReservation" className="flex items-center p-2 hover:bg-gray-700 rounded-md">📂 Reservations</Link>
          <Link to="/orders" className="flex items-center p-2 hover:bg-gray-700 rounded-md">📦 Orders</Link>
          <Link to="/inventory" className="flex items-center p-2 hover:bg-gray-700 rounded-md">📂 Inventories</Link>
          <Link to="/reports" className="flex items-center p-2 hover:bg-gray-700 rounded-md">📊 Reports</Link>
        </div>
      </nav>

      {/* Profile and Logout */}
      <div className="border-t border-gray-700 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/path-to-profile-image.jpg"  // Replace with actual image
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <span>{user.username}</span>
        </div>
        <button className="text-red-500 hover:text-red-700" onClick={handleLogout}>
          {/* <LogOut size={20} /> */} Logout
        </button>
      </div>
    </div>

  )
}

export default AdminNavbar                                                                
