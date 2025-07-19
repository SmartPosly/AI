// Serverless function for registration
module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle POST request
  if (req.method === 'POST') {
    try {
      // In a real application, you would save this data to a database
      // For now, we'll just return a success response
      res.status(201).json({ 
        success: true, 
        message: 'تم التسجيل بنجاح',
        user: req.body 
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