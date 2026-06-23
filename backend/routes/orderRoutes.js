const express = require("express");
const router = express.Router();
const {
  getOrders,
  createOrder,
  updateOrderStatus,
  getOrderStats,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

// All routes protected
router.use(protect);

router.get("/stats", getOrderStats);
router.route("/").get(getOrders).post(createOrder);
router.put("/:id", updateOrderStatus);

module.exports = router;
