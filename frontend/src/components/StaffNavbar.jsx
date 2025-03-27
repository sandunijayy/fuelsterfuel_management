import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { employeeAuth } from "../store/employeeAuth";
import toast from "react-hot-toast";
import Home from "../pages/Home";

function StaffNavbar() {
    const { loggedInEmployee, logout } = employeeAuth();
    const [open, setOpen] = useState(false); // Dropdown state
    const navigate = useNavigate();

    const handleLogout = async () => {
        const { message } = await logout();
        toast.success(message);
        navigate("/");
    };

    return (
        <nav className="bg-[#1F134A] flex justify-between items-center text-white px-4 md:px-12 md:py-4">
            {/* Logo Section */}
            <Link to={"/"}>
                <label className="font-bold tracking-wider md:text-lg lg:text-2xl cursor-pointer text-[#87CEEB]">
                    Logo Here
                </label>
            </Link>

            {/* Centered Tabs Section */}
            <div className="flex items-center justify-center flex-1 space-x-5 md:text-lg cursor-pointer">
                <Link to={"#"}>
                    <p className="hover:bg-[#1A252F] hover:text-white px-4 py-1 rounded">Sales</p>
                </Link>

                <Link to={"#"}> {/* Changed the URL to "/staff/orders" */}
                    <p className="hover:bg-[#1A252F] hover:text-white px-4 py-1 rounded">Home</p>
                </Link>
            </div>

            {/* Profile Image Dropdown */}
            <div className="relative">
                <img
                    src={loggedInEmployee?.profileImage || "https://via.placeholder.com/40"} // Use employee's image if available
                    alt="Profile"
                    className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300"
                    onClick={() => setOpen(!open)}
                />

                {/* Dropdown Menu */}
                {open && (
                    <div className="absolute right-0 mt-2 w-40 bg-white text-black border rounded-lg shadow-lg">
                        {loggedInEmployee && (
                            <p className="px-4 py-2 text-gray-700">
                                {loggedInEmployee.fullName || loggedInEmployee.username || "Staff"}
                            </p>
                        )}
                        <Link
                            to="/staffprofile"
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
                            Logout ({loggedInEmployee?.fullName || loggedInEmployee?.username || "Staff"})
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default StaffNavbar;
