const jwt = require("jsonwebtoken");

// Hardcoded admin credentials (as per assessment requirement)
const ADMIN_EMAIL = "admin@cogzart.com";
const ADMIN_PASSWORD = "admin123";

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken({ email, role: "admin" });

  res.json({
    token,
    user: { email, role: "admin", name: "Admin" },
    message: "Login successful",
  });
};

// @desc    Verify token validity
// @route   GET /api/auth/verify
// @access  Private
const verify = (req, res) => {
  res.json({ valid: true, user: req.user });
};

module.exports = { login, verify };
