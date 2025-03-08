// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

mongoose.connect(process.env.CONNECT_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Middleware to parse JSON data
app.use(bodyParser.json());

// Define a basic route
app.get('/', (req, res) => {
  res.send('Welcome to my custom Node.js backend!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});