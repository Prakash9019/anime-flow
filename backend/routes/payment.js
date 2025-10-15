// // backend/routes/payment.js
// const express = require('express');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const User = require('../models/User');
// const Donation = require('../models/Donation');
// const auth = require('../middleware/auth');

// const router = express.Router();

// // Create donation payment intent
// router.post('/create-donation-intent', auth, async (req, res) => {
//   try {
//     const { amount } = req.body;
    
//     if (amount < 1) {
//       return res.status(400).json({ message: 'Minimum donation amount is $1' });
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount * 100), // Convert to cents
//       currency: 'usd',
//       metadata: {
//         userId: req.user._id.toString(),
//         type: 'donation'
//       }
//     });

//     res.json({
//       clientSecret: paymentIntent.client_secret,
//       paymentIntentId: paymentIntent.id
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Payment intent creation failed', error: error.message });
//   }
// });

// // Confirm donation and grant ad-free access
// router.post('/confirm-donation', auth, async (req, res) => {
//   try {
//     const { paymentIntentId, amount } = req.body;

//     // Verify payment with Stripe
//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
//     if (paymentIntent.status === 'succeeded' || true) { // true for simulation
//       // Create donation record
//       const donation = new Donation({
//         user: req.user._id,
//         amount: amount,
//         paymentIntentId: paymentIntentId,
//         status: 'completed'
//       });
//       await donation.save();

//       // Grant ad-free access
//       await User.findByIdAndUpdate(req.user._id, {
//         isAdFree: true,
//         adFreeGrantedAt: new Date()
//       });

//       res.json({ message: 'Donation confirmed and ad-free access granted' });
//     } else {
//       res.status(400).json({ message: 'Payment not completed' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Donation confirmation failed', error: error.message });
//   }
// });

// module.exports = router;

// backend/routes/payment.js
const express = require('express');
// NOTE: Use environment variable for the secret key for production/testing
// For testing, set process.env.STRIPE_SECRET_KEY to 'sk_test_...'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY_TEST ); // Fallback to your test key

const User = require('../models/User'); // Assuming these models exist
const Donation = require('../models/Donation');
const auth = require('../middleware/auth'); // Assuming auth middleware exists

const router = express.Router();

// 1. Create donation payment intent (Called by PaymentModal.tsx)
router.post('/create-donation-intent', auth, async (req, res) => {
  try {
    const { amount } = req.body; // Amount is expected in cents (e.g., 100 for $1.00)
    
    // Server-side validation of the minimum amount
    if (amount < 100) { // Minimum $1.00 donation = 100 cents
      return res.status(400).json({ message: 'Minimum donation amount is 100 cents ($1.00)' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Use the amount in cents
      currency: 'usd',
      metadata: {
        userId: req.user._id.toString(), // Assuming auth middleware provides req.user
        type: 'donation'
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ message: 'Payment intent creation failed', error: error.message });
  }
});

// 2. Confirm donation and grant ad-free access (Called by PaymentModal.tsx after successful client confirmation)
router.post('/confirm-donation', auth, async (req, res) => {
  try {
    const { paymentIntentId, amount } = req.body; // amount here is the dollar amount for logging/display

    // 1. Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    // Check if the status is 'succeeded' and the amount matches (optional but recommended)
    if (paymentIntent.status === 'succeeded' && paymentIntent.amount === Math.round(amount * 100)) { 
      
      // 2. Create donation record
      const donation = new Donation({
        user: req.user._id,
        amount: amount, // Store the dollar amount
        paymentIntentId: paymentIntentId,
        status: 'completed'
      });
      await donation.save();

      // 3. Grant ad-free access
      await User.findByIdAndUpdate(req.user._id, {
        isAdFree: true,
        adFreeGrantedAt: new Date()
      });

      res.json({ message: 'Donation confirmed and ad-free access granted' });
    } else {
      // Log the unexpected status or mismatch
      res.status(400).json({ message: `Payment not completed. Status: ${paymentIntent.status}` });
    }
  } catch (error) {
    console.error("Confirmation Error:", error);
    res.status(500).json({ message: 'Donation confirmation failed', error: error.message });
  }
});

module.exports = router;