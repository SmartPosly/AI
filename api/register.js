const fs = require('fs');
const path = require('path');

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
      const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
      
      // Read existing users
      let users = [];
      if (fs.existsSync(usersFilePath)) {
        const usersData = fs.readFileSync(usersFilePath, 'utf8');
        users = JSON.parse(usersData);
      }
      
      // Create new user with auto-generated ID and format phone number
      let formattedPhone = req.body.phone;
      
      // Remove any existing country code and format consistently
      if (formattedPhone.startsWith('+218')) {
        // If it already has +218, ensure there's a space after it
        formattedPhone = formattedPhone.replace(/^\+218\s?/, '+218 ');
      } else if (formattedPhone.startsWith('218')) {
        // If it starts with 218, add the + and space
        formattedPhone = '+218 ' + formattedPhone.substring(3).trim();
      } else {
        // If it's just the local number, add +218 prefix
        formattedPhone = '+218 ' + formattedPhone;
      }
        
      const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        ...req.body,
        phone: formattedPhone,
        registrationDate: new Date().toISOString()
      };
      
      // Add new user to the array
      users.push(newUser);
      
      // Save back to file
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
      
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