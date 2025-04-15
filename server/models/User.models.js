const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  location: String,
  familyContact: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

module.exports = User;