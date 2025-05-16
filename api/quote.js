const axios = require('axios');

const QUOTABLE_API = 'https://api.quotable.io/random';

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
    console.log('Fetching quote from:', QUOTABLE_API);
    
    const response = await axios.get(QUOTABLE_API, {
      timeout: 5000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Quote-Inspiration/1.0'
      }
    });

    console.log('Quote API response:', response.data);

    if (!response.data || !response.data.content || !response.data.author) {
      throw new Error('Invalid response format from Quotable API');
    }

    return res.status(200).json({
      content: response.data.content,
      author: response.data.author
    });
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    // Send a more detailed error response
    return res.status(500).json({
      error: 'Failed to fetch quote',
      details: error.response?.data || error.message,
      timestamp: new Date().toISOString()
    });
  }
}; 