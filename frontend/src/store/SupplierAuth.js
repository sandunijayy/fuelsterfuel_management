import { create } from "zustand";
import axios from "axios";
const API_URL = "http://localhost:5000/api";

export const SupplierAuth = create((set) => ({
    // Initial states
    suppliers: [],
    isLoading: false,
    error: null,
    message: null,

    // Functions
    addSupplier: async (fullName, email, contactNo, address) => {
        set({ isLoading: true, message: null, error: null });

        try {
            const response = await axios.post(
                `${API_URL}/addsupplier`,
                {
                    fullName,
                    email,
                    contactNo,
                    address,

                },
                { withCredentials: true }
            );

            if (!response.data || !response.data.supplier) {
                throw new Error("Invalid response from server");
            }

            set({
                message: response.data.message,
                isLoading: false,
            });

            return response.data.supplier;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data.message || "Error adding supplier",
            });
            throw error;
        }
    },

    fetchSuppliers: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.get(`${API_URL}/getAllsuppliers`, {
                withCredentials: true,
            });

            set({
                suppliers: response.data.suppliers,
                isLoading: false,
            });

            return response.data.suppliers;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data.message || "Error fetching suppliers",
            });

            throw error;
        }
    },

    updateSupplier: async (id, fullName, email, contactNo, address) => {
        set({ isLoading: true, message: null, error: null });

        try {
            const response = await axios.put(
                `${API_URL}/updateSupplier/${id}`,
                {
                    fullName,
                    email,
                    contactNo,
                    address,

                },
                { withCredentials: true }
            );

            if (!response.data || !response.data.supplier) {
                throw new Error("Invalid response from server");
            }

            set({
                message: response.data.message,
                isLoading: false,
            });

            // Update the suppliers state after the update
            set((state) => ({
                suppliers: state.suppliers.map((supplier) =>
                    supplier._id === id ? response.data.supplier : supplier
                ),
            }));

            return response.data.supplier;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data.message || "Error updating supplier",
            });
            throw error;
        }
    },

    deleteSupplier: async (id) => {

        if (!id) {
            set({ error: "Supplier ID is missing!", isLoading: false });
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const response = await axios.delete(`${API_URL}/deleteSupplier/${id}`, { withCredentials: true });
            set({ message: response.data.message, isLoading: false });


            // Remove the deleted supplier from the state
            set((state) => ({
                suppliers: state.suppliers.filter((supplier) => supplier._id !== id),
            }));
        } catch (error) {
            set({
                isLoading: false,
                error: error?.response?.data?.message || "Error deleting supplier",
            });
            throw error;
        }
    },


}));