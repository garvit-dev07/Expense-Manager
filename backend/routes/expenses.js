const express = require('express');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/expense', auth, async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({ message: 'Title, amount, and category are required' });
    }

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      date: date || Date.now(),
    });

    return res.status(201).json(expense);
  } catch (error) {
    return res.status(500).json({ message: 'Could not add expense' });
  }
});

router.get('/expenses', auth, async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { user: req.user._id };

    if (category && category !== 'All') {
      filter.category = category;
    }

    const expenses = await Expense.find(filter).sort({ date: -1, createdAt: -1 });
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return res.json({ expenses, total });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch expenses' });
  }
});

module.exports = router;
