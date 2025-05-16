import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Enable CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  try {
    const quoteResponse = await axios.get('https://api.quotable.io/random', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Quote Inspiration App/1.0'
      }
    });
    
    if (!quoteResponse.data || !quoteResponse.data.content || !quoteResponse.data.author) {
      throw new Error('Invalid response format from Quotable API');
    }

    response.status(200).json(quoteResponse.data);
  } catch (error) {
    console.error('Detailed error:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      return response.status(500).json({
        error: 'Failed to fetch quote',
        details: error.response?.data || error.message,
        status: error.response?.status
      });
    }

    response.status(500).json({
      error: 'Failed to fetch quote',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 