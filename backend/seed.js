// seed.js
const mongoose = require("mongoose");
const Preset = require("./server").Preset; // import the model
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Seeding DB...");
    const presets = [
      { name: "Moody Dark", description: "Perfect for night photos", price: 10, category: "Night", image: "https://picsum.photos/200/150?random=1" },
      { name: "Bright Clean", description: "Great for portraits", price: 12, category: "Portrait", image: "https://picsum.photos/200/150?random=2" },
      { name: "Vintage Warm", description: "Soft warm tones", price: 15, category: "Vintage", image: "https://picsum.photos/200/150?random=3" },
    ];
    await Preset.insertMany(presets);
    console.log("DB seeded ✅");
    mongoose.connection.close();
  });
