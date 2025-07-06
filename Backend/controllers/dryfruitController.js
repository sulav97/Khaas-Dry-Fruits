const Dryfruit = require("../models/DryFruit");

exports.createDryfruit = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: "Admin access required" });
    const { name, description, pricePerGram, stock, image } = req.body;
    const dryfruit = await Dryfruit.create({ name, description, pricePerGram, stock, image });
    res.status(201).json(dryfruit);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllDryfruits = async (req, res) => {
  try {
    const dryfruits = await Dryfruit.find();
    res.json(dryfruits);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getDryfruitById = async (req, res) => {
  try {
    const dryfruit = await Dryfruit.findById(req.params.id);
    res.json(dryfruit);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateDryfruit = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: "Admin access required" });
    const { name, description, pricePerGram, stock, image } = req.body;
    const updatedData = { name, description, pricePerGram, stock, image };
    const updated = await Dryfruit.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteDryfruit = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: "Admin access required" });
    await Dryfruit.findByIdAndDelete(req.params.id);
    res.json({ msg: "Dryfruit deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getDryfruitByName = async (req, res) => {
  const { name } = req.params;
  const dryfruit = await Dryfruit.findOne({ name });
  if (!dryfruit) return res.status(404).json({ msg: "Dry fruit not found" });
  res.json(dryfruit);
};
