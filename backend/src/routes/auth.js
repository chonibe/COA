const express = require('express');
const router = express.Router();
const Shopify = require('shopify-api-node');
const jwt = require('jsonwebtoken');

// Shopify OAuth configuration
const shopifyAuthConfig = {
  shop: 'thestreetlamp-9103.myshopify.com', // Use your actual store name
  redirectUri: 'http://localhost:3001/auth/shopify/callback',
  apiKey: process.env.SHOPIFY_API_KEY,
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
  const { code, shop } = req.query;

  try {
    // Exchange temporary code for permanent access token
    const shopify = new Shopify({
      shopName: shop.replace('.myshopify.com', ''), // Remove '.myshopify.com'
      apiKey: shopifyAuthConfig.apiKey,
      accessToken: process.env.SHOPIFY_API_SECRET,
    });

    const accessToken = await shopify.accessToken.create(code);

    // Generate JWT for the user
    const token = jwt.sign({ shop, accessToken }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).send('Authentication failed');
  }
});

module.exports = router;