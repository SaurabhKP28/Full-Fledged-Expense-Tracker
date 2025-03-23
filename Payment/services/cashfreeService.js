import { Cashfree } from "cashfree-pg"; 

// Set Cashfree API credentials
Cashfree.XClientId = process.env.CASHFREE_APP_ID || "TEST430329ae80e0f32e41a393d78b923034";
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY || "TESTaf195616268bd6202eeb3bf8dc458956e7192a85";
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

// Function to create an order
exports.createOrder = async (
    orderId,
    orderAmount,
    orderCurrency = "INR",
    customerID,
    customerPhone
) => {
    try {
        const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
        const formattedExpiryDate = expiryDate.toISOString();

        const request = {
            order_amount: orderAmount,
            order_currency: orderCurrency,
            order_id: orderId,
            customer_details: {
                customer_id: customerID,
                customer_phone: customerPhone
            },
            order_meta: {
                return_url: `http://localhost:3000/api/payments/payment-status/${orderId}`, 
                payment_methods: "ccc,upi,nb"
            },
            order_expiry_time: formattedExpiryDate,
        };

        // Creating an order with Cashfree
        const response = await Cashfree.PGCreateOrder("2025-01-01", request);
        console.log("Order created successfully:", response.data);
        return response.data.payment_session_id;
    } catch (error) {
        console.error("Error creating order:", error.response?.data?.message || error.message);
        throw error;
    }
};

// Function to get payment status
/*
exports.getPaymentStatus = async (orderId) => {
    try {
        const response = await Cashfree.PGOrderFetchPayment("2025-01-01", orderId);
        let getOrderResponse = response.data;

        let orderStatus;

        if (
            getOrderResponse.filter(
                (transaction) => transaction.payment_status === "SUCCESS")
        ) {
            orderStatus = "Success";
        } else if (
            getOrderResponse.filter(
                (transaction) => transaction.payment_status === "PENDING")
        ) {
            orderStatus = "Pending";
        } else {
            orderStatus = "Failure";
        }

       console.log(`Payment Status for Order ${orderId}: ${orderStatus}`);
        return orderStatus;
    } catch (error) {
        console.error("Error fetching payment status:", error.response?.data?.message || error.message);
        throw error;
    }
};

exports.getPaymentStatus = async (orderId) => {
    try {
        const response = await Cashfree.PGOrderFetchPayment("2025-01-01", orderId);
        let getOrderResponse = response.data;

        let orderStatus;

        if (getOrderResponse.some(transaction => transaction.payment_status === "SUCCESS")) {
            orderStatus = "Success";
        } else if (getOrderResponse.some(transaction => transaction.payment_status === "PENDING")) {
            orderStatus = "Pending";
        } else {
            orderStatus = "Failure";
        }

        // Update the order status in the database
        const order = await Order.findByPk(orderId);
        if (order) {
            order.status = orderStatus;
            await order.save();
        }

        console.log(`Payment Status for Order ${orderId}: ${orderStatus}`);
        return orderStatus;
    } catch (error) {
        console.error("Error fetching payment status:", error.response?.data?.message || error.message);
        throw error;
    }
};

*/
exports.getPaymentStatus = async (orderId) => {
    try {
        console.log(`🔍 Checking payment status for order ${orderId}`);

        const response = await Cashfree.PGOrderFetchPayment("2025-01-01", orderId);
        console.log("Cashfree API Response:", response.data); // ✅ Debugging

        let orderStatus = "Failure"; // Default status

        if (response.data.some(transaction => transaction.payment_status === "SUCCESS")) {
            orderStatus = "Success";
        } else if (response.data.some(transaction => transaction.payment_status === "PENDING")) {
            orderStatus = "Pending";
        }

        // ✅ Ensure order exists in DB before updating
        const order = await Order.findByPk(orderId);
        if (!order) {
            console.log(`⚠️ Order not found in DB: ${orderId}`);
            return { orderStatus: "Not Found" };
        }

        order.status = orderStatus;
        await order.save();

        console.log(`✅ Order ${orderId} status updated to: ${orderStatus}`);
        return { orderStatus };
    } catch (error) {
        console.error("❌ Error fetching payment status:", error.response?.data?.message || error.message);
        return { orderStatus: "Error" };
    }
};
