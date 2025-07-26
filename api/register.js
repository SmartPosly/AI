// Serverless function for registration
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  // Add cache-busting headers
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle POST request
  if (req.method === 'POST') {
    try {
      const { addUser } = require('./_lib/storage');
      
      const newUser = addUser(req.body);
      
      res.status(201).json({ 
        success: true, 
        message: 'تم التسجيل بنجاح',
        user: newUser 
      });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ 
        success: false, 
        message: 'حدث خطأ في التسجيل. يرجى المحاولة مرة أخرى.' 
      });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ 
      success: false, 
      message: `Method ${req.method} Not Allowed` 
    });
  }
};