const router = require("express").Router();
const Restaurant = require("../models/Restaurant");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public: browse/search restaurants. Use ?city=Pune&search=pizza&page=1&limit=12
router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));
    const filter = {};
    if (req.query.city) filter["address.city"] = new RegExp(String(req.query.city).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    if (req.query.search) filter.$text = { $search: String(req.query.search) };
    if (req.query.open === "true") filter.isOpen = true;
    const [restaurants, total] = await Promise.all([
      Restaurant.find(filter).select("-menu").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Restaurant.countDocuments(filter)
    ]);
    res.json({ restaurants, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found." });
    res.json({ restaurant });
  } catch (err) { next(err); }
});

// Admin: create/update/delete restaurants and their menus.
router.post("/", protect, adminOnly, async (req, res, next) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({ restaurant });
  } catch (err) { next(err); }
});

router.patch("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found." });
    res.json({ restaurant });
  } catch (err) { next(err); }
});

router.delete("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found." });
    res.json({ message: "Restaurant deleted." });
  } catch (err) { next(err); }
});

module.exports = router;
