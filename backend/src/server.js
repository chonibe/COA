require('dotenv').config();
const express = require('express');
const session = require('express-session'); // For managing sessions
const { Pool } = require('pg');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

// Middleware to allow embedding in an iframe
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "frame-ancestors https://*.myshopify.com https://admin.shopify.com");
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  next();
});

// Enable session management with secure cookies
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: true, // Required for SameSite=None
      sameSite: 'None', // Allows cookies in cross-origin iframes
    },
  })
);

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Apply routes
app.use('/', authRoutes);

// Basic health check endpoint
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.get('/', (req, res) => {
  res.send('Backend is running on Heroku!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use((req, res) => {
  res.status(404).send('404: Route not found');
});
