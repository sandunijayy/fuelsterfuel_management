import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const employeeAuth = create((set) => ({
    // Initial states
    employees: [],
    isLoading: false,
    error: null,
    message: null,

    // Functions
    addEmployee: async (fullName, email, position, joinDate, username, password) => {
        set({ isLoading: true, message: null, error: null });

        try {
            const response = await axios.post(
                `${API_URL}/add-employee`,
                {
                    fullName,
                    email,
                    position,
                    joinDate,
                    username,
                    password,
                },
                { withCredentials: true }
            );

            if (!response.data || !response.data.employee) {
                throw new Error("Invalid response from server");
            }

            set({
                message: response.data.message,
                isLoading: false,
            });

            return response.data.employee;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data.message || "Error adding employee",
            });
            throw error;
        }
    },

    fetchEmployees: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.get(`${API_URL}/getallemployees`, {
                withCredentials: true,
            });

            set({
                employees: response.data.employees,
                isLoading: false,
            });

            return response.data.employees;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data.message || "Error fetching employees",
            });

            throw error;
        }
    },

    updateEmployee: async (id, fullName, email, position, joinDate, username, password) => {
        set({ isLoading: true, message: null, error: null });
    
        try {
          const response = await axios.put(
            `${API_URL}/updateEmployee/${id}`,
            {
              fullName,
              email,
              position,
              joinDate,
              username,
              password,
            },
            { withCredentials: true }
          );
    
          if (!response.data || !response.data.employee) {
            throw new Error("Invalid response from server");
          }
    
          set({
            message: response.data.message,
            isLoading: false,
          });
    
          // Update the employees state after the update
          set((state) => ({
            employees: state.employees.map((employee) =>
              employee._id === id ? response.data.employee : employee
            ),
          }));
    
          return response.data.employee;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data.message || "Error updating employee",
          });
          throw error;
        }
      },

      deleteEmployee: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.delete(`${API_URL}/deleteEmployee/${id}`, { withCredentials: true });
          set({ message: response.data.message, isLoading: false });
          // Remove the deleted employee from the state
          set((state) => ({
            employees: state.employees.filter((employee) => employee._id !== id),
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error?.response?.data?.message || 'Error deleting employee',
          });
          throw error;
        }
      },
    
}));