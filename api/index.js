const app = require("express")();
require("dotenv").config(); //npm install dotenv
const port = process.env.PORT || 4444;

app.use(require("express").urlencoded({ extended: true }));
app.use(require("express").json());
console.log(process.env.MONGO);

async function connectingToDB() {
  try {
    await require("mongoose").set('debug',true).connect(process.env.MONGO);
    console.log("Connected to the DB ✅");
  } catch (error) {
    console.log("ERROR: Your DB is not running, start it up ☢️", error);
  }
}
connectingToDB();

//==========================================================================
app.use(require("cors")());
//==========================================================================
app.use("/api/users", require("./routes/userRoute.js"));
app.use("/api/games", require("./routes/gameRoute.js"));
//==========================================================================
app.listen(port, "0.0.0.0", () =>
  console.log("🚀 Listening on port: " + port + " 🚀"),
);
