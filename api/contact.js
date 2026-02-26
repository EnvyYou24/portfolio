const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => mongoose);
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

const Contact =
  mongoose.models.Contact || mongoose.model("Contact", contactSchema);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { name, email, message } = req.body;

    await Contact.create({ name, email, message });

    return res.status(201).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to send message" });
  }
};