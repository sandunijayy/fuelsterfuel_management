import FuelTransaction from "../models/salesModel.js"

export const addFuelTransaction = async (req, res) => {
  const { name, fuelType, quantity, price, paymentMethod } = req.body

  try {
    if (!name || !fuelType || !quantity || !price || !paymentMethod) {
      throw new Error("Please fill in all fields.")
    }

    // Creating the fuel transaction record
    const fuelTransactionDocument = await FuelTransaction.create({
      name,
      fuelType,
      quantity,
      price,
      paymentMethod,
    })

    if (fuelTransactionDocument) {
      return res.status(201).json({
        transaction: {
          id: fuelTransactionDocument._id,
          name: fuelTransactionDocument.name,
          fuelType: fuelTransactionDocument.fuelType,
          quantity: fuelTransactionDocument.quantity,
          price: fuelTransactionDocument.price,
          paymentMethod: fuelTransactionDocument.paymentMethod,
        },
        message: "Fuel transaction added successfully.",
      })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const getAllFuelTransactions = async (req, res) => {
  try {
    const transactions = await FuelTransaction.find() // Fetch all transactions
    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: "No fuel transactions found." })
    }

    res.status(200).json({ transactions })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get a single fuel transaction by ID
export const getFuelTransactionById = async (req, res) => {
  const { id } = req.params

  try {
    const transaction = await FuelTransaction.findById(id) // Find transaction by ID

    if (!transaction) {
      return res.status(404).json({ message: "Fuel transaction not found." })
    }

    // Send the transaction details in response
    res.status(200).json({
      transaction: {
        id: transaction._id,
        name: transaction.name,
        fuelType: transaction.fuelType,
        quantity: transaction.quantity,
        price: transaction.price,
        paymentMethod: transaction.paymentMethod,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update Fuel Transaction
export const updateFuelTransaction = async (req, res) => {
  const { id } = req.params
  const { name, fuelType, quantity, price, paymentMethod } = req.body

  try {
    // Check if transaction exists
    const transaction = await FuelTransaction.findById(id)
    if (!transaction) {
      return res.status(404).json({ message: "Fuel transaction not found." })
    }

    // Update transaction details
    transaction.name = name || transaction.name
    transaction.fuelType = fuelType || transaction.fuelType
    transaction.quantity = quantity || transaction.quantity
    transaction.price = price || transaction.price
    transaction.paymentMethod = paymentMethod || transaction.paymentMethod

    const updatedTransaction = await transaction.save()

    res.status(200).json({
      transaction: {
        id: updatedTransaction._id,
        name: updatedTransaction.name,
        fuelType: updatedTransaction.fuelType,
        quantity: updatedTransaction.quantity,
        price: updatedTransaction.price,
        paymentMethod: updatedTransaction.paymentMethod,
        date: updatedTransaction.createdAt.toISOString().split("T")[0], // Format Date
      },
      message: "Fuel transaction updated successfully.",
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete Fuel Transaction
export const deleteFuelTransaction = async (req, res) => {
  const { id } = req.params

  try {
    const transaction = await FuelTransaction.findById(id)

    if (!transaction) {
      return res.status(404).json({ message: "Fuel transaction not found." })
    }

    // Delete the transaction
    await FuelTransaction.findByIdAndDelete(id)

    res.status(200).json({ message: "Fuel transaction deleted successfully." })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
