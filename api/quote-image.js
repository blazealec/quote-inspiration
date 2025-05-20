const { Resvg } = require('@resvg/resvg-js');
const satori = require('satori');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { text, author } = req.query;
    
    // Input validation
    if (!text || !author) {
      return res.status(400).json({ 
        error: 'Missing required parameters', 
        details: 'Both "text" and "author" query parameters are required' 
      });
    }
    
    // Generate the SVG using Satori
    const svg = await generateQuoteImage(text, author);
    
    // Convert SVG to PNG for better compatibility
    const resvg = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: 1200
      }
    });
    
    const pngBuffer = resvg.render().asPng();
    
    // Set proper content type for PNG
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    
    return res.status(200).send(pngBuffer);
  } catch (error) {
    console.error('Error generating quote image:', error);
    return res.status(500).json({ 
      error: 'Failed to generate quote image', 
      details: error.message
    });
  }
};

async function generateQuoteImage(text, author) {
  // Define background images (same as in the app)
  const backgroundImages = [
    'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg',
    'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg',
    'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg',
    'https://images.pexels.com/photos/1835712/pexels-photo-1835712.jpeg',
    'https://images.pexels.com/photos/1906658/pexels-photo-1906658.jpeg',
    'https://images.pexels.com/photos/1287075/pexels-photo-1287075.jpeg',
    'https://images.pexels.com/photos/1774389/pexels-photo-1774389.jpeg',
    'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg',
    'https://images.pexels.com/photos/1831234/pexels-photo-1831234.jpeg'
  ];
  
  // Random background image
  const randomIndex = Math.floor(Math.random() * backgroundImages.length);
  const backgroundImage = backgroundImages[randomIndex];
  
  // Generate the svg using satori
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '40px 60px',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 0,
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '15px',
                padding: '30px',
                maxWidth: '600px',
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                zIndex: 1,
              },
              children: [
                {
                  type: 'p',
                  props: {
                    style: {
                      fontSize: '24px',
                      lineHeight: 1.5,
                      marginBottom: '20px',
                      fontStyle: 'italic',
                      color: 'white',
                    },
                    children: `"${text}"`,
                  },
                },
                {
                  type: 'p',
                  props: {
                    style: {
                      fontSize: '18px',
                      color: '#b3b3b3',
                    },
                    children: `- ${author}`,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: fs.readFileSync(path.join(process.cwd(), 'public', 'Inter-Regular.ttf')),
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: fs.readFileSync(path.join(process.cwd(), 'public', 'Inter-Bold.ttf')),
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );
  
  return svg;
} 