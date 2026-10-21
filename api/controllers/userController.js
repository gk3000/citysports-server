const Users = require("../models/userModel");
const Games = require("../models/gameModel");
const bcrypt = require("bcryptjs"); // https://github.com/dcodeIO/bcrypt.js#readme //npm install bcryptjs
const validator = require("validator"); //npm install validator
const crypto = require("crypto");
const sendMail = require("../utils/sendMail");

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

function generateTempPassword(length = 10) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const bytes = crypto.randomBytes(length);
  let pw = "";
  for (let i = 0; i < length; i++) pw += chars[bytes[i] % chars.length];
  return pw;
}

const forgotpassword = async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    //console.log(email)
    if (!email) {
      return res.status(400).json({ message: "Set an email." });
    }

    const user = await Users.findOne({ email });
    const genericAnswer = {
      message:
        "A temporary password and instructions have been sent to the associated email",
    };

    if (!user) return res.json(genericAnswer);

    const tempPassword = generateTempPassword();
    user.password = await bcrypt.hash(tempPassword, 10);
    await user.save();

    //text: plain-text fallback, html: formatted version shown by most mail clients
    await sendMail({
      to: user.email,
      subject: "Your temporary password",
      text:
        `Here's your temporary password \n\n` +
        `Hello there, \n\n` +
        `Please use the temporary password below to log back in. \n\n` +
        `${tempPassword} \n\n` +
        `How to log back in \n\n` +
        `1. Open up the CitySports app and tap Log In \n\n` +
        `2. Enter your email and the temporary password above \n\n` +
        `3. You should be all set! \n\n` +
        `Once logged in you can update your password at any time by going into your profile settings.`,
      html: `
        <h2>Here's your temporary password</h2>
        <p>Hello there,</p>
        <p>Please use the temporary password below to log back in.</p>
        <p style="font-size:20px;font-color:grey;font-weight:bold;letter-spacing:2px">${tempPassword}</p>
        <h3>How to log back in</h3>
        <p>1. Open up the CitySports app and tap <b>Log In</b></p>
        <p>2. Enter your email and the temporary password above</p>
        <p>3. You should be all set!</p>
        <p>Once logged in you can update your password at any time by going into your profile settings.</p>
      `,
    });

    return res.json(genericAnswer);
  } catch (err) {
    console.error("resetPassword error:", err);
    return res
      .status(500) //500: Internal server error
      .json({ message: "Server error" });
  }
};

const loaduser = async (req, res) => {
  const { id } = req.params;
  try {
    const myuser = await Users.findById(id);
    if (!myuser) {
      res.status(404).json({ ok: false, message: "User not found" }); //404: Not found
    } else {
      res.status(200).json({ ok: true, data: myuser }); //200: OK
    }
  } catch (error) {
    res.status(500).json({ ok: false, error }); //500: Internal server error
  }
};

const edituser = async (req, res) => {
  const { id } = req.params;
  const { location, username, birthday, sports, password } = req.body;
  const update = {};
  if (location !== undefined) update.location = location;
  if (username !== undefined) update.username = username;
  if (birthday !== undefined) update.birthday = birthday;
  if (sports !== undefined) update.sports = sports;
  if (password) {
    const salt = bcrypt.genSaltSync(10);
    update.password = bcrypt.hashSync(password, salt);
  }
  try {
    const edited = await Users.findByIdAndUpdate(id, update, { new: true });
    if (!edited) {
      return res.status(404).json({ ok: false, data: edited }); //404: Not found
    }
    res.status(200).json({ ok: true, data: edited }); //200: OK
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message }); //500: Internal server error
  }
};

const deleteaccount = async (req, res) => {
  const { id } = req.params;
  try {
    //delete games of user before deleting user account
    const deletedgames = await Games.deleteMany({ owner: id });
    //console.log(deletedgames);
    const deleteduser = await Users.findByIdAndDelete(id);
    //console.log(deleteduser);
    if (!deleteduser) {
      res
        .status(404)
        .json({ ok: false, userdata: deleteduser, gamedata: deletedgames }); //404: Not found
    } else {
      res
        .status(200)
        .json({ ok: true, userdata: deleteduser, gamedata: deletedgames }); //200: OK
    }
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message }); //500: Internal server error
  }
};

module.exports = {
  register,
  login,
  forgotpassword,
  loaduser,
  edituser,
  deleteaccount,
};
