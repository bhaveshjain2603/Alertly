const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const app = express();

const User = require("./models/User.models.js");
const {connection} = require("./database/connection.js");

// Environment Variables
const dotenv = require("dotenv");
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello")
})

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error configuring transporter:", error);
  } else {
    console.log("Server is ready to send emails:", success);
  }
});

// API Routes
app.post("/api/users", async (req, res) => {
  const { name, age, location, familyContact, message } = req.body;
  try {
    const newUser = new User({ name, age, location, familyContact, message });
    await newUser.save();
    res.json({ message: "User data saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving user data." });
  }
});

app.post("/api/alert", async (req, res) => {
  const { name, location, familyContact, message } = req.body;
  try {
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: familyContact,
      subject: "Emergency Alert",
      text: `An emergency alert has been triggered by ${name}. \nCurrent location: ${location}. \nMessage: ${message}`
    });
    res.json({ message: "Emergency alert sent to family members!" });
  } catch (error) {
    res.status(500).json({ message: "Error sending alert." });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connection();
});