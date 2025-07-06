const express = require("express");
const router = express.Router();
const dryfruitController = require("../controllers/dryfruitController");

const auth = require("../middleware/authMiddleware");

router.get("/", dryfruitController.getAllDryfruits);
router.get("/:id", dryfruitController.getDryfruitById);
router.post("/", auth, dryfruitController.createDryfruit);
router.put("/:id", auth, dryfruitController.updateDryfruit);
router.delete("/:id", auth, dryfruitController.deleteDryfruit);
router.get("/name/:name", dryfruitController.getDryfruitByName);

module.exports = router;
