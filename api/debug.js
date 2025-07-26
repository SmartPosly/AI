// Debug endpoint for Vercel deployment
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const fs = require('fs');
    const path = require('path');
    
    // Check environment
    const debugInfo = {
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      platform: process.platform,
      cwd: process.cwd(),
      environment: process.env.NODE_ENV || 'unknown',
      vercel: !!process.env.VERCEL,
      method: req.method,
      url: req.url,
      headers: req.headers
    };
    
    // Check if data directory exists
    try {
      const dataPath = path.join(process.cwd(), 'data');
      debugInfo.dataDirectoryExists = fs.existsSync(dataPath);
      
      if (debugInfo.dataDirectoryExists) {
        const usersPath = path.join(dataPath, 'users.json');
        debugInfo.usersFileExists = fs.existsSync(usersPath);
        
        if (debugInfo.usersFileExists) {
          const stats = fs.statSync(usersPath);
          debugInfo.usersFileSize = stats.size;
          debugInfo.usersFileModified = stats.mtime;
        }
      }
    } catch (fsError) {
      debugInfo.fileSystemError = fsError.message;
    }
    
    res.status(200).json(debugInfo);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
}