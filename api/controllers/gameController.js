const Games = require("../models/gameModel");

const addgame = async (req, res) => {
  const {
    title,
    description,
    city,
    location,
    sport,
    max_players,
    min_players,
    owner,
    joined_players,
    date,
    time,
    free_entry,
    cost,
  } = req.body;
  try {
    const newgame = {
      title: title,
      description: description,
      city: city,
      location: location,
      sport: sport,
      sport_img: sport,
      max_players: max_players,
      min_players: min_players,
      owner: owner,
      joined_players: joined_players,
      date: date,
      time: time,
      status: "scheduled",
      free_entry: free_entry,
      cost: cost,
    };
    const created = await Games.create(newgame);
    res.status(201).json({ ok: true, data: created }); //201: created
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message }); //500: Internal server error
  }
};

const editgame = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    city,
    location,
    sport,
    max_players,
    min_players,
    joined_players,
    date,
    time,
    status,
    free_entry,
    cost,
  } = req.body;
  try {
    const game_edited = {
      title: title,
      description: description,
      city: city,
      location: location,
      sport: sport,
      sport_img: sport,
      max_players: max_players,
      min_players: min_players,
      joined_players: joined_players,
      date: date,
      time: time,
      status: status,
      free_entry: free_entry,
      cost: cost,
    };
    const edited = await Games.findByIdAndUpdate(id, game_edited, {
      new: true,
    });
    if (!edited) {
      res.status(404).json({ ok: false, data: edited }); //404: Not found
    } else {
      res.status(200).json({ ok: true, data: edited }); //200: OK
    }
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message }); //500: Internal server error
  }
};

const removegame = async (req, res) => {
  const { id } = req.params;
  try {
    const removed = await Games.findByIdAndDelete(id);
    if (!removed) {
      res.status(404).json({ ok: false, data: removed }); //404: Not found
    } else {
      res.status(200).json({ ok: true, data: removed }); //200: OK
    }
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message }); //500: Internal server error
  }
};

module.exports = {
  addgame,
  editgame,
  removegame,
};
