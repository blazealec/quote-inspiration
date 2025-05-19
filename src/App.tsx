import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { sdk } from '@farcaster/frame-sdk';
import axios from 'axios';

// Curated list of beautiful background images
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

interface ContainerProps {
  backgroundImage: string;
}

const Header = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  z-index: 10;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`;

const Attribution = styled.span`
  font-size: 14px;
  opacity: 0.9;
`;

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(54, 54, 54, 0.8) 100%);
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('${props => props.backgroundImage}');
    background-size: cover;
    background-position: center;
    z-index: -1;
    filter: blur(3px);
    transform: scale(1.1);
    transition: background-image 0.5s ease-in-out;
  }
`;

const QuoteCard = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  position: relative;
  z-index: 1;
`;

const Quote = styled.p`
  font-size: 24px;
  line-height: 1.5;
  margin-bottom: 20px;
  font-style: italic;
`;

const Author = styled.p`
  font-size: 18px;
  color: #b3b3b3;
`;

const Button = styled.button`
  background: linear-gradient(45deg, #FF6B6B 0%, #FFE66D 100%);
  border: none;
  border-radius: 25px;
  color: white;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  margin: 10px;
  transition: transform 0.2s, opacity 0.2s;
  opacity: ${props => props.disabled ? 0.7 : 1};

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

const AddAppPrompt = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  padding: 12px 20px;
  border-radius: 10px;
  z-index: 100;
  display: flex;
  align-items: center;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.5s ease-out;

  @keyframes slideUp {
    from {
      transform: translate(-50%, 100px);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }
`;

const PromptText = styled.span`
  font-size: 14px;
  margin-right: 15px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 20px;
  padding: 0 5px;
  position: absolute;
  right: 10px;
  top: 8px;
  
  &:hover {
    color: white;
  }
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  color: #FF6B6B;
  margin: 20px 0;
  padding: 10px;
  border-radius: 8px;
  background-color: rgba(255, 107, 107, 0.1);
`;

function App() {
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sharing, setSharing] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(backgroundImages[0]);
  const [showAddPrompt, setShowAddPrompt] = useState(false);

  const getRandomBackground = () => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    return backgroundImages[randomIndex];
  };

  const fetchQuote = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/quote', {
        timeout: 10000,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.data || !response.data.content || !response.data.author) {
        throw new Error('Invalid response format');
      }

      setQuote({
        text: response.data.content,
        author: response.data.author
      });
      // Change background when getting new quote
      setBackgroundImage(getRandomBackground());
    } catch (error) {
      console.error('Error fetching quote:', error);
      
      // Retry logic for network errors
      if (axios.isAxiosError(error) && !error.response) {
        console.log('Retrying...');
        return fetchQuote();
      }

      let errorMessage = 'Failed to fetch quote. Please try again.';
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.details) {
          errorMessage = `Error: ${error.response.data.details}`;
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out. Please try again.';
        } else if (!error.response) {
          errorMessage = 'Network error. Please check your connection.';
        }
      }
      setError(errorMessage);
    }
    setLoading(false);
  };

  const handleAddApp = async () => {
    try {
      await sdk.actions.addFrame();
      setShowAddPrompt(false);
    } catch (error) {
      console.error('Error adding frame:', error);
    }
  };

  useEffect(() => {
    // Initialize the SDK and hide splash screen
    const initApp = async () => {
      try {
        // Hide the splash screen
        await sdk.actions.ready();
        // Fetch the first quote
        await fetchQuote();
        
        // Show the add app prompt after a short delay
        setTimeout(() => {
          setShowAddPrompt(true);
        }, 2000);
      } catch (error) {
        console.error('Error initializing app:', error);
        setError('Failed to initialize app. Please try again.');
      }
    };
    
    void initApp();
  }, []);

  const handleShare = async () => {
    try {
      setSharing(true);
      
      // Get the base URL (similar to what we use in the API)
      const baseUrl = window.location.origin;
      
      // Create the quote image URL (this matches our API endpoint)
      const imageUrl = `${baseUrl}/api/quote-image?text=${encodeURIComponent(quote.text)}&author=${encodeURIComponent(quote.author)}`;
      
      // Share the quote with the image
      await sdk.actions.composeCast({
        text: `"${quote.text}"\n\n- ${quote.author}\n\n✨ Generated with Quote Inspiration by blazee`,
        embeds: [imageUrl]
      });
    } catch (error) {
      setError('Failed to share to Farcaster. Please try again.');
      console.error('Error sharing to Farcaster:', error);
    } finally {
      setSharing(false);
    }
  };

  return (
    <Container backgroundImage={backgroundImage}>
      <Header>
        <Title>Quote Inspiration</Title>
        <Attribution>by blazee</Attribution>
      </Header>
      <QuoteCard>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <>
            <ErrorMessage>{error}</ErrorMessage>
            <Button onClick={() => void fetchQuote()}>Try Again</Button>
          </>
        ) : (
          <>
            <Quote>"{quote.text}"</Quote>
            <Author>- {quote.author}</Author>
            <ButtonContainer>
              <Button onClick={() => void fetchQuote()} disabled={loading || sharing}>
                {loading ? 'Loading...' : 'New Quote'}
              </Button>
              <Button onClick={handleShare} disabled={loading || sharing}>
                {sharing ? 'Sharing...' : 'Share to Farcaster'}
              </Button>
              <Button onClick={handleAddApp} disabled={loading || sharing}>
                Add to Warpcast
              </Button>
            </ButtonContainer>
          </>
        )}
      </QuoteCard>
      
      {showAddPrompt && (
        <AddAppPrompt>
          <PromptText>📌 Add Quote Inspiration to your favorites for quick access!</PromptText>
          <Button onClick={handleAddApp}>Add App</Button>
          <CloseButton onClick={() => setShowAddPrompt(false)}>&times;</CloseButton>
        </AddAppPrompt>
      )}
    </Container>
  );
}

export default App;
