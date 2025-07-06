const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dryfruit: { type: mongoose.Schema.Types.ObjectId, ref: 'Dryfruit' },
  quantity: Number,
  totalPrice: Number,
  weight: Number,
  pricePerGram: Number,
  address: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
