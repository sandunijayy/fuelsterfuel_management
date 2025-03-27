import React, { useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar"; // If you still want the AdminNavbar
import { useStore } from "zustand";
import { userAuth } from "../store/userAuth";

function CustomerDetails() {
    // Use Zustand store
    const { users, isLoading, error, fetchUsers } = useStore(userAuth);

    useEffect(() => {
        fetchUsers(); // Fetch users on component mount
    }, [fetchUsers]);

    if (isLoading) {
        return <p className="text-center">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <>
            <AdminNavbar />
            <div className="min-h-screen bg-[#f3f5f0] p-6">
                <h2 className="text-center font-semibold text-2xl mb-6">All Users</h2>

                <div className="overflow-x-auto">
                    <table className="w-1/2 max-w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mx-auto">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-4 py-2">ID</th>
                                <th className="px-4 py-2">Profile Image</th>
                                <th className="px-4 py-2">Username</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users && users.length > 0 ? (
                                users.map((user, index) => (
                                    <tr
                                        key={user._id}
                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <td className="px-4 py-2">{index + 1}</td>{" "}
                                        {/* Show 1, 2, 3, 4... instead of _id */}
                                        <td className="px-4 py-2">
                                            <img
                                                src={
                                                    user.profileImage || "https://via.placeholder.com/40"
                                                } // Display the profile image
                                                alt="Profile"
                                                className="w-10 h-10 rounded-full border-2 border-gray-300"
                                            />
                                        </td>
                                        <td className="px-4 py-2">{user.username}</td>
                                        <td className="px-4 py-2">{user.email}</td>
                                        <td className="px-4 py-2 flex space-x-2">
                                            <button className="px-3 py-1 text-white bg-red-500 rounded flex items-center gap-1 hover:bg-red-600">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-4">
                                        No users available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default CustomerDetails;