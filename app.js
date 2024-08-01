const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
console.log('MongoDB URI:', process.env.MONGODB_URI.replace(/\/\/.*@/, '//<credentials>@'));
// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files from the "public" directory

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
    console.log('Received email:', email);
    try {
      console.log('Attempting to create email in database');
      const newEmail = await Email.create({ email });
      console.log('Email added successfully:', newEmail);
      res.status(201).json({ message: 'Email added to the waiting list!' });
    } catch (error) {
      console.error('Error adding email:', error);
      if (error.code === 11000) {
        res.status(400).json({ message: 'This email is already on the waiting list.' });
      } else {
        res.status(500).json({ message: 'An error occurred while adding the email.' });
      }
    }
  });



// Serve index.html for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = app; // Ensure app is exported for Vercel
