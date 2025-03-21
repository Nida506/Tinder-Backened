// src/routes/payment.js
const express = require("express");
const { userAuth } = require("../middlewares/auth"); // Make sure this path is correct
const paymentRouter = express.Router();
const { instance } = require("../utils/razorpay"); // Importing Razorpay instance
const { Payment } = require("../models/payment");
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  const { membershipType } = req.body;
  const { firstName, lastName, emailId } = req.user;
  try {
    const order = await instance.orders.create({
      amount: 50000, // 500 INR
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType,
      },
    });
    console.log("Order Created:", order);
    //return back order details to frontend
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });
    const savedPayment = await payment.save();

    res.json({ ...savedPayment.toJSON(), keyId: "rzp_test_N0FISfDJKALPxf" });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ msg: err.message });
  }
});

module.exports = paymentRouter;
