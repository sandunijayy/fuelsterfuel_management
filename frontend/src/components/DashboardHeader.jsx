"use client"

import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { LogOut } from "lucide-react" // Assuming you have lucide-react installed

const DashboardHeader = ({ title }) => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Welcome, <span className="font-medium">{user?.name}</span> ({user?.role})
          </span>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
