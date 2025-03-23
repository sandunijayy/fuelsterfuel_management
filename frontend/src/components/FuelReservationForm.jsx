import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

export default function FuelReservationForm() {
    const [formData, setFormData] = useState({
        customerName: '',
        vehicleType: '',
        priority: 'Medium',
        fuelAmount: '',
        phoneNumber: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/reserve', formData);
            toast.success('Reservation Successful!');
            setFormData({ customerName: '', vehicleType: '', priority: 'Medium', fuelAmount: '', phoneNumber: '' });
        } catch (error) {
            toast.error('Reservation Failed');
        }
    };

    return (
        <div className="p-6 bg-gray-100 rounded-xl shadow-md max-w-md mx-auto mt-10">
            <h2 className="text-xl font-bold mb-4">Fuel Reservation</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Your Name" required className="w-full p-2 border rounded" />
                <input type="text" name="vehicleType" value={formData.vehicleType} onChange={handleChange} placeholder="Vehicle Type" required className="w-full p-2 border rounded" />
                <select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
                <input type="number" name="fuelAmount" value={formData.fuelAmount} onChange={handleChange} placeholder="Fuel Amount (Liters)" required className="w-full p-2 border rounded" />
                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required className="w-full p-2 border rounded" />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Reserve</button>
            </form>
        </div>
    );
}
