import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { userAuth } from '../store/userAuth';
import toast from "react-hot-toast";

function CustomerNavbar() {
    const { user, logout } = userAuth();
    const [open, setOpen] = useState(false); // Dropdown state

    console.log("user : ", user);

    const handleLogout = async () => {
        const { message } = await logout();
        toast.success(message);
    };

    return (
        <nav className="bg-[#1F134A] flex justify-between items-center text-white px-4 md:px-12 md:py-4">
            {/* Logo Section */}
            <Link to={"/"}>
                <label className="font-bold tracking-wider md:text-lg lg:text-2xl cursor-pointer text-[#87CEEB]">
                    Logo Here
                </label>
            </Link>

            <div className="flex items-center space-x-5 md:text-lg cursor-pointer">
                <Link to={"/customer"}>
                    <p className="hover:bg-[#1A252F] hover:text-white px-4 py-1 rounded">Customer</p>
                </Link>

                {/* Profile Image Dropdown */}
                <div className="relative">
                    <img
                        src={user.profileImage || "https://via.placeholder.com/40"} // Use user's image if available
                        alt="Profile"
                        className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300"
                        onClick={() => setOpen(!open)}
                    />

                    {/* Dropdown Menu */}
                    {open && (
                        <div className="absolute right-0 mt-2 w-40 bg-white text-black border rounded-lg shadow-lg">
                            <Link
                                to="/profile"
                                className="block px-4 py-2 hover:bg-gray-100"
                                onClick={() => setOpen(false)}
                            >
                                View Profile
                            </Link>
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={() => {
                                    setOpen(false);
                                    handleLogout();
                                }}
                            >
                                Logout ({user.username})
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default CustomerNavbar;
