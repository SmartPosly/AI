#!/bin/bash

# Ensure the build directory exists
node ensure-build.js

# Deploy to Vercel
echo "Deploying to Vercel..."
npx vercel --prod

echo "Deployment complete!"