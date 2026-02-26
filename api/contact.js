// api/contact.js
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI not set');
}

let cached = global._mongoCache || (global._mongoCache = { conn: null, promise: null });

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'name, email and message are required' });
    }

    const doc = await Contact.create({ name, email, message });

    console.log('✅ Saved contact:', doc._id);

    return res.status(201).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('❌ /api/contact error:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
};