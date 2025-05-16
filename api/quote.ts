import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    const quoteResponse = await axios.get('https://api.quotable.io/random');
    response.status(200).json(quoteResponse.data);
  } catch (error) {
    console.error('Error fetching quote:', error);
    response.status(500).json({ error: 'Failed to fetch quote' });
  }
} 