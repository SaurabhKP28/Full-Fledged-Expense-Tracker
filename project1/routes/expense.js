const express = require("express");
const Expense = require("../models/Expense");

const router = express.Router();

// Add an expense
router.post("/expense", async (req, res) => {
  try {
    const { userId, amount, category, description } = req.body;
    const expense = await Expense.create({ userId, amount, category, description });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: "Failed to add expense" });
  }
});

// Get all expenses for a user
router.get("/expenses/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const expenses = await Expense.findAll({ where: { userId } });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// Delete an expense
router.delete("/expense/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    await expense.destroy();
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

module.exports = router;
