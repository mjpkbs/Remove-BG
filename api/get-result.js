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

    const { apiKey, predictionId } = parsedBody;

    if (!apiKey) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing apiKey' })
      };
    }

    if (!predictionId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing predictionId' })
      };
    }

    // Get prediction status from Replicate
    const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error('Replicate API error:', responseText);
      let errorMessage = 'Failed to get prediction';
      
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: prediction.status,
        output: prediction.output
      })
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
