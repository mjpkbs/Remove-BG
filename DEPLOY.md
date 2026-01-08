# 🚀 Quick Deployment Checklist

## Files to Deploy
Make sure all these files are in your deployment:

```
your-project/
├── index.html              ✓ Main web app
├── favicon.svg             ✓ Site icon
├── netlify.toml           ✓ Configuration
├── package.json           ✓ Project info
├── README.md              ✓ Documentation
└── netlify/
    └── functions/
        ├── remove-bg.js   ✓ Background removal API
        └── get-result.js  ✓ Result polling API
```

## Deployment Steps

### Option 1: Netlify Drop (Easiest!)
1. ✅ Download all files
2. ✅ Go to https://app.netlify.com/drop
3. ✅ Drag and drop the entire folder
4. ✅ Wait for deployment
5. ✅ Get your live URL!

### Option 2: Netlify CLI
```bash
# Install CLI (one time)
npm install -g netlify-cli

# Login (one time)
netlify login

# Deploy
cd your-project-folder
netlify deploy --prod
```

### Option 3: GitHub + Netlify
1. ✅ Create a new GitHub repository
2. ✅ Push all files to GitHub
3. ✅ Go to Netlify dashboard
4. ✅ Click "New site from Git"
5. ✅ Connect your repository
6. ✅ Netlify will auto-detect settings from `netlify.toml`

## After Deployment

1. ✅ Get your Replicate API key: https://replicate.com/account/api-tokens
2. ✅ Open your deployed site
3. ✅ Test with an image

## Testing Locally

```bash
# Run with Netlify Dev (functions will work!)
netlify dev
```

Opens at: http://localhost:8888

## Common Issues Fixed ✅

- ✅ CORS errors → Fixed with serverless functions
- ✅ 404 favicon → Added favicon.svg
- ✅ 400 errors → Better error handling in functions
- ✅ JSON parsing errors → Improved error responses

## Need Help?

Check the full README.md for detailed troubleshooting steps!
