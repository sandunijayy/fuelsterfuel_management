import Inventory from "../model/InventoryModel.js";

// Add inventory item
export const addInventory = async (req, res) => {
    const { fuelType, pricePerLiter, literQuantity, expiryDate } = req.body;

    try {
        if (!fuelType || !pricePerLiter || !literQuantity || !expiryDate) {
            throw new Error("Please fill in all fields.");
        }

        const inventoryDocument = await Inventory.create({
            fuelType,
            pricePerLiter,
            literQuantity,
            expiryDate,
        });

        if (inventoryDocument) {
            return res.status(201).json({
                inventory: {
                    id: inventoryDocument._id,
                    fuelType: inventoryDocument.fuelType,
                    pricePerLiter: inventoryDocument.pricePerLiter,
                    literQuantity: inventoryDocument.literQuantity,
                    expiryDate: inventoryDocument.expiryDate.toISOString().split('T')[0],
                },
                message: "Inventory added successfully."
            });
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all inventory items
export const getAllInventory = async (req, res) => {
    try {
        const inventoryItems = await Inventory.find();
        if (!inventoryItems || inventoryItems.length === 0) {
            return res.status(404).json({ message: "No inventory items found." });
        }

        res.status(200).json({ inventoryItems });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single inventory item by ID
export const getInventoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const inventoryItem = await Inventory.findById(id);

        if (!inventoryItem) {
            return res.status(404).json({ message: "Inventory item not found." });
        }

        res.status(200).json({
            inventoryItem: {
                id: inventoryItem._id,
                fuelType: inventoryItem.fuelType,
                pricePerLiter: inventoryItem.pricePerLiter,
                literQuantity: inventoryItem.literQuantity,
                expiryDate: inventoryItem.expiryDate.toISOString().split('T')[0],
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an inventory item by ID
export const updateInventory = async (req, res) => {
    const { id } = req.params;
    const { fuelType, pricePerLiter, literQuantity, expiryDate } = req.body;

    try {
        const inventoryItem = await Inventory.findById(id);
        if (!inventoryItem) {
            return res.status(404).json({ message: "Inventory item not found." });
        }

        if (fuelType) inventoryItem.fuelType = fuelType;
        if (pricePerLiter) inventoryItem.pricePerLiter = pricePerLiter;
        if (literQuantity) inventoryItem.literQuantity = literQuantity;
        if (expiryDate) inventoryItem.expiryDate = new Date(expiryDate);

        const updatedInventory = await inventoryItem.save();

        res.status(200).json({
            inventoryItem: {
                id: updatedInventory._id,
                fuelType: updatedInventory.fuelType,
                pricePerLiter: updatedInventory.pricePerLiter,
                literQuantity: updatedInventory.literQuantity,
                expiryDate: updatedInventory.expiryDate.toISOString().split('T')[0],
            },
            message: "Inventory item updated successfully."
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an inventory item by ID
export const deleteInventory = async (req, res) => {
    const { id } = req.params;

    try {
        const inventoryItem = await Inventory.findById(id);

        if (!inventoryItem) {
            return res.status(404).json({ message: "Inventory item not found." });
        }

        await Inventory.findByIdAndDelete(id);

        res.status(200).json({ message: "Inventory item deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
