const express = require("express");
const router = express.Router();
const {
  getPuzzles,
  getPuzzleById,
  createPuzzle,
  updatePuzzle,
  deletePuzzle,
  getStats,
} = require("../controllers/puzzleController");
const { protect } = require("../middleware/authMiddleware");

// All routes protected
router.use(protect);

router.get("/stats", getStats);
router.route("/").get(getPuzzles).post(createPuzzle);
router.route("/:id").get(getPuzzleById).put(updatePuzzle).delete(deletePuzzle);

module.exports = router;
