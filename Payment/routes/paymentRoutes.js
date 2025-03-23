/*
const express = require("express");
const { createOrder, updateOrderStatus, getOrderStatus } = require("../controllers/paymentController"); 

const router = express.Router();

router.post("/pay", createOrder);
router.post("/order/:orderId", updateOrderStatus);

// ✅ Add this route to handle payment status
router.get("/payment-status/:orderId", getOrderStatus);

module.exports = router;
*/

const express = require("express");
const { createOrder, updateOrderStatus, getOrderStatus } = require("../controllers/paymentController");

const router = express.Router();

router.post("/pay", createOrder);
router.post("/order/:orderId", updateOrderStatus);
router.get("/payment-status/:orderId", getOrderStatus); // ✅ Correct route

module.exports = router;
