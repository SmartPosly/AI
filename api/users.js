// Import the registrations from the register module
// Note: In serverless, this won't work across function calls
// This is a demonstration of the issue with serverless storage

// Serverless function for getting users
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
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

  // Handle GET request
  if (req.method === 'GET') {
    try {
      // In serverless environment, each function call is isolated
      // So we can't access registrations from the register function
      // Return empty array and let admin panel use localStorage
      console.log('Users API called - returning empty array due to serverless isolation');
      
      res.status(200).json({
        success: true,
        users: [],
        message: 'Serverless environment - data stored in localStorage',
        note: 'In production, this would connect to a database'
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ في جلب البيانات. يرجى المحاولة مرة أخرى.'
      });
    }
  } else if (req.method === 'POST') {
    // Handle POST request to receive user data from client
    try {
      const { users } = req.body;
      
      if (!Array.isArray(users)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid data format'
        });
      }
      
      console.log('Received user data from client:', users.length, 'users');
      
      // In a real application, you would save this to a database
      // For now, just acknowledge receipt
      res.status(200).json({
        success: true,
        message: 'Data received successfully',
        count: users.length
      });
    } catch (error) {
      console.error('Error processing user data:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ في معالجة البيانات.'
      });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`
    });
  }
};