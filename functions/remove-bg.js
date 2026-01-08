exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('Processing background removal request');
    
    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
    } catch (e) {
      console.error('Invalid JSON in request body:', e);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      };
    }

    const { apiKey, image } = parsedBody;

    if (!apiKey) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing apiKey' })
      };
    }

    if (!image) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing image data' })
      };
    }

    console.log('Calling Replicate API...');

    // Call Replicate API
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'f74986db0355b58403ed20963af156525e2891ea3c2d499bfbfb2a28cd87c5d7',
        input: {
          image: `data:image/png;base64,${image}`
        }
      })
    });

    const responseText = await response.text();
    console.log('Replicate API response status:', response.status);

    if (!response.ok) {
      console.error('Replicate API error:', responseText);
      let errorMessage = 'Failed to create prediction';
      
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.detail || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = responseText || errorMessage;
      }

      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: errorMessage })
      };
    }

    let prediction;
    try {
      prediction = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Replicate response:', e);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Invalid response from Replicate API' })
      };
    }

    console.log('Prediction created:', prediction.id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ predictionId: prediction.id })
    };

  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
};
