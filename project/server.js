const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");

// Initialize Express App
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // ✅ Correctly serve static files

// Connect to MySQL Database
const sequelize = new Sequelize("userdb", "root", "Lonewolf@123", {
    host: "localhost",
    dialect: "mysql",
});

// Define User Model
const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
});

// Sync Database
sequelize.sync().then(() => console.log("Database Connected & Synced"));

// ✅ Serve signup.html from /public when visiting `/`
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signup.html")); // ✅ Now looks in the public folder
});

// ✅ Serve login.html from /public when visiting `/login`
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html")); // ✅ Now looks in the public folder
});

// ✅ Signup Route
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.redirect("/?error=" + encodeURIComponent("Error: Requested Failed with status code 403."));
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store user in database
        await User.create({ name, email, password: hashedPassword });

        res.redirect("/login.html"); // ✅ Redirect to login after successful signup
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

// ✅ Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.redirect("/login.html?error=" + encodeURIComponent("User not found!"));
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.redirect("/login.html?error=" + encodeURIComponent("Incorrect password!"));
        }

        res.send("Login successful! Welcome, " + user.name);
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
