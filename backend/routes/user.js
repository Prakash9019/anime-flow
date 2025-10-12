// backend/routes/user.js (new file)
const express = require('express');
const Rating = require('../models/Rating');
const auth = require('../middleware/auth');

const router = express.Router();
// backend/controllers/userController.js
const User = require('../models/User');

// Get user's ratings
exports.getUserRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ user: req.user._id })
      .populate('anime', 'title poster')
      .populate('episode', 'title number')
      .sort({ createdAt: -1 });
    
    res.json({ ratings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user profile stats
exports.getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const ratingsCount = await Rating.countDocuments({ user: req.user._id });
    
    res.json({
      user,
      stats: {
        totalRatings: ratingsCount,
        // Add more stats as needed
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's ratings
router.get('/ratings', auth, async (req, res) => {
  try {
    console.log(req.user._id)
    const ratings = await Rating.find({ user: req.user._id })
      .populate('anime', 'title poster')
      .sort({ createdAt: -1 });
    
    res.json({ ratings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
