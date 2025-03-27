import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { employeeAuth } from "../store/employeeAuth";
import toast from "react-hot-toast";
//import ViewReservation from "../pages/viewReservation";

function StaffProfile() {
    const { employees, fetchEmployees, logout } = employeeAuth();
    const navigate = useNavigate();
    const [editable, setEditable] = useState(false);
    const [staffData, setStaffData] = useState({
        fullName: "",
        email: "",
        position: "",
        joinDate: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            await fetchEmployees();
        };
        fetchData();
    }, [fetchEmployees]);

    useEffect(() => {
        if (employees.length > 0) {
            const loggedInEmployee = employees[0]; // Assuming the first employee is the logged-in one
            setStaffData({
                fullName: loggedInEmployee.fullName,
                email: loggedInEmployee.email,
                position: loggedInEmployee.position,
                joinDate: loggedInEmployee.joinDate,
            });
        }
    }, [employees]);

    const handleLogout = async () => {
        const { message } = await logout();
        toast.success(message);
        navigate("/");
    };

    const handleSave = () => {
        toast.success("Profile updated successfully!");
        setEditable(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 p-8">
            <div className="flex w-full max-w-6xl bg-white shadow-xl rounded-lg p-6 space-x-8">
                <div className="w-1/2 pr-6">
                    <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">Staff Profile</h2>
                    <div className="flex justify-center mb-6">
                        <img
                            src="/path-to-profile-image.jpg"
                            alt="Profile"
                            className="w-28 h-28 rounded-full border-4 border-blue-500 shadow-xl"
                        />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-600 text-lg font-medium">Full Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={staffData.fullName}
                                disabled={!editable}
                                onChange={(e) =>
                                    setStaffData({ ...staffData, fullName: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 text-lg font-medium">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={staffData.email}
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 text-lg font-medium">Position</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 border rounded-lg bg-gray-100 text-gray-500"
                                value={staffData.position}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-8">
                        {!editable ? (
                            <button
                                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                                onClick={() => setEditable(true)}
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <button
                                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        )}
                        <button
                            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
                <div className="w-1/2 pl-6">
                    <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">Current Sales</h2>
                    {/* <ViewReservation /> */}
                </div>
            </div>
        </div>
    );
}

export default StaffProfile;
