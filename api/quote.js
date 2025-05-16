const axios = require('axios');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = await axios.get('https://api.quotable.io/random');
    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching quote:', error);
    return res.status(500).json({
      error: 'Failed to fetch quote',
      message: error.message
    });
  }
}; 