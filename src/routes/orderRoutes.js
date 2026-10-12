const router = require("express").Router();
const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const allowedStatuses = ["placed", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];

// Place an order. Prices are always calculated on the server from the restaurant menu.
router.post("/", protect, async (req, res, next) => {
  try {
    const { restaurantId, items, deliveryAddress, paymentMethod = "cash", notes = "" } = req.body;
    if (!restaurantId || !Array.isArray(items) || items.length === 0 || !deliveryAddress?.line1 || !deliveryAddress?.city) {
      return res.status(400).json({ message: "restaurantId, non-empty items, and deliveryAddress.line1/city are required." });
    }
    if (!["cash", "online"].includes(paymentMethod)) return res.status(400).json({ message: "paymentMethod must be cash or online." });
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found." });
    if (!restaurant.isOpen) return res.status(400).json({ message: "This restaurant is currently closed." });

    const orderItems = [];
    for (const requested of items) {
      const quantity = Number(requested.quantity);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
        return res.status(400).json({ message: "Each item quantity must be an integer between 1 and 50." });
      }
      const menuItem = restaurant.menu.id(requested.menuItemId);
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({ message: `Menu item ${requested.menuItemId} is unavailable.` });
      }
      const existing = orderItems.find(i => String(i.menuItemId) === String(menuItem._id));
      if (existing) existing.quantity += quantity;
      else orderItems.push({ menuItemId: menuItem._id, name: menuItem.name, quantity, unitPrice: menuItem.price });
    }
    const subtotal = Number(orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0).toFixed(2));
    const deliveryFee = restaurant.deliveryFee;
    const order = await Order.create({
      customer: req.user._id, restaurant: restaurant._id, items: orderItems,
      deliveryAddress, subtotal, deliveryFee, total: Number((subtotal + deliveryFee).toFixed(2)),
      paymentMethod, notes
    });
    res.status(201).json({ order });
  } catch (err) { next(err); }
});

// Customers see their own orders; admins can see all orders with ?status=placed.
router.get("/", protect, async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { customer: req.user._id };
    if (req.query.status && allowedStatuses.includes(req.query.status)) filter.status = req.query.status;
    const orders = await Order.find(filter)
      .populate("customer", "name email")
      .populate("restaurant", "name imageUrl address")
      .sort({ createdAt: -1 }).limit(100);
    res.json({ orders });
  } catch (err) { next(err); }
});

router.get("/:id", protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("customer", "name email").populate("restaurant", "name address");
    if (!order) return res.status(404).json({ message: "Order not found." });
    if (req.user.role !== "admin" && String(order.customer._id) !== String(req.user._id)) {
      return res.status(403).json({ message: "You cannot view this order." });
    }
    res.json({ order });
  } catch (err) { next(err); }
});

// Customer cancellation is only allowed before preparation. Admins can update the delivery lifecycle.
router.patch("/:id/status", protect, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!allowedStatuses.includes(status)) return res.status(400).json({ message: "Invalid order status." });
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    if (req.user.role === "admin") {
      order.status = status;
    } else {
      if (String(order.customer) !== String(req.user._id)) return res.status(403).json({ message: "You cannot update this order." });
      if (status !== "cancelled") return res.status(403).json({ message: "Customers may only cancel orders." });
      if (!["placed", "confirmed"].includes(order.status)) {
        return res.status(400).json({ message: "This order can no longer be cancelled." });
      }
      order.status = "cancelled";
    }
    await order.save();
    res.json({ order });
  } catch (err) { next(err); }
});

// Admin-only payment status update; integrate a payment provider before marking online payments paid.
router.patch("/:id/payment", protect, adminOnly, async (req, res, next) => {
  try {
    const allowed = ["pending", "paid", "failed", "refunded"];
    if (!allowed.includes(req.body.paymentStatus)) return res.status(400).json({ message: "Invalid paymentStatus." });
    const order = await Order.findByIdAndUpdate(req.params.id, { paymentStatus: req.body.paymentStatus }, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json({ order });
  } catch (err) { next(err); }
});

module.exports = router;
