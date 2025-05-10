import Notification from "../models/Notification.js"

// Create a new notification
export const createNotification = async (req, res) => {
  try {
    const { title, message, type, relatedId, link } = req.body

    const notification = await Notification.create({
      title,
      message,
      type,
      relatedId,
      link,
    })

    res.status(201).json({
      notification,
      message: "Notification created successfully",
    })
  } catch (error) {
    console.error("Error creating notification:", error)
    res.status(500).json({ message: error.message })
  }
}

// Get all notifications
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 })

    res.status(200).json({ notifications })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    res.status(500).json({ message: error.message })
  }
}

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params

    const notification = await Notification.findById(id)

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" })
    }

    notification.isRead = true
    await notification.save()

    res.status(200).json({
      notification,
      message: "Notification marked as read",
    })
  } catch (error) {
    console.error("Error marking notification as read:", error)
    res.status(500).json({ message: error.message })
  }
}

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({}, { isRead: true })

    res.status(200).json({
      message: "All notifications marked as read",
    })
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    res.status(500).json({ message: error.message })
  }
}

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params

    const notification = await Notification.findById(id)

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" })
    }

    await Notification.findByIdAndDelete(id)

    res.status(200).json({
      message: "Notification deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting notification:", error)
    res.status(500).json({ message: error.message })
  }
}

// Get unread notification count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ isRead: false })

    res.status(200).json({ count })
  } catch (error) {
    console.error("Error getting unread count:", error)
    res.status(500).json({ message: error.message })
  }
}
