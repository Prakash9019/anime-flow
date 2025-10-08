// backend/controllers/animeController.js
const Anime = require('../models/Anime');
const Episode = require('../models/Episode');
const Rating = require('../models/Rating');
const malService = require('../services/malService');
const jikanService = require('../services/jikanServices');

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
    console.log(anime);

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
    console.log('Starting MAL sync with episodes...');
    
    // Fetch top anime from MAL
    const malData = await malService.getAnimeRanking({ limit: 50 }); // Reduced to 50 to avoid rate limits
    
    let syncedAnime = 0;
    let syncedEpisodes = 0;
    
    for (const item of malData.data) {
      const animeData = item.node;
      
      // Check if anime already exists
      const existingAnime = await Anime.findOne({ malId: animeData.id });
      
      if (!existingAnime) {
        // Create new anime entry
        const newAnime = new Anime({
          malId: animeData.id,
          title: animeData.title,
          titleEnglish: animeData.alternative_titles?.en,
          titleJapanese: animeData.alternative_titles?.ja,
          synopsis: animeData.synopsis,
          poster: animeData.main_picture?.large || animeData.main_picture?.medium,
          type: animeData.media_type,
          status: animeData.status,
          startDate: animeData.start_date,
          endDate: animeData.end_date,
          genres: animeData.genres?.map(g => g.name) || [],
          studios: animeData.studios?.map(s => s.name) || [],
          source: animeData.source,
          rating: animeData.rating,
          popularity: animeData.popularity,
          rank: item.ranking?.rank,
          numEpisodes: animeData.num_episodes,
        });
        
        await newAnime.save();
        syncedAnime++;
        
        // Now sync episodes for this anime using Jikan API
        try {
          // Add delay to respect Jikan rate limits (1 request per second)
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const jikanEpisodes = await jikanService.getAnimeEpisodes(animeData.id);
          
          for (const ep of jikanEpisodes.slice(0, 25)) { // Limit to first 25 episodes
            const newEpisode = new Episode({
              anime: newAnime._id,
              number: ep.mal_id || ep.episode,
              title: ep.title || `Episode ${ep.mal_id || ep.episode}`,
              synopsis: ep.synopsis || '',
              airDate: ep.aired ? new Date(ep.aired) : null,
              duration: ep.duration || null,
            });
            
            await newEpisode.save();
            newAnime.episodes.push(newEpisode._id);
            syncedEpisodes++;
          }
          
          await newAnime.save();
          console.log(`Synced ${jikanEpisodes.length} episodes for ${newAnime.title}`);
          
        } catch (episodeError) {
          console.error(`Error syncing episodes for ${animeData.title}:`, episodeError);
          // Continue with next anime even if episodes fail
        }
      }
    }
    
    res.json({ 
      message: `Sync complete: ${syncedAnime} anime, ${syncedEpisodes} episodes`,
      anime: syncedAnime,
      episodes: syncedEpisodes,
      total: malData.data.length 
    });
  } catch (error) {
    console.error('MAL sync error:', error);
    res.status(500).json({ message: 'Failed to sync with MAL', error: error.message });
  }
};


// backend/controllers/animeController.js (UPDATE)
exports.getAnimeList = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, sort = 'rating' } = req.query; // Default to rating

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
      rating: { averageRating: -1, mean: -1 }, // Descending by rating
      rank: { rank: 1 },
      title: { title: 1 },
      popularity: { popularity: 1 },
      newest: { createdAt: -1 },
    };

    const anime = await Anime.find(query)
      .sort(sortOptions[sort] || sortOptions.rating)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('episodes') // Include episodes
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
      .populate('episodes') // Include all episodes
      .populate('userRatings.user', 'name avatar');

    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }

    res.json(anime);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// backend/controllers/animeController.js
exports.syncAllEpisodes = async (req, res) => {
  try {
    const animeList = await Anime.find({ 
      malId: { $exists: true, $ne: null },
      episodes: { $size: 0 } // Only sync anime without episodes
    }).limit(20); // Process 20 anime at a time
    
    let totalSynced = 0;
    
    for (const anime of animeList) {
      try {
        // Rate limiting: 1 request per second
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const jikanEpisodes = await jikanService.getAnimeEpisodes(anime.malId);
        
        for (const ep of jikanEpisodes.slice(0, 50)) { // Limit episodes
          const existingEpisode = await Episode.findOne({ 
            anime: anime._id, 
            number: ep.mal_id || ep.episode
          });

          if (!existingEpisode) {
            const newEpisode = new Episode({
              anime: anime._id,
              number: ep.mal_id || ep.episode,
              title: ep.title || `Episode ${ep.mal_id || ep.episode}`,
              synopsis: ep.synopsis || '',
              airDate: ep.aired ? new Date(ep.aired) : null,
              duration: ep.duration || null,
            });

            await newEpisode.save();
            anime.episodes.push(newEpisode._id);
            totalSynced++;
          }
        }
        
        await anime.save();
        console.log(`Synced episodes for ${anime.title}`);
        
      } catch (error) {
        console.error(`Error syncing episodes for ${anime.title}:`, error);
        continue; // Skip this anime and continue with next
      }
    }

    res.json({ 
      message: `Synced ${totalSynced} episodes across ${animeList.length} anime`,
      episodes: totalSynced,
      animeProcessed: animeList.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error syncing episodes', error: error.message });
  }
};


// // Auto-sync episodes for all anime (admin function)
// exports.syncAllEpisodes = async (req, res) => {
//   try {
//     const animeList = await Anime.find({ malId: { $exists: true, $ne: null } });
//     let totalSynced = 0;

//     for (const anime of animeList) {
//       try {
//         const jikanEpisodes = await jikanService.getAnimeEpisodes(anime.malId);
        
//         for (const ep of jikanEpisodes.slice(0, 50)) { // Limit to first 50 episodes
//           const existingEpisode = await Episode.findOne({ 
//             anime: anime._id, 
//             number: ep.mal_id 
//           });

//           if (!existingEpisode) {
//             const newEpisode = new Episode({
//               anime: anime._id,
//               number: ep.mal_id,
//               title: ep.title || `Episode ${ep.mal_id}`,
//               synopsis: ep.synopsis || '',
//               airDate: ep.aired ? new Date(ep.aired) : null,
//             });

//             await newEpisode.save();
//             anime.episodes.push(newEpisode._id);
//             totalSynced++;
//           }
//         }
        
//         await anime.save();
        
//         // Rate limiting to avoid hitting Jikan API limits
//         await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
//       } catch (error) {
//         console.error(`Error syncing episodes for ${anime.title}:`, error);
//       }
//     }

//     res.json({ message: `Synced ${totalSynced} episodes across all anime` });
//   } catch (error) {
//     res.status(500).json({ message: 'Error syncing episodes', error: error.message });
//   }
// };


exports.syncEpisodesFromJikan = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);
    if (!anime || !anime.malId) {
      return res.status(404).json({ message: 'Anime not found or missing MAL ID' });
    }

    const jikanEpisodes = await jikanService.getAnimeEpisodes(anime.malId);
    let count = 0;

    for (const ep of jikanEpisodes) {
      const exists = await Episode.findOne({ anime: anime._id, number: ep.mal_id });
      if (!exists) {
        const newEp = new Episode({
          anime: anime._id,
          number: ep.mal_id,
          title: ep.title || `Episode ${ep.mal_id}`,
          synopsis: ep.synopsis,
          airDate: ep.aired ? new Date(ep.aired) : undefined,
          duration: ep.duration,
        });
        await newEp.save();
        anime.episodes.push(newEp._id);
        count++;
      }
    }
    await anime.save();
    res.json({ message: `Synced ${count} episodes`, total: count });
  } catch (error) {
    res.status(500).json({ message: 'Error syncing episodes', error: error.message });
  }
};