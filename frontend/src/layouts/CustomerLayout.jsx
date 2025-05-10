"use client"

import { useState, useRef } from "react"
import { Menu, X, LogOut, User, Upload } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const CustomerLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const navItems = [
    {
      name: "Dashboard",
      path: "/customer-dashboard",
    },
    {
      name: "Reservations",
      path: "/customer-dashboard/reservations",
    },
    {
      name: "Purchases",
      path: "/customer-dashboard/purchases",
    },
    {
      name: "Payments",
      path: "/customer-dashboard/payments",
    },
    {
      name: "History",
      path: "/customer-dashboard/history",
    },
    {
      name: "Settings",
      path: "/customer-dashboard/settings",
    },
  ]

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleImageClick = () => {
    fileInputRef.current.click()
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const imageData = reader.result
      setProfileImage(imageData)
      localStorage.setItem("profileImage", imageData)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">Fuel Management</h1>
              </div>
            </div>

            {/* User Profile - Desktop */}
            <div className="hidden md:flex items-center">
              <div className="flex items-center mr-4">
                <div
                  className="relative h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center cursor-pointer overflow-hidden group"
                  onClick={handleImageClick}
                >
                  {profileImage ? (
                    <>
                      <img
                        src={profileImage || "/placeholder.svg"}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="h-4 w-4 text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <User className="h-5 w-5 text-indigo-600" />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="h-4 w-4 text-white" />
                      </div>
                    </>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16 ${
                    location.pathname === item.path
                      ? "border-indigo-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </nav>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              {/* User Profile - Mobile */}
              <div className="flex items-center mr-2">
                <div
                  className="relative h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center cursor-pointer overflow-hidden group"
                  onClick={handleImageClick}
                >
                  {profileImage ? (
                    <>
                      <img
                        src={profileImage || "/placeholder.svg"}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="h-3 w-3 text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4 text-indigo-600" />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="h-3 w-3 text-white" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            {/* User Profile Info - Mobile Expanded */}
            <div className="pt-2 pb-3 border-b border-gray-200">
              <div className="px-4 flex items-center">
                <div className="flex-shrink-0">
                  <div
                    className="relative h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center cursor-pointer overflow-hidden group"
                    onClick={handleImageClick}
                  >
                    {profileImage ? (
                      <>
                        <img
                          src={profileImage || "/placeholder.svg"}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload className="h-4 w-4 text-white" />
                        </div>
                      </>
                    ) : (
                      <>
                        <User className="h-5 w-5 text-indigo-600" />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload className="h-4 w-4 text-white" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
              </div>
            </div>

            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    location.pathname === item.path
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {/* Mobile Logout Button */}
              <button
                onClick={handleLogout}
                className="flex w-full items-center pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">{children}</div>
        </div>
      </main>
    </div>
  )
}

export default CustomerLayout
