const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));  // Serve static files from the "public" directory

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define a schema and model for the emails
const emailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
});
const Email = mongoose.model('Email', emailSchema);

// API route to handle form submissions
app.post('/api/waiting-list', async (req, res) => {
  const { email } = req.body;
  try {
    await Email.create({ email });
    res.status(201).json({ message: 'Email added to the waiting list!' });
  } catch (error) {
    res.status(400).json({ message: 'This email is already on the waiting list.' });
  }
});

// Serve index.html for the root path
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = app; // Ensure app is exported for Vercel
