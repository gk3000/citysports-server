const router = require("express").Router();
const controller = require("../controllers/userController");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.delete("/deleteaccount/:id", controller.deleteaccount);

module.exports = router;
