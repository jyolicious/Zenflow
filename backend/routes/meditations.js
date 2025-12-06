const express = require('express');
const Meditation = require('../models/Meditation');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const q = req.query.q;
    let filter = {};
    if (q) {
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
        { tags: new RegExp(q, 'i') }
      ];
    }
    const items = await Meditation.find(filter).limit(100).lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// other CRUD routes resemble Asana routes (POST/PUT/DELETE)...

module.exports = router;
