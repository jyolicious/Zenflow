const express = require('express');
const Instructor = require('../models/Instructor');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await Instructor.find({}).lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Instructor.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST/PUT/DELETE for admin (like Asana)...
module.exports = router;
