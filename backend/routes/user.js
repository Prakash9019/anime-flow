// backend/routes/user.js
const express = require('express');
const bcrypt = require('bcryptjs');
const Rating = require('../models/Rating');
const User = require('../models/User');
const Donation = require('../models/Donation');
const Episode = require('../models/Episode');
const Anime = require('../models/Anime');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's ratings
router.get('/ratings', auth, async (req, res) => {
  try {
    const ratings = await Rating.find({ user: req.user._id })
      .populate({
        path: 'anime',
        select: 'title poster'
      })
      .populate({
        path: 'episode',
        select: 'title number'
      })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to recent 50 ratings
    
    // Transform ratings to include both anime and episode ratings
    const transformedRatings = ratings.map(rating => ({
      _id: rating._id,
      rating: rating.rating,
      createdAt: rating.createdAt,
      anime: rating.anime,
      episode: rating.episode
    }));
    console.log(ratings);
    res.json({ ratings: transformedRatings });
  } catch (error) {
    console.error('Get ratings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user profile with stats
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user statistics
    const ratingsCount = await Rating.countDocuments({ user: req.user._id });
    const animeRatingsCount = await Rating.countDocuments({ 
      user: req.user._id, 
      anime: { $exists: true } 
    });
    const episodeRatingsCount = await Rating.countDocuments({ 
      user: req.user._id, 
      episode: { $exists: true } 
    });
    
    // Get donation history
    const donations = await Donation.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    
    const totalDonated = donations.reduce((sum, donation) => 
      donation.status === 'completed' ? sum + donation.amount : sum, 0
    );

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isAdFree: user.isAdFree || false,
        adFreeGrantedAt: user.adFreeGrantedAt,
        createdAt: user.createdAt
      },
      stats: {
        totalRatings: ratingsCount,
        animeRatings: animeRatingsCount,
        episodeRatings: episodeRatingsCount,
        totalDonated: totalDonated,
        donationCount: donations.filter(d => d.status === 'completed').length
      },
      donations: donations
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check ad-free status
router.get('/ad-free-status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('isAdFree adFreeGrantedAt');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      isAdFree: user.isAdFree || false,
      adFreeGrantedAt: user.adFreeGrantedAt
    });
  } catch (error) {
    console.error('Check ad-free status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const updateData = {};
    
    if (name && name.trim()) {
      updateData.name = name.trim();
    }
    
    if (avatar) {
      updateData.avatar = avatar;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isAdFree: user.isAdFree
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await User.findByIdAndUpdate(req.user._id, { password: hashedNewPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's watchlist/favorites
router.get('/watchlist', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'watchlist',
        select: 'title poster averageRating genres status',
        options: { limit: 50 }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ watchlist: user.watchlist || [] });
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add anime to watchlist
router.post('/watchlist/:animeId', auth, async (req, res) => {
  try {
    const { animeId } = req.params;

    // Check if anime exists
    const anime = await Anime.findById(animeId);
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }

    // Add to user's watchlist if not already present
    const user = await User.findById(req.user._id);
    if (!user.watchlist) {
      user.watchlist = [];
    }

    if (!user.watchlist.includes(animeId)) {
      user.watchlist.push(animeId);
      await user.save();
    }

    res.json({ message: 'Added to watchlist successfully' });
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove anime from watchlist
router.delete('/watchlist/:animeId', auth, async (req, res) => {
  try {
    const { animeId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user.watchlist) {
      return res.status(404).json({ message: 'Watchlist is empty' });
    }

    user.watchlist = user.watchlist.filter(id => id.toString() !== animeId);
    await user.save();

    res.json({ message: 'Removed from watchlist successfully' });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's donation history
router.get('/donations', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    const totalDonated = donations.reduce((sum, donation) => 
      donation.status === 'completed' ? sum + donation.amount : sum, 0
    );

    res.json({ 
      donations,
      totalDonated,
      donationCount: donations.filter(d => d.status === 'completed').length
    });
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user activity (recent ratings, watchlist changes, etc.)
router.get('/activity', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    // Get recent ratings
    const recentRatings = await Rating.find({ user: req.user._id })
      .populate('anime', 'title poster')
      .populate('episode', 'title number')
      .sort({ createdAt: -1 })
      .limit(limit);

    // Get recent donations
    const recentDonations = await Donation.find({ 
      user: req.user._id,
      status: 'completed'
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // Combine and sort activities by date
    const activities = [
      ...recentRatings.map(rating => ({
        type: 'rating',
        action: rating.episode ? 'Rated episode' : 'Rated anime',
        target: rating.episode ? 
          `${rating.anime?.title} - Episode ${rating.episode?.number}` : 
          rating.anime?.title,
        rating: rating.rating,
        date: rating.createdAt
      })),
      ...recentDonations.map(donation => ({
        type: 'donation',
        action: 'Made donation',
        target: `$${donation.amount}`,
        date: donation.createdAt
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);

    res.json({ activities });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user account
router.delete('/account', auth, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required to delete account' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Delete user's data
    await Rating.deleteMany({ user: req.user._id });
    await Donation.updateMany(
      { user: req.user._id },
      { $unset: { user: 1 } } // Remove user reference but keep donation record
    );

    // Delete user account
    await User.findByIdAndDelete(req.user._id);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user preferences
router.get('/preferences', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('preferences');
    
    const defaultPreferences = {
      notifications: {
        email: true,
        push: true,
        newEpisodes: true,
        recommendations: true
      },
      privacy: {
        showRatings: true,
        showWatchlist: true,
        showActivity: false
      },
      display: {
        theme: 'dark',
        language: 'en',
        adultContent: false
      }
    };

    res.json({ 
      preferences: user?.preferences || defaultPreferences 
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { preferences } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferences },
      { new: true, runValidators: true }
    ).select('preferences');

    res.json({ 
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
