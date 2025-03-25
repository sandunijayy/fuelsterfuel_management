import { useEffect, useState } from "react";
import axios from "axios";
import { userAuth } from "../store/userAuth"; // Assuming this provides logged-in user data

export default function UserProfile() {
    const { user } = userAuth(); // Get logged-in user data
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        if (user?.email) {
            fetchReservations();
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
        <div className="p-6 bg-gray-100 rounded-xl shadow-md max-w-md mx-auto mt-10">
            <h2 className="text-xl font-bold mb-4">User Profile</h2>
            <p><strong>Name:</strong> {user?.username}</p>
            <p><strong>Email:</strong> {user?.email}</p>

            <h3 className="text-lg font-semibold mt-4">Your Reservations:</h3>
            {reservations.length > 0 ? (
                <ul className="mt-2">
                    {reservations.map((res) => (
                        <li key={res._id} className="border p-2 my-2 rounded bg-white shadow">
                            <p><strong>Fuel Type:</strong> {res.fuelType}</p>
                            <p><strong>Amount:</strong> {res.fuelAmount} L</p>
                            <p><strong>Status:</strong> {res.status}</p>
                            <p><strong>Date:</strong> {new Date(res.createdAt).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No reservations found.</p>
            )}
        </div>
    );
}
