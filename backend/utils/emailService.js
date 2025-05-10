import nodemailer from "nodemailer"

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com", // replace with your email in .env
    pass: process.env.EMAIL_PASSWORD || "your-password", // replace with your password in .env
  },
})

// Function to send an order confirmation email to supplier
export const sendOrderConfirmationEmail = async (supplierEmail, supplierName, orderDetails) => {
  try {
    // Format delivery date
    const deliveryDate = new Date(orderDetails.deliveryDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const mailOptions = {
      from: `"Fuel Management System" <${process.env.EMAIL_USER || "your-email@gmail.com"}>`,
      to: supplierEmail,
      subject: "New Fuel Order Placed",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #4f46e5;">New Order Notification</h2>
          <p>Hello ${supplierName},</p>
          <p>A new fuel order has been placed with your company. Here are the details:</p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Fuel Type:</strong> ${orderDetails.fuelType}</p>
            <p><strong>Quantity:</strong> ${orderDetails.quantity} liters</p>
            <p><strong>Delivery Date:</strong> ${deliveryDate}</p>
          </div>
          <p>Please prepare the order for delivery on the specified date.</p>
          <p>Thank you for your continued service.</p>
          <p>Best regards,<br>Fuel Management Team</p>
        </div>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent: ", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending email: ", error)
    return { success: false, error: error.message }
  }
}

// Test the email connection
export const verifyEmailConnection = async () => {
  try {
    const verification = await transporter.verify()
    console.log("Email server connection verified:", verification)
    return verification
  } catch (error) {
    console.error("Email server connection failed:", error)
    return false
  }
}
