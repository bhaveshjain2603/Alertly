import User from "../models/User.models.js";
import nodemailer from "nodemailer";

export const registerUser = async (req, res) => {
    const { name, age, userEmail, location, familyContact, message } = req.body;
    try {
      const newUser = new User({ name, age, userEmail, location, familyContact, message });
      await newUser.save();
      res.json({ message: "User data saved successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error saving user data." });
    }
};
  
export const sendAlerts = async (req, res) => {
    const { name, userEmail, location, familyContact, message } = req.body;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS
      }
    });
    try {
      await transporter.sendMail({
        from: `"Alertly App" <${process.env.SMTP_EMAIL}>`, // Authenticated sender
        to: familyContact,
        replyTo: userEmail, // 👈 Add this
        subject: "🚨 Emergency Alert 🚨",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: red;">Emergency Alert of ${name} 🚨</h2>
            <p><strong>${name}</strong> has triggered an emergency alert.</p>
            <p><strong>Location:</strong> <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}" style="color: #1a73e8;" target="_blank">${location}</a></p>
            ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
            <p style="color: gray;">Please check on them immediately.</p>
          </div>
        `
      });
      res.json({ message: "Emergency alert sent to family members!" });
    } catch (error) {
      res.status(500).json({ message: "Error sending alert." });
    }
};