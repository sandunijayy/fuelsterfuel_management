import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const OrdersPage = () => {
  const { supplierId } = useParams(); // Get supplierId from URL
  const location = useLocation();
  const [orders, setOrders] = useState([]);

  // Fetch all orders for the supplier
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/${supplierId}`);
        setOrders(response.data);
      } catch (error) {
        toast.error('Failed to fetch orders');
      }
    };

    if (supplierId) {
      loadOrders();
    }
  }, [supplierId]);

  // Add the new order if it was passed from PlaceOrder
  useEffect(() => {
    if (location.state?.newOrder) {
      setOrders((prevOrders) => [...prevOrders, location.state.newOrder]);
    }
  }, [location.state]);

  // Handle delete order
  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5000/api/order/${orderId}`);
      setOrders(orders.filter(order => order._id !== orderId)); // Remove order from the list
      toast.success('Order deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete the order');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-300">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">Previous Orders</h2>

        <ul className="space-y-4">
          {orders.lengtah === 0 ? (
            <p className="text-center text-gray-700">No orders placed yet.</p>
          ) : (
            orders.map((order) => (
              <li key={order._id} className="flex justify-between items-center">
                <div>{order.fuelType} - {order.quantity}L - {new Date(order.deliveryDate).toLocaleDateString()}</div>
                <button
                  onClick={() => handleDelete(order._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default OrdersPage;
