import User from "../models/User.models.js";
import nodemailer from "nodemailer";

export const registerUser = async (req, res) => {
    const { name, age, location, familyContact, message } = req.body;
    try {
      const newUser = new User({ name, age, location, familyContact, message });
      await newUser.save();
      res.json({ message: "User data saved successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error saving user data." });
    }
};
  
export const sendAlerts = async (req, res) => {
    const { name, location, familyContact, message } = req.body;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS
      }
    });
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
};