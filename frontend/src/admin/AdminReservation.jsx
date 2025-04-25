import React, { useEffect, useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import Reservation from '../../../backend/model/reservationModel';

function AdminReservation() {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/get-reserv"); // Adjust your backend URL
            const data = await response.json();
            setReservations(data);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await fetch(`http://localhost:5000/api/update-status/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            fetchReservations(); // Refresh reservations after updating
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const deleteReservation = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/Deletereserv/${id}`, {
                method: "DELETE",
            });
            fetchReservations(); // Refresh reservations after deleting
        } catch (error) {
            console.error("Error deleting reservation:", error);
        }
    };

    const handleDeleteReservation = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this reservation?");
        if (confirmDelete) {
            try {
                await deleteReservation(id);
                toast.success('Supplier deleted successfully!');
                fetchReservations();
            } catch (error) {
                const errorMessage = error?.response?.data?.message || "Error deleting reservation. Please try again.";
                toast.error(errorMessage);
            }
        }
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <AdminNavbar />

            {/* Main Content */}
            <div className="flex-1 p-6 bg-gray-100 min-h-screen">
                <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800">Reservation Management</h1>

                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 rounded-lg">
                            <thead className="bg-gray-900 text-white">
                                <tr>
                                    <th className="p-3 text-left">Customer</th>
                                    <th className="p-3 text-left">Fuel Type</th>
                                    <th className="p-3 text-left">Amount</th>
                                    <th className="p-3 text-left">Status</th>
                                    <th className="p-3 text-left">Action</th>
                                    <th className="p-3 text-left">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.length > 0 ? (
                                    reservations.map((res) => (
                                        <tr key={res._id} className="border-b hover:bg-gray-100">
                                            <td className="p-3">{res.customerName}</td>
                                            <td className="p-3">{res.fuelType}</td>
                                            <td className="p-3">{res.fuelAmount}L</td>
                                            <td className={`p-3 font-medium 
                                                ${res.status === "Pending" ? "text-yellow-600" : res.status === "Approved" ? "text-green-600" : "text-red-600"}`}>
                                                {res.status}
                                            </td>
                                            <td className="p-3">
                                                <select
                                                    onChange={(e) => updateStatus(res._id, e.target.value)}
                                                    value={res.status}
                                                    className="border border-gray-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-400"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Approved">Approved</option>
                                                    <option value="Rejected">Rejected</option>
                                                </select>
                                            </td>
                                            <td className="p-3">
                                                <button
                                                    onClick={() => handleDeleteReservation(res._id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700">
                                                    Delete
                                                </button>

                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-4 text-center text-gray-600">No reservations found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminReservation;
