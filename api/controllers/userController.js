const Users = require("../models/userModel");
const bcrypt = require("bcryptjs"); // https://github.com/dcodeIO/bcrypt.js#readme //npm install bcryptjs
const validator = require("validator"); //npm install validator

const register = async (req, res) => {
  const { username, email, password } = req.body;
  const existingEmail = await Users.findOne({ email: email.toLowerCase() });
  const existingUsername = await Users.findOne({ username: username });
  if (existingEmail) {
    return res
      .status(400)
      .json({ ok: false, message: "Email already registered" }); //400: Bad request
  }
  if (existingUsername) {
    return res
      .status(400)
      .json({ ok: false, message: "Username already taken" }); //400: Bad request
  }
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = {
      username: username,
      email: email.toLowerCase(),
      password: hash,
    };
    //console.log(newUser);
    const created = await Users.create(newUser);
    res.status(201).json({ ok: true, data: created }); //201: created
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message }); //500: Internal server error
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ ok: false, message: "All fields are required" }); //400: Bad request
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ ok: false, message: "Invalid Email" }); //400: Bad request
  }
  try {
    const user = await Users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(400)
        .json({ ok: false, message: "Invalid user provided" }); //400: Bad request
    }
    const match = bcrypt.compareSync(password, user.password);
    if (match) {
      res.status(200).json({ ok: true, data: user }); //200: OK
    } else {
      return res
        .status(400)
        .json({ ok: false, message: "Invalid data provided" }); //400: Bad request
    }
  } catch (error) {
    res.status(500).json({ ok: false, error }); //500: Internal server error
  }
};

module.exports = {
  register,
  login,
};
