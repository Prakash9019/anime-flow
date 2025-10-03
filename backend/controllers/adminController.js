// controllers/adminController.js
const Anime = require('../models/Anime');
const Episode = require('../models/Episode');
const csv = require('csv-parser');
const fs = require('fs');

exports.createAnime = async (req, res) => {
  const anime = new Anime({ ...req.body, createdBy: req.user._id });
  await anime.save();
  res.json(anime);
};

exports.updateAnime = async (req, res) => {
  const anime = await Anime.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(anime);
};

exports.deleteAnime = async (req, res) => {
  await Anime.findByIdAndDelete(req.params.id);
  res.json({ message: 'Anime deleted' });
};

exports.addEpisode = async (req, res) => {
  const episode = new Episode({ ...req.body, anime: req.params.id });
  await episode.save();
  res.json(episode);
};

exports.updateEpisode = async (req, res) => {
  const ep = await Episode.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(ep);
};

exports.bulkUpload = async (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      for (const row of results) {
        await Anime.create(row);
      }
      res.json({ message: 'Bulk upload complete', count: results.length });
    });
};

exports.createEmployee = async (req, res) => {
  const User = require('../models/User');
  const emp = new User({ ...req.body, password: Math.random().toString(36).slice(-8) });
  await emp.save();
  res.json(emp);
};
