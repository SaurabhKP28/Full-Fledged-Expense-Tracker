const axios = require("axios");
const Order = require("../models/order");
require("dotenv").config();

exports.createOrder = async (req, res) => { // ✅ Ensure function is exported properly
    try {
        const { userId, amount } = req.body;
        const orderId = `order_${Date.now()}`;

        await Order.create({ id: orderId, userId, amount });

        const response = await axios.post(
            "https://sandbox.cashfree.com/pg/orders",
            {
                order_id: orderId,
                order_amount: amount,
                order_currency: "INR",
                customer_details: {
                    customer_id: String(userId), // ✅ Convert to string
                    customer_email: "test@example.com",
                    customer_phone: "9999999999"
                },
                order_meta: {
                    return_url: `http://localhost:3000/payment-status/${orderId}`
                }
            },
            {
                headers: {
                    "x-client-id": process.env.CASHFREE_APP_ID,
                    "x-client-secret": process.env.CASHFREE_SECRET_KEY,
                    "x-api-version": "2025-01-01",
                    "content-type": "application/json"
                }
            }
        );

        res.json({ paymentSessionId: response.data.payment_session_id, orderId });
    } catch (error) {
        console.error("Cashfree API Error:", error);
        res.status(500).json({ message: "Payment initiation failed." });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus } = req.body;

        console.log(`Updating order ${orderId} to status: ${orderStatus}`); // ✅ Debugging

        const order = await Order.findByPk(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.status = orderStatus;
        await order.save();

        console.log(`✅ Order ${orderId} updated to: ${order.status}`);

        res.json({ message: `Order updated to ${orderStatus}` });
    } catch (error) {
        console.error("Update Order Status Error:", error);
        res.status(500).json({ message: error.message });
    }
};

/*
exports.updateOrderStatus = async (req, res) => { // ✅ Ensure function is exported properly
    try {
        const { orderId } = req.params;
        const { orderStatus } = req.body;

        const order = await Order.findByPk(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.status = orderStatus;
        await order.save();

        res.json({ message: `Order updated to ${orderStatus}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus } = req.body; // Expecting 'SUCCESS' or 'FAILED'

        console.log(`Updating order ${orderId} to status: ${orderStatus}`); // Debugging log

        const order = await Order.findByPk(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.status = orderStatus;
        await order.save();

        console.log(`Order ${orderId} updated to ${orderStatus}`); // Debugging log
        res.json({ message: `Order updated to ${orderStatus}` });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: error.message });
    }
};
*/
exports.getOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log(`Fetching status for order: ${orderId}`); // ✅ Debugging

        const order = await Order.findByPk(orderId);

        if (!order) {
            console.log(`Order not found in DB: ${orderId}`); // ✅ Debugging
            return res.status(404).json({ orderStatus: "Not Found" });
        }

        console.log(`Order found. Status: ${order.status}`); // ✅ Debugging
        res.status(200).json({ orderStatus: order.status });
    } catch (error) {
        console.error("Error fetching payment status:", error);
        res.status(500).json({ orderStatus: "Error" });
    }
};
