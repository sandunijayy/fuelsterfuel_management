"use client"

import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Download, X } from 'lucide-react'

const QRCodeModal = ({ reservation, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false)

  // Create QR code data with reservation details
  const qrCodeData = JSON.stringify({
    id: reservation._id,
    vehicleNumber: reservation.vehicleNumber,
    customerName: reservation.customerName,
    fuelType: reservation.fuelType,
    amount: reservation.allocatedAmount,
    status: reservation.status,
    date: new Date(reservation.createdAt).toLocaleDateString(),
  })

  // Handle QR code download
  const handleDownload = () => {
    setIsDownloading(true)

    try {
      // Get the SVG element
      const svg = document.getElementById("reservation-qr-code")
      if (!svg) {
        throw new Error("QR code element not found")
      }

      // Create a canvas element
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        throw new Error("Could not create canvas context")
      }

      // Set canvas dimensions
      canvas.width = 300
      canvas.height = 300

      // Create an image from the SVG
      const img = new Image()
      img.crossOrigin = "anonymous"

      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svg)
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
      const svgUrl = URL.createObjectURL(svgBlob)

      img.onload = () => {
        // Draw the image on the canvas
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        // Convert canvas to data URL and download
        const dataUrl = canvas.toDataURL("image/png")
        const a = document.createElement("a")
        a.href = dataUrl
        a.download = `reservation-${reservation._id}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

        // Clean up
        URL.revokeObjectURL(svgUrl)
        setIsDownloading(false)
      }

      img.src = svgUrl
    } catch (error) {
      console.error("Error downloading QR code:", error)
      setIsDownloading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Reservation QR Code</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <QRCodeSVG id="reservation-qr-code" value={qrCodeData} size={200} level="H" includeMargin={true} />
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Scan this QR code at the fuel station</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              <div className="text-right font-medium">Vehicle:</div>
              <div>{reservation.vehicleNumber}</div>
              <div className="text-right font-medium">Fuel Type:</div>
              <div>{reservation.fuelType}</div>
              <div className="text-right font-medium">Amount:</div>
              <div>{reservation.allocatedAmount} liters</div>
              <div className="text-right font-medium">Status:</div>
              <div>{reservation.status}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Download size={18} className="mr-2" />
            {isDownloading ? "Downloading..." : "Download QR Code"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default QRCodeModal
