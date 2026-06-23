const Puzzle = require("../models/Puzzle");

// @desc    Get all puzzles (with search & filter)
// @route   GET /api/puzzles
// @access  Private
const getPuzzles = async (req, res) => {
  try {
    const { search, difficulty, inStock } = req.query;
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (difficulty && difficulty !== "all") {
      query.difficulty = difficulty;
    }

    if (inStock === "true") {
      query.stock = { $gt: 0 };
    } else if (inStock === "false") {
      query.stock = 0;
    }

    const puzzles = await Puzzle.find(query).sort({ createdAt: -1 });
    res.json(puzzles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch puzzles", error: error.message });
  }
};

// @desc    Get single puzzle
// @route   GET /api/puzzles/:id
// @access  Private
const getPuzzleById = async (req, res) => {
  try {
    const puzzle = await Puzzle.findById(req.params.id);
    if (!puzzle) {
      return res.status(404).json({ message: "Puzzle not found" });
    }
    res.json(puzzle);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch puzzle", error: error.message });
  }
};

// @desc    Create puzzle
// @route   POST /api/puzzles
// @access  Private
const createPuzzle = async (req, res) => {
  try {
    const { name, size, price, stock, difficulty, imageUrl, category } = req.body;

    const puzzle = await Puzzle.create({
      name,
      size,
      price,
      stock,
      difficulty,
      imageUrl,
      category,
    });

    res.status(201).json(puzzle);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Failed to create puzzle", error: error.message });
  }
};

// @desc    Update puzzle
// @route   PUT /api/puzzles/:id
// @access  Private
const updatePuzzle = async (req, res) => {
  try {
    const puzzle = await Puzzle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!puzzle) {
      return res.status(404).json({ message: "Puzzle not found" });
    }

    res.json(puzzle);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Failed to update puzzle", error: error.message });
  }
};

// @desc    Delete puzzle
// @route   DELETE /api/puzzles/:id
// @access  Private
const deletePuzzle = async (req, res) => {
  try {
    const puzzle = await Puzzle.findByIdAndDelete(req.params.id);
    if (!puzzle) {
      return res.status(404).json({ message: "Puzzle not found" });
    }
    res.json({ message: "Puzzle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete puzzle", error: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/puzzles/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const totalPuzzles = await Puzzle.countDocuments();
    const totalStock = await Puzzle.aggregate([
      { $group: { _id: null, total: { $sum: "$stock" } } },
    ]);
    const outOfStock = await Puzzle.countDocuments({ stock: 0 });
    const lowStock = await Puzzle.countDocuments({ stock: { $gt: 0, $lt: 5 } });

    res.json({
      totalPuzzles,
      totalStock: totalStock[0]?.total || 0,
      outOfStock,
      lowStock,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
};

module.exports = { getPuzzles, getPuzzleById, createPuzzle, updatePuzzle, deletePuzzle, getStats };
