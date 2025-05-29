import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const useProfileAuth = create((set) => ({
    // Initial states
    profile: null,  // Stores a single profile
    profiles: [],   // Stores a list of profiles
    isLoading: false,
    error: null,
    message: null,

    // Function to add a profile
    addProfile: async (fullName, email, city, mobile, profileImage) => {
        set({ isLoading: true, error: null, message: null });

        try {
            const response = await axios.post(`${API_URL}/add-profile`, {
                fullName, email, city, mobile, profileImage
            }, { withCredentials: true });

            const { message, profile } = response.data;
            set({ profile, message, isLoading: false });
            return { message, profile };
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Error adding profile",
            });
            throw error;
        }
    },

    // Fetch all profiles
    fetchProfiles: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.get(`${API_URL}/profiles`, { withCredentials: true });
            set({ profiles: response.data.profiles, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Error fetching profiles",
            });
            throw error;
        }
    },

    // Fetch a single profile by ID
    fetchProfile: async (id) => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.get(`${API_URL}/profile/${id}`, { withCredentials: true });
            set({ profile: response.data.profile, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Error fetching profile",
            });
            throw error;
        }
    },

    // // Update a profile
    // updateProfile: async (id, fullName, email, city, mobile, profileImage) => {
    //     set({ isLoading: true, error: null, message: null });

    //     try {
    //         const response = await axios.put(`${API_URL}/profile/${id}`, {
    //             fullName, email, city, mobile, profileImage
    //         }, { withCredentials: true });

    //         const { message, profile } = response.data;
    //         set({ profile, message, isLoading: false });
    //         return { message, profile };
    //     } catch (error) {
    //         set({
    //             isLoading: false,
    //             error: error.response?.data?.message || "Error updating profile",
    //         });
    //         throw error;
    //     }
    // },

    // // Delete a profile
    // deleteProfile: async (id) => {
    //     set({ isLoading: true, error: null, message: null });

    //     try {
    //         const response = await axios.delete(`${API_URL}/profile/${id}`, { withCredentials: true });
    //         set({ message: response.data.message, isLoading: false });
    //         return { message: response.data.message };
    //     } catch (error) {
    //         set({
    //             isLoading: false,
    //             error: error.response?.data?.message || "Error deleting profile",
    //         });
    //         throw error;
    //     }
    // },
}));