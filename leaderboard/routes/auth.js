const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists with this email." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        res.json({ message: "Signup successful! Please login." });
    } catch (error) {
        res.status(500).json({ error: "Signup failed! Please try again." });
    }
});

router.post("/login", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        const user = await User.findOne({ where: { email, name } });

        if (!user) {
            return res.status(401).json({ error: "User not found. Please check your name and email." });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid credentials!" });
        }

        const token = jwt.sign(
            { userId: user.id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "Login failed! Please try again." });
    }
});

module.exports = router;