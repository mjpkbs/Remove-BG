module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Getting prediction result');
    
    const { apiKey, predictionId } = req.body;

    if (!apiKey) {
      console.error('Missing API key');
      return res.status(400).json({ error: 'Missing apiKey' });
    }

    if (!predictionId) {
      console.error('Missing prediction ID');
      return res.status(400).json({ error: 'Missing predictionId' });
    }

    console.log('Fetching prediction:', predictionId);

    // Get prediction status from Replicate with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const responseText = await response.text();
      console.log('Replicate API response status:', response.status);

      if (!response.ok) {
        console.error('Replicate API error:', responseText.substring(0, 200));
        let errorMessage = 'Failed to get prediction';
        
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.detail || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = responseText.substring(0, 100) || errorMessage;
        }

        return res.status(response.status).json({ error: errorMessage });
      }

      let prediction;
      try {
        prediction = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse Replicate response:', e);
        return res.status(500).json({ error: 'Invalid response from Replicate API' });
      }

      console.log('Prediction status:', prediction.status);

      return res.status(200).json({
        status: prediction.status,
        output: prediction.output
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('Request timeout');
        return res.status(504).json({ error: 'Request timeout - please try again' });
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
