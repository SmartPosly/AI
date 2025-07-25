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
      // EMERGENCY FIX: Inline user creation (no external storage module)
      const userData = req.body;
      
      // Format phone number
      let formattedPhone = userData.phone;
      if (formattedPhone.startsWith('+218')) {
        formattedPhone = formattedPhone.replace(/^\+218\s?/, '+218 ');
      } else if (formattedPhone.startsWith('218')) {
        formattedPhone = '+218 ' + formattedPhone.substring(3).trim();
      } else {
        formattedPhone = '+218 ' + formattedPhone;
      }
      
      // Create user with formatted data
      const newUser = {
        id: Date.now(), // Use timestamp as ID for uniqueness
        ...userData,
        phone: formattedPhone,
        registrationDate: new Date().toISOString()
      };
      
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