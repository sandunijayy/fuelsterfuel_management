import Inventory from "../models/Inventory.js"

export const addInventory = async (req, res) => {
  const { fuelType, pricePerLiter, literQuantity, expiryDate } = req.body

  try {
    if (!fuelType || !pricePerLiter || !literQuantity || !expiryDate) {
      return res.status(400).json({ message: "Please fill in all fields." })
    }

    // Check if inventory for this fuel type already exists
    const existingInventory = await Inventory.findOne({ fuelType })

    if (existingInventory) {
      // If the fuel type already exists, update the available quantity
      existingInventory.literQuantity = Number(literQuantity)
      existingInventory.availableQuantity += Number(literQuantity) // Add to the available quantity
      existingInventory.expiryDate = new Date(expiryDate) // Update expiry date
      existingInventory.pricePerLiter = Number(pricePerLiter) // Update price

      const updatedInventory = await existingInventory.save()

      return res.status(200).json({
        inventory: {
          id: updatedInventory._id,
          fuelType: updatedInventory.fuelType,
          pricePerLiter: updatedInventory.pricePerLiter,
          literQuantity: updatedInventory.literQuantity,
          availableQuantity: updatedInventory.availableQuantity,
          expiryDate: updatedInventory.expiryDate.toISOString().split("T")[0],
        },
        message: "Inventory updated successfully.",
      })
    }

    // If fuel type doesn't exist, create a new inventory item
    const inventoryDocument = await Inventory.create({
      fuelType,
      pricePerLiter: Number(pricePerLiter),
      literQuantity: Number(literQuantity),
      availableQuantity: Number(literQuantity), // Set availableQuantity to literQuantity initially
      expiryDate,
    })

    return res.status(201).json({
      inventory: {
        id: inventoryDocument._id,
        fuelType: inventoryDocument.fuelType,
        pricePerLiter: inventoryDocument.pricePerLiter,
        literQuantity: inventoryDocument.literQuantity,
        availableQuantity: inventoryDocument.availableQuantity,
        expiryDate: inventoryDocument.expiryDate.toISOString().split("T")[0],
      },
      message: "Inventory added successfully.",
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Get all inventory items
export const getAllInventory = async (req, res) => {
  try {
    const inventoryItems = await Inventory.find()
    if (!inventoryItems || inventoryItems.length === 0) {
      return res.status(404).json({ message: "No inventory items found." })
    }

    res.status(200).json({ inventoryItems })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get a single inventory item by ID
export const getInventoryById = async (req, res) => {
  const { id } = req.params

  try {
    const inventoryItem = await Inventory.findById(id)

    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found." })
    }

    res.status(200).json({
      inventoryItem: {
        id: inventoryItem._id,
        fuelType: inventoryItem.fuelType,
        pricePerLiter: inventoryItem.pricePerLiter,
        literQuantity: inventoryItem.literQuantity,
        availableQuantity: inventoryItem.availableQuantity,
        expiryDate: inventoryItem.expiryDate.toISOString().split("T")[0],
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update an inventory item by ID
export const updateInventory = async (req, res) => {
  const { id } = req.params
  const { fuelType, pricePerLiter, literQuantity, expiryDate } = req.body

  try {
    const inventoryItem = await Inventory.findById(id)
    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found." })
    }

    // Calculate the difference in quantity to update availableQuantity
    const quantityDifference = literQuantity ? Number(literQuantity) - inventoryItem.literQuantity : 0

    if (fuelType) inventoryItem.fuelType = fuelType
    if (pricePerLiter) inventoryItem.pricePerLiter = Number(pricePerLiter)
    if (literQuantity) inventoryItem.literQuantity = Number(literQuantity)
    if (expiryDate) inventoryItem.expiryDate = new Date(expiryDate)

    // Update availableQuantity based on the difference
    inventoryItem.availableQuantity += quantityDifference

    const updatedInventory = await inventoryItem.save()

    res.status(200).json({
      inventoryItem: {
        id: updatedInventory._id,
        fuelType: updatedInventory.fuelType,
        pricePerLiter: updatedInventory.pricePerLiter,
        literQuantity: updatedInventory.literQuantity,
        availableQuantity: updatedInventory.availableQuantity,
        expiryDate: updatedInventory.expiryDate.toISOString().split("T")[0],
      },
      message: "Inventory item updated successfully.",
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete an inventory item by ID
export const deleteInventory = async (req, res) => {
  const { id } = req.params

  try {
    const inventoryItem = await Inventory.findById(id)

    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found." })
    }

    await Inventory.findByIdAndDelete(id)

    res.status(200).json({ message: "Inventory item deleted successfully." })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

//get fuel details by fueltype
export const getFuelDetailsByType = async (req, res) => {
  try {
    const fuelType = req.params.fuelType.trim()
    console.log(`Fetching fuel details for fuelType: "${fuelType}"`)

    const inventoryItem = await Inventory.findOne({ fuelType })

    if (!inventoryItem) {
      return res.status(404).json({ message: "Fuel type not found." })
    }

    res.status(200).json({
      fuelType,
      pricePerLiter: inventoryItem.pricePerLiter,
      availableQuantity: inventoryItem.availableQuantity,
    })
  } catch (error) {
    console.error("Error fetching fuel details:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
