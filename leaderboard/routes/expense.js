/*
const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const authenticateToken = require("../middleware/auth");

router.post("/", authenticateToken, async (req, res) => {
    try {
        const { amount, category, description } = req.body;
        const expense = await Expense.create({
            userId: req.user.userId,
            amount,
            category,
            description
        });
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ error: "Failed to add expense" });
    }
});

router.get("/", authenticateToken, async (req, res) => {
    try {
        const expenses = await Expense.findAll({ where: { userId: req.user.userId } });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch expenses" });
    }
});

router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const expense = await Expense.findOne({
            where: { id: req.params.id, userId: req.user.userId }
        });
        if (!expense) return res.status(404).json({ error: "Expense not found" });
        await expense.destroy();
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete expense" });
    }
});

module.exports = router;
*/

const express = require("express");
const router = express.Router();
const { Expense } = require("../models");
const authenticateToken = require("../middleware/auth");

// Add an expense
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { amount, category, description } = req.body;

        if (!amount || !category) {
            return res.status(400).json({ error: "Amount and category are required" });
        }

        const expense = await Expense.create({
            userId: req.user.userId,  // Extract user ID from token
            amount,
            category,
            description
        });

        res.status(201).json(expense);
    } catch (error) {
        console.error("Error adding expense:", error);
        res.status(500).json({ error: "Failed to add expense" });
    }
});

// Fetch all expenses for the logged-in user
router.get("/", authenticateToken, async (req, res) => {
    try {
        const expenses = await Expense.findAll({
            where: { userId: req.user.userId },
            order: [["createdAt", "DESC"]]
        });

        res.json(expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ error: "Failed to fetch expenses" });
    }
});

// Delete an expense
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const expense = await Expense.findOne({
            where: { id: req.params.id, userId: req.user.userId }
        });

        if (!expense) {
            return res.status(404).json({ error: "Expense not found" });
        }

        await expense.destroy();
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ error: "Failed to delete expense" });
    }
});

module.exports = router;
