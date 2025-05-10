import mongoose from "mongoose"

const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["reservation", "order", "payment", "system", "other"],
      default: "system",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
      required: false,
    },
    link: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
)

export default mongoose.model("Notification", NotificationSchema)
