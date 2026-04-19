const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  sport: {
    type: String,
    required: true,
  },
  sport_img: {
    type: String,
    required: true,
  },
  max_players: {
    type: Number,
    required: true,
  },
  min_players: {
    type: Number,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  joined_players: {
    type: Array,
    required: true,
  },
  datetime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const Games = mongoose.model("Games", userSchema);
module.exports = Games;
