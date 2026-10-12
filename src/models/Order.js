const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  items: [{
    menuItemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 }
  }],
  deliveryAddress: {
    line1: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, default: "" }
  },
  subtotal: { type: Number, required: true, min: 0 },
  deliveryFee: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, enum: ["cash", "online"], default: "cash" },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
  status: {
    type: String,
    enum: ["placed", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"],
    default: "placed"
  },
  notes: { type: String, maxlength: 500, default: "" }
}, { timestamps: true });

orderSchema.index({ customer: 1, createdAt: -1 });
module.exports = mongoose.model("Order", orderSchema);
