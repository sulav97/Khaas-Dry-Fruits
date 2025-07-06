const Booking = require("../models/Booking");

const createBooking = async (req, res) => {
  try {
    const { dryfruit, quantity, totalPrice, address, phone, weight, pricePerGram } = req.body;
    const booking = await Booking.create({
      user: req.user,
      dryfruit,
      quantity,
      totalPrice,
      weight,
      pricePerGram,
      address,
      phone
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    let userId = req.user._id;
    if (req.user.isAdmin && req.query.userId) {
      userId = req.query.userId;
    }
    const bookings = await Booking.find({ user: userId }).populate("dryfruit");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: "Admin access required" });
    const bookings = await Booking.find().populate("user dryfruit");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: "Admin access required" });
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user dryfruit");
    if (!booking) return res.status(404).json({ msg: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus
};
