require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
const path     = require("path");

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..'))); // ← serves frontend files

// ── MongoDB connection (reads MONGO_URI from .env) ────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// ── Schema ────────────────────────────────────────────────────────
const veggieSchema = new mongoose.Schema({
  name:  String,
  price: Number,
  unit:  String,
  stock: { type: Boolean, default: false }
});

const Veggie = mongoose.model("Veggie", veggieSchema);

// ── GET all veggies ───────────────────────────────────────────────
app.get("/api/veggies", async (req, res) => {
  try {
    const veggies = await Veggie.find();
    res.json(veggies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST add veggie ───────────────────────────────────────────────
app.post("/api/veggies", async (req, res) => {
  try {
    const { name, price, unit } = req.body;
    const veggie = new Veggie({ name, price: Number(price), unit });
    const saved  = await veggie.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── PATCH toggle stock ────────────────────────────────────────────
app.patch("/api/veggies/:id/stock", async (req, res) => {
  try {
    const veggie = await Veggie.findById(req.params.id);
    if (!veggie) return res.status(404).json({ message: "Not found" });
    veggie.stock = !veggie.stock;
    await veggie.save();
    res.json(veggie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE veggie ─────────────────────────────────────────────────
app.delete("/api/veggies/:id", async (req, res) => {
  try {
    await Veggie.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));