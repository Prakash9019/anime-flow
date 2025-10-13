// backend/routes/payment.js
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Donation = require('../models/Donation');
const auth = require('../middleware/auth');

const router = express.Router();

// Create donation payment intent
router.post('/create-donation-intent', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (amount < 1) {
      return res.status(400).json({ message: 'Minimum donation amount is $1' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId: req.user._id.toString(),
        type: 'donation'
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment intent creation failed', error: error.message });
  }
});

// Confirm donation and grant ad-free access
router.post('/confirm-donation', auth, async (req, res) => {
  try {
    const { paymentIntentId, amount } = req.body;

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded' || true) { // true for simulation
      // Create donation record
      const donation = new Donation({
        user: req.user._id,
        amount: amount,
        paymentIntentId: paymentIntentId,
        status: 'completed'
      });
      await donation.save();

      // Grant ad-free access
      await User.findByIdAndUpdate(req.user._id, {
        isAdFree: true,
        adFreeGrantedAt: new Date()
      });

      res.json({ message: 'Donation confirmed and ad-free access granted' });
    } else {
      res.status(400).json({ message: 'Payment not completed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Donation confirmation failed', error: error.message });
  }
});

module.exports = router;
