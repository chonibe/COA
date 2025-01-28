require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const authRoutes = require('./routes/auth');

// Initialize Express app first
const app = express();
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Apply routes after app initialization
app.use('/', authRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Basic health check endpoint
app.get('/', (req, res) => {
  res.send('Backend is running');
});