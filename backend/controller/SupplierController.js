import Supplier from "../model/SupplierModel.js"

export const addSupplier = async (req, res) => {
    const { fullName, email, contactNo, address } = req.body;

    try {
        // Check if all fields are provided
        if (!fullName || !email || !contactNo || !address ) {
            throw new Error("Please fill in all fields.");
        }

        // Check if email already exists
        const emailExists = await Supplier.findOne({ email });
        if (emailExists) return res.status(400).json({ message: "Email is already used." });

        // Create supplier document
        const supplierDocument = await Supplier.create({
            fullName,
            email,
            contactNo,
            address,
            
        });

        if (supplierDocument) {
            return res.status(201).json({
                supplier: {
                    id: supplierDocument._id,
                    fullName: supplierDocument.fullName,
                    email: supplierDocument.email,
                    contactNo: supplierDocument.contactNo,
                    address: supplierDocument.address,
                    
                },
                message: "Supplier added successfully."
            });
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all suppliers
export const getAllSuppliers = async (req, res) => {
    try {
        console.log("Fetching all suppliers..."); // Add logging here for debugging
        const suppliers = await Supplier.find(); // Fetch all suppliers
        if (!suppliers || suppliers.length === 0) {
            return res.status(404).json({ message: "No suppliers found." });
        }

        res.status(200).json({ suppliers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get supplier by ID
export const getSupplierById = async (req, res) => {
    const { id } = req.params;

    try {
        const supplier = await Supplier.findById(id); // Find supplier by ID

        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found." });
        }

        // Send the supplier details in response
        res.status(200).json({
            supplier: {
                id: supplier._id,
                fullName: supplier.fullName,
                email: supplier.email,
                contactNo: supplier.contactNo,
                address: supplier.address,
                
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSupplier = async (req, res) => {
    const { id } = req.params;
    const { fullName, email, contactNo, address } = req.body;

    try {
        // Check if the supplier exists
        const supplierData = await Supplier.findById(id);
        if (!supplierData) {
            return res.status(404).json({ message: "Supplier not found." });
        }

        // Check if email already exists for another supplier
        const emailExists = await Supplier.findOne({ email, _id: { $ne: id } });
        if (emailExists) return res.status(400).json({ message: "Email is already used by another supplier." });

        // Update supplier details
        supplierData.fullName = fullName || supplierData.fullName;
        supplierData.email = email || supplierData.email;
        supplierData.contactNo = contactNo || supplierData.contactNo;
        supplierData.address = address || supplierData.address;
        

        const updatedSupplier = await supplierData.save();

        res.status(200).json({
            supplier: {
                id: updatedSupplier._id,
                fullName: updatedSupplier.fullName,
                email: updatedSupplier.email,
                contactNo: updatedSupplier.contactNo,
                address: updatedSupplier.address,
                
                
            },
            message: "Supplier updated successfully."
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteSupplier = async (req, res) => {
    const { id } = req.params;

    try {
        const supplierData = await Supplier.findById(id);

        if (!supplierData) {
            return res.status(404).json({ message: "Supplier not found." });
        }

        // Delete the supplier
        await Supplier.findByIdAndDelete(id);

        // Send only success response, no extra errors
        return res.status(200).json({ message: "Supplier deleted successfully." });

    } catch (error) {
        console.error("Error deleting supplier:", error.message);  // Log the actual error for debugging
        return res.status(500).json({ message: "Internal server error. Could not delete supplier." });
    }
};