// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const animeRoutes = require('./routes/anime');
const adminRoutes = require('./routes/admin');
const ratingRoutes = require('./routes/ratings');

const app = express();

// Middleware
app.use(cors());
// app.use(cors({
//   allowedHeaders: ['X-User-Auth', 'Content-Type'],
// }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database connection || 'mongodb+srv://plsprakash2003:Surya_2003@cluster0.2yh1df7.mongodb.net/anime_flow?retryWrites=true&w=majority&ssl=true
mongoose.connect('mongodb+srv://plsprakash2003:Surya_2003@cluster0.2yh1df7.mongodb.net/anime_flow?retryWrites=true&w=majority&ssl=true')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
// backend/server.js (add this line)
// backend/server.js (add ads routes)
const adRoutes = require('./routes/ads');

// Add with your other routes
app.use('/api/ads', adRoutes);


app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/anime', animeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ratings', ratingRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to AnimeFlow API');
});
app.get('/health', (req, res) => {
  res.send('Welcome to AnimeFlow API');
});
const PORT = process.env.PORT || 8080 ;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`✅ Server running on http://${HOST}:${PORT}`);
});
