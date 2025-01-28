const express = require('express');
const axios = require('axios'); // For HTTP requests
const crypto = require('crypto'); // For HMAC verification
const jwt = require('jsonwebtoken');
const router = express.Router();

// Shopify OAuth configuration
const shopifyAuthConfig = {
  redirectUri: 'http://localhost:3001/auth/shopify/callback',
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecret: process.env.SHOPIFY_API_SECRET,
  scopes: ['read_products', 'write_products', 'read_orders'],
};

// Redirect to Shopify OAuth
router.get('/auth/shopify', (req, res) => {
  const { shop } = req.query;

  if (!shop) return res.status(400).send('Shop parameter is required');

  const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${shopifyAuthConfig.apiKey}&scope=${shopifyAuthConfig.scopes.join(',')}&redirect_uri=${shopifyAuthConfig.redirectUri}`;
  res.redirect(authUrl);
});

// Shopify OAuth callback
router.get('/auth/shopify/callback', async (req, res) => {
  const { code, hmac, shop } = req.query;

  // Validate required parameters
  if (!code || !shop || !hmac) {
    return res.status(400).send('Missing required parameters');
  }

  // Validate HMAC
  const verifyHmac = (params, secret) => {
    const { hmac, ...rest } = params;
    const message = Object.keys(rest)
      .sort()
      .map(key => `${key}=${rest[key]}`)
      .join('&');

    const generatedHmac = crypto
      .createHmac('sha256', secret)
      .update(message)
      .digest('hex');

    return hmac === generatedHmac;
  };

  if (!verifyHmac(req.query, shopifyAuthConfig.apiSecret)) {
    return res.status(400).send('HMAC verification failed');
  }

  try {
    // Exchange code for access token
    const response = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: shopifyAuthConfig.apiKey,
      client_secret: shopifyAuthConfig.apiSecret,
      code,
    });

    const accessToken = response.data.access_token;

    // Set a session cookie
    res.cookie('shopifySession', 'some-session-value', {
      httpOnly: true,
      secure: true, // Required for SameSite=None
      sameSite: 'None', // Allows cookies in cross-origin iframes
    });

    // Generate JWT for the user
    const token = jwt.sign({ shop, accessToken }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Redirect to the frontend with the token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error('Error exchanging token:', error.response?.data || error.message);
    res.status(500).send('Authentication failed');
  }
});

module.exports = router;
