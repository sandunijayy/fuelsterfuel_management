import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { userAuth } from "../store/userAuth";
import toast from "react-hot-toast";
import ViewReservation from "../pages/viewReservation"; // Importing the viewReservation page/component
import CustomerNavbar from '../components/customerNavbar';

function Profile() {
    const { user, logout } = userAuth();
    const navigate = useNavigate();
    const [editable, setEditable] = useState(false);
    const [userData, setUserData] = useState({
        username: user?.username || "",
        email: user?.email || "",
        role: user?.role || "Admin",
    });

    useEffect(() => {
        if (user) {
            setUserData({
                username: user.username,
                email: user.email,
                role: user.role || "Admin",
            });
        }
    }, [user]);

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
        <>
            <CustomerNavbar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 p-8">
                <div className="flex w-full max-w-6xl bg-white shadow-xl rounded-lg p-6 space-x-8">
                    {/* Left section: User Profile */}
                    <div className="w-1/2 pr-6">
                        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">Profile</h2>

                        {/* Profile Image */}
                        <div className="flex justify-center mb-6">
                            <img
                                src="/path-to-profile-image.jpg" // Change to user's image URL
                                alt="Profile"
                                className="w-28 h-28 rounded-full border-4 border-blue-500 shadow-xl"
                            />
                        </div>

                        {/* Profile Info */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-gray-600 text-lg font-medium">Username</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={userData.username}
                                    disabled={!editable}
                                    onChange={(e) =>
                                        setUserData({ ...userData, username: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-gray-600 text-lg font-medium">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={userData.email}
                                    disabled
                                />
                            </div>


                        </div>

                        {/* Buttons */}
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

                    {/* Right section: View Reservations */}
                    <div className="w-1/2 pl-6">
                        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">Your Reservations</h2>
                        <ViewReservation /> {/* Place the viewReservation component here */}
                    </div>
                </div>
            </div>
        </>
    );

}

export default Profile;
