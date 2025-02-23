// routes/expense.js
const express = require("express");
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/expense", auth, async (req, res) => {
    try {
        const { amount, category, description } = req.body;
        const expense = await Expense.create({
            userId: req.user.id,
            amount,
            category,
            description,
        });
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ error: "Failed to add expense" });
    }
});

router.get("/expenses", auth, async (req, res) => {
    try {
        const expenses = await Expense.findAll({ where: { userId: req.user.id } });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch expenses" });
    }
});

router.delete("/expense/:id", auth, async (req, res) => {
    try {
        const expense = await Expense.findOne({ where: { id: req.params.id, userId: req.user.id } });
        if (!expense) return res.status(404).json({ error: "Expense not found" });
        await expense.destroy();
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete expense" });
    }
});

module.exports = router;