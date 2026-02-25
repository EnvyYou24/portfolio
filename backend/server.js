// backend/server.js
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Allow frontend requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define Schema for Contact Form
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// API Route to handle form submission
// Inside server.js
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // ADD THIS LINE:
    console.log("✅ Data Saved:", newContact); 

    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error("❌ Error saving:", error); // Add this too!
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});