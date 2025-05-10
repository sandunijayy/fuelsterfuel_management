import express from "express"
import {
  createNotification,
  getAllNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} from "../controllers/notificationController.js"
import { authenticateUser, authorizeRoles } from "../middleware/auth.js"

const router = express.Router()

// Protected routes - Admin only
router.post("/", authenticateUser, authorizeRoles("admin"), createNotification)
router.get("/", authenticateUser, authorizeRoles("admin"), getAllNotifications)
router.patch("/:id", authenticateUser, authorizeRoles("admin"), markAsRead)
router.patch("/", authenticateUser, authorizeRoles("admin"), markAllAsRead)
router.delete("/:id", authenticateUser, authorizeRoles("admin"), deleteNotification)
router.get("/unread-count", authenticateUser, authorizeRoles("admin"), getUnreadCount)

export default router
