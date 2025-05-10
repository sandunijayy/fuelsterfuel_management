"use client"

import { useState, useRef, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { ChevronLeft, ChevronRight, LogOut, Upload, User, Loader2 } from "lucide-react"

const ProfileSidebar = ({ navItems, children }) => {
  const { user, logout, updateProfileImage } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [profileImage, setProfileImage] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const fileInputRef = useRef(null)

  // Set profile image from user data when it's available
  useEffect(() => {
    if (user?.profileImage) {
      setProfileImage(user.profileImage)
    }
  }, [user])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleImageClick = () => {
    fileInputRef.current.click()
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Reset error state
    setUploadError("")

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size exceeds 5MB limit")
      return
    }

    // Check file type
    if (!file.type.match("image.*")) {
      setUploadError("Only image files are allowed")
      return
    }

    setUploading(true)

    try {
      // Create a FormData object to send the file
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", "ml_default") // Your upload preset
      formData.append("folder", "fuelManagement") // Your asset folder

      // Upload to Cloudinary
      const response = await fetch("https://api.cloudinary.com/v1_1/dpovp7pu2/image/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`)
      }

      const data = await response.json()

      if (data.secure_url) {
        // Update local state
        setProfileImage(data.secure_url)

        // Save to database via API
        if (user && user.userId) {
          const result = await updateProfileImage(user.userId, data.secure_url)
          if (!result.success) {
            console.error("Failed to update profile in database:", result.error)
            setUploadError("Image uploaded but failed to update profile. Please try again.")
          } else {
            console.log("Profile image updated successfully in database")
          }
        } else {
          console.error("User ID not available for profile update")
        }
      } else {
        throw new Error("No secure URL in response")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      setUploadError("Failed to upload image. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg transition-all duration-300 flex flex-col ${collapsed ? "w-20" : "w-64"} h-full`}
      >
        {/* Logo Area */}
        <div className="p-4 border-b flex justify-center">
          <div className="h-16 flex items-center justify-center">
            <div className="text-2xl font-bold text-indigo-600">{!collapsed ? "Fuel Management" : "FM"}</div>
            {/* You can replace the text with an actual logo image */}
            {/* <img src="/your-logo.png" alt="Logo" className="h-10" /> */}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-3">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    location.pathname === item.path ||
                    (item.path.endsWith("/") && location.pathname === item.path.slice(0, -1)) ||
                    (item.path === location.pathname + "/")
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Collapse Button */}
        <div className="p-4 border-t border-b">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            {!collapsed && <span className="ml-2">Collapse</span>}
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t">
          <div className="flex items-center">
            <div className="flex-shrink-0 relative">
              <div
                onClick={handleImageClick}
                className="w-10 h-10 rounded-full overflow-hidden cursor-pointer border-2 border-indigo-500 bg-gray-100 flex items-center justify-center"
              >
                {uploading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                ) : profileImage ? (
                  <img src={profileImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={24} className="text-gray-500" />
                )}
                {!uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                    <Upload className="text-white" size={16} />
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
            </div>
            {!collapsed && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-gray-700 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`mt-4 flex items-center justify-center w-full p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors ${
              collapsed ? "px-2" : "px-4"
            }`}
          >
            <LogOut size={20} />
            {!collapsed && <span className="ml-2">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export default ProfileSidebar
