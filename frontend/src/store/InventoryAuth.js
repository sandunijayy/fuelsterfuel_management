import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const InventoryAuth = create((set) => ({
    // Initial states
    inventoryItems: [],
    isLoading: false,
    error: null,
    message: null,

    // Functions
    addInventory: async (fuelType, pricePerLiter, literQuantity, expiryDate) => {
        set({ isLoading: true, message: null, error: null });

        try {
            const response = await axios.post(
                `${API_URL}/add`,
                {
                    fuelType,
                    pricePerLiter,
                    literQuantity,
                    expiryDate,
                },
                { withCredentials: true }
            );

            if (!response.data || !response.data.inventory) {
                throw new Error("Invalid response from server");
            }

            set({
                message: response.data.message,
                isLoading: false,
            });

            return response.data.inventory;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data.message || "Error adding inventory",
            });
            throw error;
        }
    },

    fetchInventory: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.get(`${API_URL}/get-all`, {
                withCredentials: true,
            });

            set({
                inventoryItems: response.data.inventoryItems,
                isLoading: false,
            });

            return response.data.inventoryItems;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data.message || "Error fetching inventory",
            });

            throw error;
        }
    },

    updateInventory: async (id, fuelType, pricePerLiter, literQuantity, expiryDate) => {
        set({ isLoading: true, message: null, error: null });
    
        try {
            const response = await axios.put(
                `${API_URL}/update/${id}`,
                {
                    fuelType,
                    pricePerLiter,
                    literQuantity,
                    expiryDate,
                },
                { withCredentials: true }
            );
    
            // Log the response to inspect it
            console.log('API Response:', response.data);
    
            // Check the response structure and ensure it's handled correctly
            if (!response.data || !response.data.inventoryItem) {
                throw new Error("Invalid response from server");
            }
    
            set({
                message: response.data.message,
                isLoading: false,
            });
    
            // Update the inventoryItems state after the update
            set((state) => ({
                inventoryItems: state.inventoryItems.map((inventory) =>
                    inventory._id === id ? response.data.inventoryItem : inventory
                ),
            }));
    
            return response.data.inventoryItem;  // Return the correct object
        } catch (error) {
            console.error('Error in updateInventory:', error);  // Log full error for better diagnosis
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Error updating inventory',
            });
            throw error;  // This will propagate the error for further handling
        }
    },
    

    deleteInventory: async (id) => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.delete(`${API_URL}/delete/${id}`, {
                withCredentials: true,
            });

            set({
                message: response.data.message,
                isLoading: false,
            });

            // Remove the deleted inventory item from the state
            set((state) => ({
                inventoryItems: state.inventoryItems.filter(
                    (inventory) => inventory._id !== id
                ),
            }));

            return response.data.message;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data.message || "Error deleting inventory",
            });
            throw error;
        }
    },
}));
