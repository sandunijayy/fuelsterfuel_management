import PlaceOrder from "../models/PlaceOrderModel.js";

export const placeOrder = async (req, res) => {
  const { supplierId, fuelType, quantity, deliveryDate } = req.body;

  try {
    // Check if all fields are provided
    if (!supplierId || !fuelType || !quantity || !deliveryDate) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    // Create the order document
    const order = await PlaceOrder.create({
      supplierId,
      fuelType,
      quantity,
      deliveryDate,
    });

    // Return success response
    res.status(201).json({
      order: {
        id: order._id,
        supplierId: order.supplierId,
        fuelType: order.fuelType,
        quantity: order.quantity,
        deliveryDate: order.deliveryDate,
      },
      message: "Order placed successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Fetch all orders
export const getOrdersBySupplier = async (req, res) => {
  const { supplierId } = req.params;

  try {
    const orders = await PlaceOrder.find({ supplierId }).populate("supplierId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  
  // Delete an order by ID
  export const deleteOrder = async (req, res) => {
    const { orderId } = req.params;
  
    try {
      const order = await PlaceOrder.findByIdAndDelete(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json({ message: "Order deleted successfully!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  