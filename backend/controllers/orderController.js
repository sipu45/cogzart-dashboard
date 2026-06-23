const Order = require("../models/Order");
const Puzzle = require("../models/Puzzle");

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("puzzleId", "name size price imageUrl")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { customerName, puzzleId, quantity } = req.body;

    // Validate puzzle exists and has enough stock
    const puzzle = await Puzzle.findById(puzzleId);
    if (!puzzle) {
      return res.status(404).json({ message: "Puzzle not found" });
    }

    if (puzzle.stock < quantity) {
      return res.status(400).json({
        message: `Insufficient stock. Available: ${puzzle.stock}`,
      });
    }

    // Auto-calculate total price
    const totalPrice = puzzle.price * quantity;

    // Create order
    const order = await Order.create({
      customerName,
      puzzleId,
      quantity,
      totalPrice,
      status: "pending",
    });

    // Deduct stock
    await Puzzle.findByIdAndUpdate(puzzleId, { $inc: { stock: -quantity } });

    const populatedOrder = await order.populate("puzzleId", "name size price imageUrl");

    res.status(201).json(populatedOrder);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate("puzzleId", "name size price imageUrl");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order", error: error.message });
  }
};

// @desc    Get order stats for dashboard
// @route   GET /api/orders/stats
// @access  Private
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const byStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      byStatus,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order stats", error: error.message });
  }
};

module.exports = { getOrders, createOrder, updateOrderStatus, getOrderStats };
