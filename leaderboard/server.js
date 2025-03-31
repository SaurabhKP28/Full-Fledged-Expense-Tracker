/*
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const sequelize = require("./config/database");
const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expense");
const leaderboardRoutes = require("./routes/leaderboard");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/auth", authRoutes);
app.use("/expense", expenseRoutes);
app.use("/leaderboard", leaderboardRoutes);

// Redirect root to signup.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signup.html"));
});

// Database sync and server start
sequelize.sync()
    .then(() => {
        console.log("Database connected");
        // Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
    })
    .catch(err => {
        console.error("Failed to connect to database:", err);
    });

    
*/

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const sequelize = require("./config/database");
const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expense");
const leaderboardRoutes = require("./routes/leaderboard");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/auth", authRoutes);
app.use("/expense", expenseRoutes);
app.use("/leaderboard", leaderboardRoutes);

// ✅ Send signup.html for root `/`
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signup.html"));
});


// Database sync and start server
sequelize.sync()
    .then(() => {
        console.log("Database connected");
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error("Failed to connect to database:", err);
    });
