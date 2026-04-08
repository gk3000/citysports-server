const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
  },
  location: {
    type: String,
  },
  birthday: {
    type: String,
  },
  sports: {
    type: Array,
  },
  teams: {
    type: Array,
  },
  games: {
    type: Array,
  },
  free_agent: {
    type: Boolean,
    default: false,
  },
  free_agent_time: {
    type: Array,
  },
  free_agent_sports: {
    type: Array,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const Users = mongoose.model("Users", userSchema);
module.exports = Users;
