const mongoose = require("mongoose");

const puzzleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Puzzle name is required"],
      trim: true,
    },
    size: {
      type: String,
      required: [true, "Size is required"],
      enum: ["6 inch", "8 inch", "10 inch", "12 inch", "16 inch"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    difficulty: {
      type: String,
      required: [true, "Difficulty is required"],
      enum: ["easy", "medium", "hard"],
    },
    imageUrl: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Puzzle", puzzleSchema);
