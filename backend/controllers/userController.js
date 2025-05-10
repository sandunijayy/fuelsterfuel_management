import User from "../models/User.js"

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password")
    res.status(200).json({ users, count: users.length })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update user role (admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body

    if (!userId || !role) {
      return res.status(400).json({ message: "Please provide userId and role" })
    }

    if (!["admin", "staff", "customer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" })
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true, runValidators: true }).select("-password")

    if (!user) {
      return res.status(404).json({ message: `No user with id: ${userId}` })
    }

    res.status(200).json({ user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update user profile image
export const updateProfileImage = async (req, res) => {
  try {
    const { userId, imageUrl } = req.body

    if (!userId || !imageUrl) {
      return res.status(400).json({ message: "Please provide userId and imageUrl" })
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: imageUrl },
      { new: true, runValidators: true },
    ).select("-password")

    if (!user) {
      return res.status(404).json({ message: `No user with id: ${userId}` })
    }

    res.status(200).json({ user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
