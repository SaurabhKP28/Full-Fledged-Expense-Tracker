/*
const express = require("express");
const router = express.Router();
const { User, Expense } = require("../models");
const sequelize = require("../config/database");
const authenticateToken = require("../middleware/auth");

router.get("/", authenticateToken, async (req, res) => {
    try {
        const leaderboardData = await Expense.findAll({
            attributes: [
                "userId",
                [sequelize.fn("SUM", sequelize.col("amount")), "totalExpense"]
            ],
            group: ["userId"],
            order: [[sequelize.literal("totalExpense"), "DESC"]],
            raw: true
        });

        const users = await User.findAll({ attributes: ["id", "name"] });
        const userMap = {};
        users.forEach(user => userMap[user.id] = user.name);

        const leaderboardWithNames = leaderboardData.map(entry => ({
            name: userMap[entry.userId] || "Unknown",
            totalExpense: entry.totalExpense
        }));

        res.json(leaderboardWithNames);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
});

module.exports = router;
*/
const express = require("express");
const router = express.Router();
const { User, Expense } = require("../models");
const sequelize = require("../config/database");
const authenticateToken = require("../middleware/auth");

// Leaderboard route
router.get("/", authenticateToken, async (req, res) => {
    try {
        // Fetch total expenses per user
        const leaderboardData = await Expense.findAll({
            attributes: [
                "userId",
                [sequelize.fn("SUM", sequelize.col("amount")), "totalExpense"]
            ],
            group: ["userId"],
            order: [[sequelize.literal("totalExpense"), "DESC"]],
            raw: true
        });

        // Fetch user details
        const users = await User.findAll({ attributes: ["id", "name"] });
        const userMap = {};
        users.forEach(user => userMap[user.id] = user.name);

        // Merge user names with leaderboard data
        const leaderboardWithNames = leaderboardData.map(entry => ({
            name: userMap[entry.userId] || "Unknown",
            totalExpense: entry.totalExpense
        }));

        res.json(leaderboardWithNames);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
});

module.exports = router;
