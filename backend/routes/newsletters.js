const express = require('express');
const Newsletter = require('../models/Newsletter');
const router = express.Router();

// GET /api/newsletters  (if not public require auth in frontend)
router.get('/', async (req, res) => {
  try {
    const items = await Newsletter.find({}).sort({ created_at: -1 }).lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST to create (admin)
router.post('/', async (req, res) => {
  try {
    // TODO: restrict to admin
    const created = await Newsletter.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: 'Bad request' });
  }
});

module.exports = router;
