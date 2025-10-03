// backend/controllers/animeController.js
const Anime = require('../models/Anime');
const Episode = require('../models/Episode');
const Rating = require('../models/Rating');
const malService = require('../services/malService');

exports.getAnimeList = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, sort = 'rank' } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { titleEnglish: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const sortOptions = {
      rank: { rank: 1 },
      title: { title: 1 },
      rating: { averageRating: -1 },
      popularity: { popularity: 1 },
    };

    const anime = await Anime.find(query)
      .sort(sortOptions[sort] || sortOptions.rank)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('episodes')
      .lean();

    const total = await Anime.countDocuments(query);

    res.json({
      anime,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAnimeById = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id)
      .populate('episodes')
      .populate('userRatings.user', 'name avatar');

    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }

    res.json(anime);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.rateAnime = async (req, res) => {
  try {
    const { animeId, rating, review } = req.body;
    const userId = req.user.id;

    if (rating < 1 || rating > 10) {
      return res.status(400).json({ message: 'Rating must be between 1 and 10' });
    }

    const anime = await Anime.findById(animeId);
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }

    // Check if user already rated this anime
    const existingRatingIndex = anime.userRatings.findIndex(
      r => r.user.toString() === userId
    );

    if (existingRatingIndex > -1) {
      // Update existing rating
      anime.userRatings[existingRatingIndex].rating = rating;
    } else {
      // Add new rating
      anime.userRatings.push({ user: userId, rating });
    }

    anime.averageRating = anime.calculateAverageRating();
    await anime.save();

    // Save rating record
    let ratingRecord = await Rating.findOne({ user: userId, anime: animeId });
    if (ratingRecord) {
      ratingRecord.rating = rating;
      ratingRecord.review = review;
    } else {
      ratingRecord = new Rating({ user: userId, anime: animeId, rating, review });
    }
    await ratingRecord.save();

    res.json({ message: 'Rating saved successfully', averageRating: anime.averageRating });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.rateEpisode = async (req, res) => {
  try {
    const { episodeId, rating } = req.body;
    const userId = req.user.id;

    if (rating < 1 || rating > 10) {
      return res.status(400).json({ message: 'Rating must be between 1 and 10' });
    }

    const episode = await Episode.findById(episodeId);
    if (!episode) {
      return res.status(404).json({ message: 'Episode not found' });
    }

    const existingRatingIndex = episode.userRatings.findIndex(
      r => r.user.toString() === userId
    );

    if (existingRatingIndex > -1) {
      episode.userRatings[existingRatingIndex].rating = rating;
    } else {
      episode.userRatings.push({ user: userId, rating });
    }

    // Calculate average
    const sum = episode.userRatings.reduce((acc, r) => acc + r.rating, 0);
    episode.averageRating = (sum / episode.userRatings.length).toFixed(1);
    await episode.save();

    // Save rating record
    let ratingRecord = await Rating.findOne({ user: userId, episode: episodeId });
    if (ratingRecord) {
      ratingRecord.rating = rating;
    } else {
      ratingRecord = new Rating({ user: userId, episode: episodeId, rating });
    }
    await ratingRecord.save();

    res.json({ message: 'Episode rating saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.syncWithMAL = async (req, res) => {
  try {
    const malAnime = await malService.getAnimeList(100, 0);
    
    for (const animeData of malAnime) {
      const existingAnime = await Anime.findOne({ malId: animeData.malId });
      
      if (!existingAnime) {
        const newAnime = new Anime(animeData);
        await newAnime.save();
      }
    }

    res.json({ message: 'Anime data synced successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to sync with MAL', error: error.message });
  }
};
