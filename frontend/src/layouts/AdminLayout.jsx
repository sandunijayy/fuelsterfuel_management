"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
  Users,
  Package,
  ShoppingCart,
  Layers,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  Bell,
  Home,
  Camera,
  X,
} from "lucide-react"
import axios from "axios"

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, updateProfileImage } = useAuth()

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  // Fetch notifications and unread count
  const fetchNotifications = async () => {
    try {
      const [notificationsRes, countRes] = await Promise.all([
        api.get("/notifications"),
        api.get("/notifications/unread-count"),
      ])
      setNotifications(notificationsRes.data.notifications)
      setUnreadCount(countRes.data.count)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  useEffect(() => {
    fetchNotifications()

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen)
  }

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
    if (!showNotifications && unreadCount > 0) {
      markAllAsRead()
    }
  }

  const openProfileModal = () => {
    setShowProfileModal(true)
  }

  const closeProfileModal = () => {
    setShowProfileModal(false)
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0])
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  const uploadProfileImage = async () => {
    if (!profileImage) return

    setIsUploading(true)

    try {
      // Create a FormData object to send the file
      const formData = new FormData()
      formData.append("profileImage", profileImage)

      // In a real application, you would upload to your server
      // For demonstration, we'll simulate a successful upload

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create a fake URL for the uploaded image
      const imageUrl = URL.createObjectURL(profileImage)

      // Update the user's profile image in the auth context
      await updateProfileImage(user._id, imageUrl)

      // Close the modal
      setShowProfileModal(false)
      setProfileImage(null)
    } catch (error) {
      console.error("Error uploading profile image:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications")
      setUnreadCount(0)
      fetchNotifications()
    } catch (error) {
      console.error("Error marking notifications as read:", error)
    }
  }

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await api.patch(`/notifications/${notification._id}`)
      }
      if (notification.link) {
        navigate(notification.link)
      }
      setShowNotifications(false)
      fetchNotifications()
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <Home className="w-5 h-5" />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: "Suppliers",
      path: "/admin/suppliers",
      icon: <Package className="w-5 h-5" />,
    },
    {
      name: "Reservations",
      path: "/admin/orders",
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      name: "Inventories",
      path: "/admin/inventories",
      icon: <Layers className="w-5 h-5" />,
    },
  ]

  // Default profile image if user doesn't have one
  const defaultProfileImage =
    "https://ui-avatars.com/api/?name=" + (user?.fullName || user?.username || "User") + "&background=4f46e5&color=fff"

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"} flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <h1 className={`font-bold text-xl text-indigo-600 ${isSidebarOpen ? "block" : "hidden"}`}>FuelCare System</h1>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-gray-200 focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isSidebarOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
              ></path>
            </svg>
          </button>
        </div>

        {/* User Profile in Sidebar */}
        <div className={`p-4 border-b ${isSidebarOpen ? "flex items-center" : "flex flex-col items-center"}`}>
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-200">
              <img
                src={user?.profileImage || defaultProfileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={openProfileModal}
              className="absolute -bottom-1 -right-1 bg-indigo-100 rounded-full p-1 border border-indigo-300 hover:bg-indigo-200"
              title="Update profile picture"
            >
              <Camera size={12} className="text-indigo-600" />
            </button>
          </div>
          {isSidebarOpen && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-700 truncate">
                {user?.fullName || user?.username || "Admin User"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email || "admin@example.com"}</p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center p-2 rounded-md ${location.pathname === item.path
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className={isSidebarOpen ? "block" : "hidden"}>{item.name}</span>
                </Link>
              </li>
            ))}

            <li>
              <button
                onClick={toggleSettings}
                className="w-full flex items-center justify-between p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <Settings className="w-5 h-5 mr-3" />
                  <span className={isSidebarOpen ? "block" : "hidden"}>Settings</span>
                </div>
                {isSidebarOpen && (
                  <span>
                    {isSettingsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                )}
              </button>
              {isSettingsOpen && isSidebarOpen && (
                <ul className="pl-10 mt-2 space-y-1">
                  <li>
                    <Link
                      to="/admin/profile"
                      className={`block p-2 rounded-md ${location.pathname === "/admin/profile"
                          ? "bg-indigo-100 text-indigo-700"
                          : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/security"
                      className={`block p-2 rounded-md ${location.pathname === "/admin/security"
                          ? "bg-indigo-100 text-indigo-700"
                          : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      Security
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 rounded-md text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className={isSidebarOpen ? "block" : "hidden"}>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none relative"
                aria-label="Notifications"
              >
                <Bell className="w-6 h-6 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
                  <div className="py-2 px-3 bg-gray-100 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-xs text-indigo-600 hover:text-indigo-800">
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-4 px-3 text-sm text-gray-500 text-center">No notifications</div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification._id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`py-2 px-3 border-b cursor-pointer hover:bg-gray-50 ${!notification.isRead ? "bg-blue-50" : ""
                            }`}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                            <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">{children}</main>
      </div>

      {/* Profile Image Upload Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Update Profile Picture</h3>
              <button onClick={closeProfileModal} className="text-gray-400 hover:text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-indigo-300">
                {profileImage ? (
                  <img
                    src={URL.createObjectURL(profileImage) || "/placeholder.svg"}
                    alt="New profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={user?.profileImage || defaultProfileImage}
                    alt="Current profile"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

              <button
                onClick={triggerFileInput}
                className="mt-4 flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
              >
                <Camera className="w-4 h-4 mr-2" />
                {profileImage ? "Change Image" : "Select Image"}
              </button>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeProfileModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={uploadProfileImage}
                disabled={!profileImage || isUploading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <span className="inline-block mr-2 animate-spin">⟳</span>
                    Uploading...
                  </>
                ) : (
                  "Upload Image"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminLayout
