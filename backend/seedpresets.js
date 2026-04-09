// ── Paste this AFTER your mongoose.connect() block in server.js ──

const seedPresets = async () => {
  try {
    const count = await Preset.countDocuments();
    if (count > 0) {
      console.log(`ℹ️  Presets already seeded (${count} found) — skipping.`);
      return;
    }

    const defaultPresets = [
      { name: "Moody Dark",   description: "Perfect for night photos",       price: 10, category: "Night",      image: "https://picsum.photos/200/150?random=5" },
      { name: "Bright Clean", description: "Great for portraits",             price: 12, category: "Portrait",   image: "https://picsum.photos/200/150?random=6" },
      { name: "Moody",        description: "Perfect for night photos",        price: 10, category: "Night",      image: "https://picsum.photos/200/150?random=1" },
      { name: "Bright",       description: "Great for portraits",             price: 12, category: "Portrait",   image: "https://picsum.photos/200/150?random=2" },
      { name: "Dark",         description: "Perfect for night photos",        price: 10, category: "Night",      image: "https://picsum.photos/200/150?random=3" },
      { name: "Clean",        description: "Great for portraits",             price: 12, category: "Portrait",   image: "https://picsum.photos/200/150?random=4" },
      { name: "Golden Hour",  description: "Warm tones for golden hour",      price: 15, category: "Cinematic",  image: "https://picsum.photos/200/150?random=7" },
      { name: "Film Fade",    description: "Classic faded film look",         price: 18, category: "Cinematic",  image: "https://picsum.photos/200/150?random=8" },
      { name: "Ivory Edit",   description: "Bright airy look for portraits",  price: 14, category: "Portrait",   image: "https://picsum.photos/200/150?random=9" },
    ];

    await Preset.insertMany(defaultPresets);
    console.log(`✅ Seeded ${defaultPresets.length} default presets into MongoDB.`);
  } catch (err) {
    console.error("❌ Seeding error:", err);
  }
};