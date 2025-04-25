import { useEffect, useState } from "react";
import axios from "axios";
import { userAuth } from "../store/userAuth"; // Assuming this provides logged-in user data

export default function ViewReservation() {
    const { user } = userAuth(); // Get logged-in user data
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        if (user?.email) {
            fetchReservations();
            const interval = setInterval(fetchReservations, 5000); // Fetch every 5 seconds
            return () => clearInterval(interval); // Cleanup on unmount
        }
    }, [user]);

    const fetchReservations = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/reservations/${user.email}`);
            setReservations(response.data);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    };

    // Function to delete a reservation only in the frontend
    const handleDeleteReservation = (id) => {
        setReservations((prevReservations) =>
            prevReservations.filter((res) => res._id !== id)
        );
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-xl max-w-4xl mx-auto mt-10 space-y-6">


            {/* User Profile */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">User Information</h3>
                <div className="space-y-4">
                    <p className="text-lg text-gray-600"><strong>Name:</strong> {user?.username}</p>
                    <p className="text-lg text-gray-600"><strong>Email:</strong> {user?.email}</p>
                </div>
            </div>

            {/* Reservations Section */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Reservation Details</h3>
                {reservations.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-3 px-6 text-left text-gray-700 font-semibold">Fuel Type</th>
                                    <th className="py-3 px-6 text-left text-gray-700 font-semibold">Amount (L)</th>
                                    <th className="py-3 px-6 text-left text-gray-700 font-semibold">Status</th>
                                    <th className="py-3 px-6 text-left text-gray-700 font-semibold">Date</th>
                                    <th className="py-3 px-6 text-left text-gray-700 font-semibold">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.map((res) => (
                                    <tr key={res._id} className="border-b hover:bg-gray-50">
                                        <td className="py-4 px-6 text-gray-700">{res.fuelType}</td>
                                        <td className="py-4 px-6 text-gray-700">{res.fuelAmount} L</td>
                                        <td className="py-4 px-6 text-gray-700">{res.status}</td>
                                        <td className="py-4 px-6 text-gray-700">{new Date(res.createdAt).toLocaleDateString()}</td>
                                        <td className="p-3">
                                            <button
                                                onClick={() => handleDeleteReservation(res._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700">
                                                Delete
                                            </button>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-lg text-gray-500">No reservations found.</p>
                )}
            </div>
        </div>
    );
}
