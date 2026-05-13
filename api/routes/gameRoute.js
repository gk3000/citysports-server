const router = require("express").Router();
const controller = require("../controllers/gameController");

router.post("/addgame", controller.addgame);
router.patch("/editgame/:id", controller.editgame);
router.delete("/removegame/:id", controller.removegame);
router.get("/getgame/:id", controller.getgame);
router.get("/getgames", controller.getgames);

module.exports = router;
