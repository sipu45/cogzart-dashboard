require("dns").setServers(["8.8.8.8", "1.1.1.1"]); 

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Puzzle = require("./models/Puzzle");
const Order = require("./models/Order");

dotenv.config();

const samplePuzzles = [
  {
    name: "Taj Mahal Sunrise",
    size: "12 inch",
    price: 799,
    stock: 25,
    difficulty: "hard",
    category: "Monuments",
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400",
  },
  {
    name: "Kerala Backwaters",
    size: "10 inch",
    price: 599,
    stock: 18,
    difficulty: "medium",
    category: "Nature",
    imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400",
  },
  {
    name: "Rangoli Mandala",
    size: "8 inch",
    price: 399,
    stock: 40,
    difficulty: "easy",
    category: "Art",
    imageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400",
  },
  {
    name: "Mysore Palace Night",
    size: "16 inch",
    price: 1299,
    stock: 8,
    difficulty: "hard",
    category: "Monuments",
    imageUrl: "https://images.unsplash.com/photo-1600076800235-bd68dfc98e2c?w=400",
  },
  {
    name: "Tiger in the Wild",
    size: "12 inch",
    price: 899,
    stock: 0,
    difficulty: "hard",
    category: "Wildlife",
    imageUrl: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400",
  },
  {
    name: "Holi Festival Colors",
    size: "10 inch",
    price: 649,
    stock: 3,
    difficulty: "medium",
    category: "Festivals",
    imageUrl: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=400",
  },
  {
    name: "Varanasi Ghats",
    size: "6 inch",
    price: 299,
    stock: 55,
    difficulty: "easy",
    category: "Monuments",
    imageUrl: "https://images.unsplash.com/photo-1561095124-5deecc23b0e1?w=400",
  },
  {
    name: "Peacock Dance",
    size: "8 inch",
    price: 449,
    stock: 2,
    difficulty: "medium",
    category: "Wildlife",
    imageUrl: "https://images.unsplash.com/photo-1612990049094-49e25e2e7c1e?w=400",
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    await Puzzle.deleteMany({});
    await Order.deleteMany({});
    console.log("Cleared existing data");

    const createdPuzzles = await Puzzle.insertMany(samplePuzzles);
    console.log(`Inserted ${createdPuzzles.length} puzzles`);

    const sampleOrders = [
      {
        customerName: "Ramesh Kumar",
        puzzleId: createdPuzzles[0]._id,
        quantity: 2,
        totalPrice: createdPuzzles[0].price * 2,
        status: "delivered",
      },
      {
        customerName: "Priya Sharma",
        puzzleId: createdPuzzles[1]._id,
        quantity: 1,
        totalPrice: createdPuzzles[1].price,
        status: "shipped",
      },
      {
        customerName: "Anita Patel",
        puzzleId: createdPuzzles[2]._id,
        quantity: 3,
        totalPrice: createdPuzzles[2].price * 3,
        status: "pending",
      },
      {
        customerName: "Vikram Singh",
        puzzleId: createdPuzzles[3]._id,
        quantity: 1,
        totalPrice: createdPuzzles[3].price,
        status: "pending",
      },
    ];

    await Order.insertMany(sampleOrders);
    console.log(`Inserted ${sampleOrders.length} orders`);
    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();