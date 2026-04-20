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
const User    = require("./models/User");
const Preset  = require("./models/Preset");
const Order   = require("./models/Order");
const Message = require("./models/Message");
const Favorite = require("./models/Favorites");

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

const seedPresets = async () => {
  try {
    const count = await Preset.countDocuments();
    if (count > 0) {
      console.log(`ℹ️  Presets already seeded (${count} found) — skipping.`);
      return;
    }

    const defaultPresets = [
      { name: "Moody Dark",   description: "Perfect for night photos",      category: "Night",     image: "https://picsum.photos/200/150?random=5" },
      { name: "Bright Clean", description: "Great for portraits",            category: "Portrait",  image: "https://picsum.photos/200/150?random=6" },
      { name: "Moody",        description: "Perfect for night photos",       category: "Night",     image: "https://picsum.photos/200/150?random=1" },
      { name: "Bright",       description: "Great for portraits",            category: "Portrait",  image: "https://picsum.photos/200/150?random=2" },
      { name: "Dark",         description: "Perfect for night photos",       category: "Night",     image: "https://picsum.photos/200/150?random=3" },
      { name: "Clean",        description: "Great for portraits",            category: "Portrait",  image: "https://picsum.photos/200/150?random=4" },
      { name: "Golden Hour",  description: "Warm tones for golden hour",     category: "Cinematic", image: "https://picsum.photos/200/150?random=7" },
      { name: "Film Fade",    description: "Classic faded film look",        category: "Cinematic", image: "https://picsum.photos/200/150?random=8" },
      { name: "Ivory Edit",   description: "Bright airy look for portraits", category: "Portrait",  image: "https://picsum.photos/200/150?random=9" },
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
    await seedPresets();
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
   FAVORITES ROUTES - MOVED HERE (RIGHT AFTER MIDDLEWARE)
================================ */

// ── GET current user's favorites
app.get("/favorites/my", authenticateToken, async (req, res) => {
  try {
    console.log("🔍 Fetching favorites for user:", req.user.id);
    
    const favorites = await Favorite.find({ user: req.user.id })
      .populate({
        path: 'preset',
        select: 'name description category image fileType ratings',
        match: { _id: { $exists: true } }
      })
      .sort({ createdAt: -1 });

    const validFavorites = favorites
      .filter(fav => fav.preset !== null)
      .map(fav => ({
        ...fav.preset.toObject(),
        favoritedAt: fav.createdAt,
        _id: fav.preset._id
      }));

    console.log("✅ Found", validFavorites.length, "valid favorites");
    res.json(validFavorites);
    
  } catch (err) {
    console.error("❌ Favorites route error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── TOGGLE favorite (add/remove)
app.post("/favorites/toggle", authenticateToken, async (req, res) => {
  try {
    console.log("🔧 Toggle favorite request received");
    console.log("🔧 Request body:", req.body);
    console.log("🔧 Authenticated user:", req.user.id);
    
    const { presetId } = req.body;
    if (!presetId) {
      console.log("❌ No presetId provided");
      return res.status(400).json({ message: "Preset ID required" });
    }

    console.log("🔍 Looking for preset with ID:", presetId);
    const preset = await Preset.findById(presetId);
    if (!preset) {
      console.log("❌ Preset not found with ID:", presetId);
      return res.status(404).json({ message: "Preset not found" });
    }

    console.log("✅ Preset found:", preset.name);
    console.log("🔍 Checking for existing favorite...");

    const existing = await Favorite.findOne({ 
      user: req.user.id, 
      preset: presetId 
    });

    if (existing) {
      console.log("🗑️ Found existing favorite, removing it...");
      await Favorite.findByIdAndDelete(existing._id);
      console.log("✅ Favorite removed successfully");
      return res.json({ action: "removed" });
    } else {
      console.log("❤️ No existing favorite found, creating new one...");
      const newFav = await Favorite.create({
        user: req.user.id,
        preset: presetId
      });
      console.log("✅ Favorite created successfully:", newFav._id);
      return res.json({ action: "added", favorite: newFav });
    }
  } catch (err) {
    console.error("❌ Toggle favorite error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

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
      { expiresIn: "7d" }
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
    const presets = await Preset.find()
      .select("-presetFile")
      .sort({ createdAt: -1 });
    
    const presetsWithRatings = presets.map(p => p.toJSON());
    res.json(presetsWithRatings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET current user's profile — protected
app.get("/profile/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET preset by ID — public
app.get("/presets/:id", async (req, res) => {
  try {
    const preset = await Preset.findById(req.params.id).select("-presetFile");
    if (!preset) return res.status(404).json({ message: "Preset not found" });
    res.json(preset.toJSON());
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
      const { name, description, category } = req.body;
      const presetFilePath = req.files?.presetFile?.[0]?.filename || null;
      const imageFilePath  = req.files?.image?.[0]?.filename || null;
      const fileType = req.files?.presetFile?.[0]
        ? path.extname(req.files.presetFile[0].originalname).toLowerCase()
        : null;
      const imageUrl = imageFilePath
        ? `http://localhost:${PORT}/uploads/images/${imageFilePath}`
        : req.body.image || null;

      const newPreset = await Preset.create({
        name,
        description,
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
    if (!preset) return res.status(404).json({ message: "Preset not found" });
    if (!preset.presetFile) return res.status(404).json({ message: "No file attached" });

    const filePath = path.join(__dirname, "uploads/presets", preset.presetFile);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found on server" });

    res.download(filePath, `${preset.name}${preset.fileType}`);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ADMIN ONLY: Get most loved presets (aggregated)
app.get("/admin/analytics/favorites", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const topPresets = await Favorite.aggregate([
      { $group: { _id: "$preset", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "presets",
          localField: "_id",
          foreignField: "_id",
          as: "presetData"
        }
      },
      { $unwind: "$presetData" },
      {
        $project: {
          _id: 0,
          presetId: "$_id",
          name: "$presetData.name",
          image: "$presetData.image",
          category: "$presetData.category",
          loves: "$count"
        }
      }
    ]);

    res.json(topPresets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   RATING ROUTES
================================ */

// ── GET ratings for a preset
app.get("/presets/:id/ratings", async (req, res) => {
  try {
    const preset = await Preset.findById(req.params.id).select("ratings");
    if (!preset) return res.status(404).json({ message: "Preset not found" });

    res.json({
      ratings: preset.ratings,
      averageRating: preset.averageRating,
      ratingCount: preset.ratingCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── SUBMIT/UPDATE rating (authenticated)
app.post("/presets/:id/rate", authenticateToken, async (req, res) => {
  try {
    const { score, comment } = req.body;
    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ message: "Score must be between 1 and 5" });
    }

    const preset = await Preset.findById(req.params.id);
    if (!preset) return res.status(404).json({ message: "Preset not found" });

    const existingRatingIndex = preset.ratings.findIndex(r => r.userId.toString() === req.user.id);

    if (existingRatingIndex >= 0) {
      preset.ratings[existingRatingIndex].score = score;
      preset.ratings[existingRatingIndex].comment = comment?.trim() || '';
      preset.ratings[existingRatingIndex].createdAt = new Date();
    } else {
      preset.ratings.push({
        userId: req.user.id,
        score,
        comment: comment?.trim() || '',
      });
    }

    await preset.save();

    res.json({
      message: existingRatingIndex >= 0 ? "Rating updated" : "Rating submitted",
      averageRating: preset.averageRating,
      ratingCount: preset.ratingCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   ORDER/DOWNLOAD ROUTES
================================ */

// CREATE download record (no money involved)
app.post("/downloads", authenticateToken, async (req, res) => {
  try {
    const { items } = req.body;

    const download = await Order.create({
      user: req.user.id,
      presets: items.map(item => ({
        preset: item.presetId,
        name:   item.name,
        qty:    item.qty || 1,
      })),
      status: "completed",
    });

    res.json(download);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET user's downloads
app.get("/downloads/my", authenticateToken, async (req, res) => {
  try {
    const downloads = await Order.find({ user: req.user.id })
      .populate("presets.preset", "name image fileType")
      .sort({ createdAt: -1 });
    res.json(downloads);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET user's downloads (previously "orders")
app.get("/orders/my", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("presets.preset", "name image fileType")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error in /orders/my:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   ADMIN USER MANAGEMENT
================================ */

// GET all users
app.get("/admin/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Toggle user admin status
app.patch("/admin/users/:id/toggle-admin", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({ message: "User updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user
app.delete("/admin/users/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   CONTACT & MESSAGES
================================ */

// Submit message
app.post("/contact", authenticateToken, async (req, res) => {
  try {
    const { subject, body } = req.body;
    if (!subject || !body) {
      return res.status(400).json({ message: "Subject and body required" });
    }

    const newMessage = await Message.create({
      user: req.user.id,
      subject: subject.trim(),
      body: body.trim(),
    });

    res.json({ message: "Message sent successfully", id: newMessage._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all messages (admin)
app.get("/admin/messages", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("user", "email")
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark message as read
app.patch("/admin/messages/:id/read", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    message.isRead = true;
    await message.save();

    res.json({ message: "Message marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete message
app.delete("/admin/messages/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   START SERVER
================================ */

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});