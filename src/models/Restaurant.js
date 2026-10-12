const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, default: "Main" },
  imageUrl: { type: String, default: "" },
  isAvailable: { type: Boolean, default: true },
  isVegetarian: { type: Boolean, default: false }
}, { _id: true });

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  cuisine: [{ type: String }],
  imageUrl: { type: String, default: "" },
  address: {
    line1: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, default: "" }
  },
  deliveryFee: { type: Number, default: 0, min: 0 },
  estimatedDeliveryMinutes: { type: Number, default: 35, min: 1 },
  isOpen: { type: Boolean, default: true },
  menu: [menuItemSchema]
}, { timestamps: true });

restaurantSchema.index({ name: "text", description: "text", cuisine: "text" });
module.exports = mongoose.model("Restaurant", restaurantSchema);
