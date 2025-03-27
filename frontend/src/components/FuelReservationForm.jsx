import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { userAuth } from '../store/userAuth';
import CustomerNavbar from './customerNavbar';

export default function FuelReservationForm() {
    const { user } = userAuth();


    const [formData, setFormData] = useState({
        customerName: '',
        vehicleType: '',
        priority: 'Medium',
        fuelType: '',
        fuelAmount: '',
        email: '',
        phoneNumber: '',
        totalPrice: '',
        allocatedFuelAmount: ''
    });

    const [pricePerLiter, setPricePerLiter] = useState(0);

    useEffect(() => {
        if (user) {
            setFormData(prevData => ({
                ...prevData,
                customerName: user.username || '',
                email: user.email || '',
            }));
        }
    }, [user]);

    useEffect(() => {
        if (formData.fuelType) {
            axios.get(`http://localhost:5000/api/inventory/${encodeURIComponent(formData.fuelType.trim())}`)
                .then(response => setPricePerLiter(response.data.pricePerLiter))
                .catch(error => console.error("Error fetching price:", error));
        }
    }, [formData.fuelType]);

    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,
            totalPrice: parseFloat(prevData.fuelAmount) * parseFloat(pricePerLiter)
        }));
    }, [formData.fuelAmount, pricePerLiter]);

    //cal allocated fuel amount
    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,
            allocatedFuelAmount: parseFloat(prevData.fuelAmount)
        }))
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Sending Data:", formData);  // Debugging step
        try {
            await axios.post('http://localhost:5000/api/reservation', formData);
            toast.success('Reservation Successful!');
            setFormData({
                customerName: user?.username || '',
                email: user?.email || '',
                vehicleType: '',
                fuelType: '',
                priority: 'Medium',
                fuelAmount: '',
                phoneNumber: '',
                totalPrice: '',
                allocatedFuelAmount: ''
            });
        } catch (error) {
            console.error("Error response:", error.response?.data); // Log error details
            toast.error('Reservation Failed');
        }
    };

    return (
        <>
            <CustomerNavbar />
            <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
                <h2 className="text-2xl font-bold text-center mb-5">Fuel Reservation</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Name</label>
                        <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Vehicle Number</label>
                        <input type="text" name="vehicleType" value={formData.vehicleType} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Fuel Type</label>
                        <select name="fuelType" value={formData.fuelType} onChange={handleChange} required className="w-full p-3 border rounded-lg">
                            <option value="">Select Fuel Type</option>
                            <option value="Petrol">Petrol</option>
                            <option value="Diesel">Diesel</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Priority</label>
                        <select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-3 border rounded-lg">
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Fuel Amount (Liters)</label>
                        <input type="number" name="fuelAmount" value={formData.fuelAmount} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Phone Number</label>
                        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                    </div>
                    <div className="text-lg font-semibold text-gray-800">Total Price: {formData.totalPrice} Rs.</div>
                    <div className="text-lg font-semibold text-gray-800">Allocated Fuel Amount: {formData.allocatedFuelAmount} L</div>
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-semibold">Reserve</button>
                </form>
            </div>
        </>
    );
}
