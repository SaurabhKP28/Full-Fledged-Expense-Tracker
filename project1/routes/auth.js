const express = require("express");
const bcrypt = require("bcryptjs");
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

        res.redirect(`/expense.html?userId=${user.id}`);
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;
