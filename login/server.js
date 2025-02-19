const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const PORT = 3001;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Connect to MySQL Database
const sequelize = new Sequelize("userDB", "root", "Lonewolf@123", {
    host: "localhost",
    dialect: "mysql",
});

// Define User Model
const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
});

// Sync Database
sequelize.sync().then(() => console.log("Database Connected & Synced"));

// ✅ Serve `login.html` when visiting `/`
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// ✅ Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        // If both email & password are incorrect
        if (!user) {
            return res.redirect("/?error=" + encodeURIComponent("Error 404: Emial not found1"));
        }

        const isMatch = await bcrypt.compare(password, user.password);

        // If only password is incorrect
        if (!isMatch) {
            return res.redirect("/?error=" + encodeURIComponent("Error: Incorrect password!"));
        }

        // If everything is correct
        return res.redirect("/?success=" + encodeURIComponent("User login successful!"));
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
