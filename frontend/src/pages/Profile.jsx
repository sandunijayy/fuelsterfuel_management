import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { userAuth } from "../store/userAuth";
import toast from "react-hot-toast";
import ViewReservation from "../pages/viewReservation";
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
            <div className="flex min-h-screen bg-gray-100">
                {/* Sidebar */}
                <aside className="w-1/4 bg-white shadow-md p-6">
                    <div className="flex flex-col items-center text-center">
                        <img
                            src="/path-to-profile-image.jpg"
                            alt="Profile"
                            className="w-20 h-20 rounded-full border-2 border-blue-500"
                        />
                        <h2 className="mt-4 text-lg font-semibold">{userData.username}</h2>
                        <p className="text-gray-500">{userData.email}</p>
                        <button
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                    <nav className="mt-8">
                        <ul className="space-y-4">
                            <li className="px-4 py-2 bg-blue-500 text-white rounded-lg">Profile</li>
                            <li>
                                <Link to="/viewReservation" className="block px-4 py-2 hover:bg-gray-200 rounded-lg">Reservations</Link>
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-200 rounded-lg">Settings</li>
                        </ul>
                    </nav>
                </aside>
                {/* Main Content */}
                <main className="w-3/4 p-8">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-600">Username</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={userData.username}
                                    disabled={!editable}
                                    onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                                    value={userData.email}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-between">
                            {!editable ? (
                                <button
                                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                                    onClick={() => setEditable(true)}
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <button
                                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                                    onClick={handleSave}
                                >
                                    Save
                                </button>
                            )}
                        </div>
                    </div>
                    {/* Reservations Section */}

                </main>
            </div>
        </>
    );
}

export default Profile;
