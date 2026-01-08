# Person Background Remover

A web application that allows you to select a person from an image and remove the background using AI.

## Features

- 🎯 **Draw marquee selection** - Click and drag to select specific person
- ✂️ **AI background removal** - Uses BiRefNet model from Replicate
- 💾 **Download PNG** - Export as 32-bit PNG with transparent background
- 🔐 **User API key** - Users provide their own Replicate API key

## Deployment

### Option 1: Deploy to Netlify (Recommended)

1. Install Netlify CLI (if you haven't already):
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Deploy:
```bash
netlify deploy --prod
```

Or simply drag and drop the entire folder to [Netlify Drop](https://app.netlify.com/drop)

### Option 2: Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. For Vercel, you'll need to adjust the function paths. Rename the `netlify` folder to `api` and update the fetch URLs in `index.html`:
   - Change `/.netlify/functions/remove-bg` to `/api/remove-bg`
   - Change `/.netlify/functions/get-result` to `/api/get-result`

3. Deploy:
```bash
vercel --prod
```

## How to Use

1. Get your Replicate API key from [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)
2. Open the deployed web app
3. Enter your API key
4. Upload an image with one or more people
5. Draw a rectangle around the person you want to isolate
6. Click "Remove Background"
7. Download the result as a PNG

## Technical Details

- **Model**: BiRefNet (men1scus/birefnet:f74986db...)
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Backend**: Netlify/Vercel Serverless Functions
- **API**: Replicate API

## Troubleshooting

### Common Issues

**400 Bad Request Error**
- Make sure you've entered a valid Replicate API key
- Check that you've selected an area on the image
- Verify your API key has credits available

**404 Function Not Found**
- Ensure the `netlify` folder with functions is deployed
- Check that `netlify.toml` is in the root directory
- Try redeploying: `netlify deploy --prod`

**CORS Errors**
- Don't open `index.html` directly in browser (file://)
- Must be deployed to Netlify/Vercel or run with `netlify dev`

### Testing Locally

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run locally (this will start serverless functions)
netlify dev
```

This will start a local server at `http://localhost:8888` with working serverless functions.

### Checking Logs

On Netlify, you can view function logs:
1. Go to your site dashboard
2. Click "Functions" tab
3. View logs for debugging

## Project Structure

```
.
├── index.html                    # Main web app
├── netlify.toml                  # Netlify configuration
├── netlify/
│   └── functions/
│       ├── remove-bg.js         # Create prediction endpoint
│       └── get-result.js        # Poll result endpoint
└── README.md
```

## Why Serverless Functions?

The Replicate API doesn't allow direct browser calls due to CORS restrictions. The serverless functions act as a secure proxy between the frontend and Replicate API.

## License

Free to use for personal and commercial projects.
