const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const sequelize = require("./config/database");
const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expense");

const app = express();
const PORT = 3000;
const SECRET_KEY = "secret_key";

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Default Route for Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signup.html"));
});

// Routes
app.use(authRoutes);
app.use(expenseRoutes);

// Sync Database
sequelize.sync().then(() => console.log("Database Connected & Synced"));

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});