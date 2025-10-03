// backend/routes/anime.js
const express = require('express');
const animeController = require('../controllers/animeController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', animeController.getAnimeList);
router.get('/:id', animeController.getAnimeById);
router.post('/rate', auth, animeController.rateAnime);
router.post('/rate-episode', auth, animeController.rateEpisode);
router.post('/sync-mal', animeController.syncWithMAL);

module.exports = router;
