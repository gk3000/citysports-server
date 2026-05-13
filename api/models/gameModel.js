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
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String, //scheduled, confirmed, cancelled, past
    required: true,
  },
  free_entry: {
    type: Boolean,
    required: true,
    default: false,
  },
  cost: {
    type: Number,
    required: true,
  },
  skilllevel: {
    type: String, //all levels, beginner, intermediate, advanced
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const Games = mongoose.model("Games", gameSchema);
module.exports = Games;
