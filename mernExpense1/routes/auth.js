const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.redirect("/signup.html?error=User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword });

        res.redirect("/login.html");
    } catch (error) {
        res.status(500).send("Server Error");
    }
});


// Login Route
router.post("/login", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email, name } });
        if (!user) {
            return res.redirect("/login.html?error=User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.redirect("/login.html?error=Incorrect password");
        }

        const token = jwt.sign({ id: user.id, email: user.email }, "secretkey", { expiresIn: "1h" });
        res.redirect(`/expense.html?token=${token}`);
    } catch (error) {
        res.status(500).send("Server Error");
    }
});
/*
router.post("/login", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email, name } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect password" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, "secretkey", { expiresIn: "1h" });
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token: token
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
*/
module.exports = router;

