import express from "express"
import { getAllUsers, updateUserRole, updateProfileImage } from "../controllers/userController.js"
import { authenticateUser, authorizeRoles } from "../middleware/auth.js"
import User from "../models/User.js"

const router = express.Router()

// Add a route to get the current user
router.get("/me", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/", authenticateUser, authorizeRoles("admin"), getAllUsers)
router.patch("/update-role", authenticateUser, authorizeRoles("admin"), updateUserRole)
router.patch("/update-profile-image", authenticateUser, updateProfileImage)

export default router
