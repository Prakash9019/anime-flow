// backend/routes/user.js (new file)
const express = require('express');
const Rating = require('../models/Rating');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's ratings
router.get('/ratings', auth, async (req, res) => {
  try {
    const ratings = await Rating.find({ user: req.user._id })
      .populate('anime', 'title poster')
      .sort({ createdAt: -1 });
    
    res.json({ ratings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
