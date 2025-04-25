import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Make sure this matches your backend

export const salesAuth = create((set) => ({
    // Initial states
    transactions: [],
    isLoading: false,
    error: null,
    message: null,

    // Functions
    addTransaction: async (name, fuelType, quantity, price, paymentMethod) => {
        set({ isLoading: true, message: null, error: null });

        try {
            const response = await axios.post(
                `${API_URL}/add-transaction`,
                {
                    name,
                    fuelType,
                    quantity,
                    price,
                    paymentMethod,
                },
                { withCredentials: true }
            );

            if (!response.data || !response.data.transaction) {
                throw new Error("Invalid response from server");
            }

            set({
                message: response.data.message,
                isLoading: false,
            });

            return response.data.transaction;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data.message || "Error adding transaction",
            });
            throw error;
        }
    },

    fetchTransactions: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.get(`${API_URL}/transactions`, {
                withCredentials: true,
            });

            set({
                transactions: response.data.transactions,
                isLoading: false,
            });

            return response.data.transactions;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data.message || "Error fetching transactions",
            });

            throw error;
        }
    },

    updateTransaction: async (id, name, fuelType, quantity, price, paymentMethod) => {
        set({ isLoading: true, message: null, error: null });
      
        try {
          const response = await axios.put(
            `${API_URL}/update-transaction/${id}`,
            {
              name,
              fuelType,
              quantity,
              price,
              paymentMethod,
            },
            { withCredentials: true }
          );
      
          if (!response.data || !response.data.transaction) {
            throw new Error("Invalid response from server");
          }
      
          set({
            message: response.data.message,
            isLoading: false,
          });
      
          // Update the transactions state after the update
          set((state) => ({
            transactions: state.transactions.map((transaction) =>
              transaction._id === id ? response.data.transaction : transaction
            ),
          }));
      
          return response.data.transaction;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data.message || "Error updating transaction",
          });
          throw error;
        }
      },

    deleteTransaction: async (id) => {
        set({ isLoading: true, message: null, error: null });

        try {
            const response = await axios.delete(
                `${API_URL}/delete-transaction/${id}`,
                { withCredentials: true }
            );

            set({
                message: response.data.message,
                isLoading: false,
            });

            // After deleting, refetch transactions
            const transactions = await salesAuth.getState().fetchTransactions();
            set({ transactions });

            return response.data.message;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data.message || "Error deleting transaction",
            });
            throw error;
        }
    },

}));