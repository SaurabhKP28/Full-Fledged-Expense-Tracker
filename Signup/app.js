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
const sequelize = new Sequelize("user", "root", "Lonewolf@123", {
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

// ✅ Serve `login.html` when visiting `/`
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// ✅ Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body; // Removed "name" from destructuring since it's unused

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).send("Error 404: Email not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send("Error 401: Incorrect password");
        }

        return res.status(200).send("User login successful!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
