const axios = require('axios');

// Base URL (update this to your deployed URL)
const BASE_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}`
  : 'https://quote-inspiration.vercel.app';

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // For POST requests (frame action button clicks)
    if (req.method === 'POST') {
      const { untrustedData } = req.body;
      const buttonIndex = untrustedData?.buttonIndex || 1;

      // Get a new quote
      const quoteResponse = await axios.get(`${BASE_URL}/api/quote`, {
        timeout: 5000,
        headers: { 'Accept': 'application/json' }
      });
      
      const { content: text, author } = quoteResponse.data;

      // Generate image URL for the current quote
      const imageUrl = `${BASE_URL}/api/quote-image?text=${encodeURIComponent(text)}&author=${encodeURIComponent(author)}`;

      // Return frame response based on button clicked
      if (buttonIndex === 1) {
        // New Quote button - just show a new quote
        return res.status(200).json({
          frames: {
            version: 'vNext',
            image: imageUrl,
            buttons: [
              { label: '🔄 New Quote', action: 'post' },
              { label: '➕ Add App', action: 'post' },
              { label: '📢 Share', action: 'post' }
            ],
            ogImage: imageUrl
          }
        });
      } else if (buttonIndex === 2) {
        // Add App button - redirect to Warpcast app page
        return res.status(200).json({
          frames: {
            version: 'vNext',
            image: imageUrl,
            buttons: [
              { label: '🔄 New Quote', action: 'post' },
              { label: '➕ Add App', action: 'post' },
              { label: '📢 Share', action: 'post' }
            ],
            ogImage: imageUrl,
            action: {
              type: 'warpcast_tab',
              url: 'https://warpcast.com/~/mini-apps?app=quote-inspiration'
            }
          }
        });
      } else if (buttonIndex === 3) {
        // Share button - return a shareable quote with text
        return res.status(200).json({
          frames: {
            version: 'vNext',
            image: imageUrl,
            buttons: [
              { label: '🔄 New Quote', action: 'post' },
              { label: '➕ Add App', action: 'post' },
              { label: '📢 Share', action: 'post' }
            ],
            ogImage: imageUrl,
            action: {
              type: 'post',
              text: `"${text}"\n\n- ${author}\n\n✨ Generated with Quote Inspiration by @blazee\n\nhttps://quote-inspiration.vercel.app`
            }
          }
        });
      }
    } 
    
    // Initial GET request (when frame is first loaded)
    const quoteResponse = await axios.get(`${BASE_URL}/api/quote`, {
      timeout: 5000,
      headers: { 'Accept': 'application/json' }
    });
    
    const { content: text, author } = quoteResponse.data;
    
    // Generate image URL for the current quote
    const imageUrl = `${BASE_URL}/api/quote-image?text=${encodeURIComponent(text)}&author=${encodeURIComponent(author)}`;

    // Return the initial frame
    return res.status(200).json({
      frames: {
        version: 'vNext',
        image: imageUrl,
        buttons: [
          { label: '🔄 New Quote', action: 'post' },
          { label: '➕ Add App', action: 'post' },
          { label: '📢 Share', action: 'post' }
        ],
        ogImage: imageUrl
      }
    });
  } catch (error) {
    console.error('Frame API error:', error);
    
    // Return a fallback frame with error message
    return res.status(200).json({
      frames: {
        version: 'vNext',
        image: `${BASE_URL}/error-image.png`,
        buttons: [
          { label: 'Try Again', action: 'post' }
        ]
      }
    });
  }
}; 