// server.js
require("dotenv").config();

const express  = require("express");
const cors     = require("cors");
const bcrypt   = require("bcrypt");
const jwt      = require("jsonwebtoken");
const multer   = require("multer");
const path     = require("path");
const fs       = require("fs");
const mongoose = require("mongoose");

// ── Models ──
const User   = require("./models/User");
const Preset = require("./models/preset");
const Order  = require("./models/Order");

const app = express();

const PORT       = process.env.PORT       || 5000;
const SECRET_KEY = process.env.SECRET_KEY || "mysecretkey";
const MONGO_URI  = process.env.MONGODB_URI || "mongodb://localhost:27017/preset-app";

app.use(cors());
app.use(express.json());

// ── Serve uploaded files ──
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Create upload folders ──
["uploads/presets", "uploads/images"].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

/* ================================
   CONNECT TO MONGODB
================================ */

mongoose
const seedPresets = async () => {
  try {
    const count = await Preset.countDocuments();
    if (count > 0) {
      console.log(`ℹ️  Presets already seeded (${count} found) — skipping.`);
      return;
    }

    const defaultPresets = [
      { name: "Moody Dark",   description: "Perfect for night photos",      price: 10, category: "Night",     image: "https://picsum.photos/200/150?random=5" },
      { name: "Bright Clean", description: "Great for portraits",            price: 12, category: "Portrait",  image: "https://picsum.photos/200/150?random=6" },
      { name: "Moody",        description: "Perfect for night photos",       price: 10, category: "Night",     image: "https://picsum.photos/200/150?random=1" },
      { name: "Bright",       description: "Great for portraits",            price: 12, category: "Portrait",  image: "https://picsum.photos/200/150?random=2" },
      { name: "Dark",         description: "Perfect for night photos",       price: 10, category: "Night",     image: "https://picsum.photos/200/150?random=3" },
      { name: "Clean",        description: "Great for portraits",            price: 12, category: "Portrait",  image: "https://picsum.photos/200/150?random=4" },
      { name: "Golden Hour",  description: "Warm tones for golden hour",     price: 15, category: "Cinematic", image: "https://picsum.photos/200/150?random=7" },
      { name: "Film Fade",    description: "Classic faded film look",        price: 18, category: "Cinematic", image: "https://picsum.photos/200/150?random=8" },
      { name: "Ivory Edit",   description: "Bright airy look for portraits", price: 14, category: "Portrait",  image: "https://picsum.photos/200/150?random=9" },
    ];

    await Preset.insertMany(defaultPresets);
    console.log(`✅ Seeded ${defaultPresets.length} default presets into MongoDB.`);
  } catch (err) {
    console.error("❌ Seeding error:", err);
  }
};
  mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");
    await seedPresets(); // ← runs seed after connecting
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));

/* ================================
   MULTER CONFIG
================================ */

const presetFileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "presetFile") cb(null, "uploads/presets");
    else if (file.fieldname === "image")  cb(null, "uploads/images");
    else cb(new Error("Unknown field"), null);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "presetFile") {
    const allowed = [".xmp", ".lrtemplate", ".dng", ".zip"];
    const ext = path.extname(file.originalname).toLowerCase();
    allowed.includes(ext) ? cb(null, true) : cb(new Error("Invalid preset file type"), false);
  } else if (file.fieldname === "image") {
    const allowed = [".jpg", ".jpeg", ".png", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();
    allowed.includes(ext) ? cb(null, true) : cb(new Error("Invalid image type"), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: presetFileStorage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

/* ================================
   AUTH MIDDLEWARE
================================ */

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
}

/* ================================
   AUTH ROUTES
================================ */

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      isAdmin: email === process.env.ADMIN_EMAIL,
    });

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { id: user._id, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   PRESET ROUTES
================================ */

// GET all presets — public
app.get("/presets", async (req, res) => {
  try {
    const presets = await Preset.find().select("-presetFile").sort({ createdAt: -1 });
    res.json(presets);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET preset by ID — public
app.get("/presets/:id", async (req, res) => {
  try {
    const preset = await Preset.findById(req.params.id).select("-presetFile");
    if (!preset) return res.status(404).json({ message: "Preset not found" });
    res.json(preset);
  } catch (err) {
    res.status(404).json({ message: "Preset not found" });
  }
});

// ADD preset — admin only
app.post(
  "/presets",
  authenticateToken,
  requireAdmin,
  upload.fields([{ name: "presetFile", maxCount: 1 }, { name: "image", maxCount: 1 }]),
  async (req, res) => {
    try {
      const { name, description, price, category } = req.body;
      const presetFilePath = req.files?.presetFile?.[0]?.filename || null;
      const imageFilePath  = req.files?.image?.[0]?.filename || null;
      const fileType = req.files?.presetFile?.[0]
        ? path.extname(req.files.presetFile[0].originalname).toLowerCase()
        : null;
      const imageUrl = imageFilePath
        ? `http://localhost:${PORT}/uploads/images/${imageFilePath}`
        : req.body.image || null;

      const newPreset = await Preset.create({
        name, description,
        price: Number(price),
        category,
        image: imageUrl,
        presetFile: presetFilePath,
        fileType,
        uploadedBy: req.user.id,
      });

      const { presetFile, ...safe } = newPreset.toObject();
      res.json(safe);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// UPDATE preset — admin only
app.patch(
  "/presets/:id",
  authenticateToken,
  requireAdmin,
  upload.fields([{ name: "presetFile", maxCount: 1 }, { name: "image", maxCount: 1 }]),
  async (req, res) => {
    try {
      const preset = await Preset.findById(req.params.id);
      if (!preset) return res.status(404).json({ message: "Preset not found" });

      const presetFilePath = req.files?.presetFile?.[0]?.filename || preset.presetFile;
      const imageFilePath  = req.files?.image?.[0]?.filename;
      const fileType = req.files?.presetFile?.[0]
        ? path.extname(req.files.presetFile[0].originalname).toLowerCase()
        : preset.fileType;
      const imageUrl = imageFilePath
        ? `http://localhost:${PORT}/uploads/images/${imageFilePath}`
        : req.body.image || preset.image;

      const updated = await Preset.findByIdAndUpdate(
        req.params.id,
        {
          name:        req.body.name        || preset.name,
          description: req.body.description || preset.description,
          price:       Number(req.body.price || preset.price),
          category:    req.body.category    || preset.category,
          image:       imageUrl,
          presetFile:  presetFilePath,
          fileType,
        },
        { new: true }
      ).select("-presetFile");

      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// DELETE preset — admin only
app.delete("/presets/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const preset = await Preset.findById(req.params.id);
    if (!preset) return res.status(404).json({ message: "Preset not found" });

    // Delete file from disk
    if (preset.presetFile) {
      const filePath = path.join(__dirname, "uploads/presets", preset.presetFile);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Preset.findByIdAndDelete(req.params.id);
    res.json({ message: "Preset deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DOWNLOAD preset file — must be logged in
app.get("/presets/:id/download", authenticateToken, async (req, res) => {
  try {
    const preset = await Preset.findById(req.params.id);
    if (!preset)            return res.status(404).json({ message: "Preset not found" });
    if (!preset.presetFile) return res.status(404).json({ message: "No file attached" });

    const filePath = path.join(__dirname, "uploads/presets", preset.presetFile);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found on server" });

    res.download(filePath, `${preset.name}${preset.fileType}`);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   ORDER ROUTES
================================ */

// CREATE order (after checkout)
app.post("/orders", authenticateToken, async (req, res) => {
  try {
    const { items } = req.body; // items = [{ presetId, name, price, qty }]

    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    const order = await Order.create({
      user: req.user.id,
      presets: items.map(item => ({
        preset: item.presetId,
        name:   item.name,
        price:  item.price,
        qty:    item.qty,
      })),
      total,
      status: "paid",
    });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET user's orders (purchase history)
app.get("/orders/my", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("presets.preset", "name image fileType")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   START SERVER
================================ */

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});