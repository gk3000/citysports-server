const Users = require("../models/userModel");
const bcrypt = require("bcryptjs"); // https://github.com/dcodeIO/bcrypt.js#readme //npm install bcryptjs
const validator = require("validator"); //npm install validator
const jwt_secret = process.env.JWT_SECRET;
//console.log("JWT SECRET:", jwt_secret);
const jwt = require("jsonwebtoken"); //npm install jsonwebtoken

const register = async (req, res) => {
  const { username, email, password, passwordConfirmation } = req.body;
  const existingEmail = await Users.findOne({ email: email.toLowerCase() });
  const existingUsername = await Users.findOne({ username: username });
  if (existingEmail) {
    return res.status(400).json({ ok: false, message: "Email already registered" }); //400: Bad request
  }
  if (existingUsername) {
    return res.status(400).json({ ok: false, message: "Username already taken" });
  }
  if (!username || !email || !password || !passwordConfirmation) {
    return res.status(400).json({ ok: false, message: "All fields required" });
  }
  if (password.length < 8) {
    return res.status(400).json({
      ok: false,
      message: "Password must have at least 8 characters.",
    });
  }
  if (password !== passwordConfirmation) {
    return res.status(400).json({ ok: false, message: "Passwords must match" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ ok: false, message: "Invalid Email" });
  }
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = {
      username: username,
      email: email.toLowerCase(),
      password: hash,
    };
    console.log(newUser);
    await Users.create(newUser);
    res.status(201).json({ ok: true, message: "Successfully registered" }); //201: created
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message }); //500: Internal server error
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ ok: false, message: "All fields are required" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ ok: false, message: "Invalid Email" });
  }
  try {
    const user = await Users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ ok: false, message: "Invalid user provided" });
    }
    const match = bcrypt.compareSync(password, user.password);
    if (match) {
      //jwt_secret is a private key to verify the token on the server
      const token = jwt.sign({ userEmail: user.email }, jwt_secret, {
        expiresIn: "1h",
      });
      res.status(200).json({ ok: true, message: "Welcome back", token, email }); //200: OK
    } else {
      return res.status(400).json({ ok: false, message: "Invalid data provided" });
    }
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
};

const token = async (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, jwt_secret, (err, succ) => {
    err
      ? res.status(401).json({ ok: false, message: "Token is corrupted" }) //401: Unauthorized
      : res.status(200).json({ ok: true, succ });
  });
};

module.exports = {
  register,
  login,
  token,
};
