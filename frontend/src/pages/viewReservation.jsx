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
                    <ul className="space-y-4">
                        {reservations.map((res) => (
                            <li key={res._id} className="border p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="space-y-2">
                                    <p className="text-lg text-gray-700"><strong>Fuel Type:</strong> {res.fuelType}</p>
                                    <p className="text-lg text-gray-700"><strong>Amount:</strong> {res.fuelAmount} L</p>
                                    <p className="text-lg text-gray-700"><strong>Status:</strong> {res.status}</p>
                                    <p className="text-lg text-gray-700"><strong>Date:</strong> {new Date(res.createdAt).toLocaleDateString()}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-lg text-gray-500">No reservations found.</p>
                )}
            </div>
        </div>
    );
}
