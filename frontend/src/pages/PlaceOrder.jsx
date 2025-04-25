import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaTruck } from 'react-icons/fa';
import { SupplierAuth } from '../store/SupplierAuth';
import axios from 'axios';
import emailjs from '@emailjs/browser';



const PlaceOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const supplierId = location.state?.supplierId;
    const { fetchSuppliers } = SupplierAuth();

    const [supplier, setSupplier] = useState(null);
    const [fuelType, setFuelType] = useState('');
    const [quantity, setQuantity] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');

    useEffect(() => {
        const loadSupplier = async () => {
            await fetchSuppliers();
            const state = SupplierAuth.getState();
            const foundSupplier = state.suppliers.find((sup) => sup._id === supplierId);

            if (foundSupplier) {
                setSupplier(foundSupplier);
            } else {
                toast.error("Supplier not found!");
            }
        };

        if (supplierId) {
            loadSupplier();
        }
    }, [supplierId, fetchSuppliers]);

    const [quantityError, setQuantityError] = useState('');


    const handleQuantityChange = (e) => {
        const value = e.target.value;
        if (value < 1) {
            setQuantityError('Please enter a valid number');  // Display error if negative value
        } else {
            setQuantityError('');  // Clear error if value is valid
        }
        setQuantity(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        //my Emailjs serverId,templateID,a dnd Publick key
        const serviceId = 'service_zaxp2fr';
        const templateId = 'template_gwnveze';
        const publicKey = 'S6uqyHRkXzol1Xhrx';

        const templateParams = {
            // Supplier email from state
            from_email: supplier.email,
            from_fueltype: fuelType,
            from_quantity: quantity,
            from_deliverydate: deliveryDate,
        };
        //send the email using EmailJs
        emailjs.send(serviceId, templateId, templateParams, publicKey)

            .then((response) => {
                console.log('Email send successfully', response);
                setQuantity('');
                setFuelType('');
                setDeliveryDate('');

            })
            .catch((error) => {
                console.error('error sending email:', error);

            });



        if (!fuelType || !quantity || !deliveryDate) {
            toast.error('Please fill in all fields');
            return;
        }

        const orderData = {
            supplierId,
            fuelType,
            quantity,
            deliveryDate,
        };




        try {
            await axios.post('http://localhost:5000/api/placeorder', orderData);
            toast.success('Order placed successfully!');
            navigate(`/orders/${supplierId}`, { state: { newOrder: orderData } });
        } catch (error) {
            toast.error('Failed to place the order');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-300">
                <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">Place Order</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-lg">Supplier Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg bg-gray-200"
                            value={supplier ? supplier.fullName : 'Loading...'}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-lg">Supplier Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border rounded-lg bg-gray-200"
                            value={supplier ? supplier.email : 'Loading...'}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-lg">Fuel Type</label>
                        <select
                            className="w-full px-3 py-2 border rounded-lg"
                            value={fuelType}
                            onChange={(e) => setFuelType(e.target.value)}
                        >
                            <option value="">Select Fuel Type</option>
                            <option value="Petrol 92">Petrol 92</option>
                            <option value="Petrol 95">Petrol 95</option>
                            <option value="Petrol 98">Petrol 98</option>
                            <option value="Biodiesel B5">Biodiesel B5 </option>
                            <option value="CNG">CNG </option>
                            <option value="Diesel">Diesel</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-lg">Quantity (Liters)</label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={quantity}
                            onChange={handleQuantityChange}
                            placeholder="Enter quantity"
                            min="1"  // Ensure it does not allow negative input from UI
                        />
                        {quantityError && <p className="text-red-500 text-sm mt-1">{quantityError}</p>}  {/* Display error message */}
                    </div>
                    <div>
                        <label className="block text-lg">Delivery Date</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-3 py-1 text-white bg-blue-500 rounded flex items-center gap-1 hover:bg-orange-600"
                    >
                        <FaTruck />  Order
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PlaceOrder;