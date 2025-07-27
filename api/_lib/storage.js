// EMERGENCY FIX: localStorage-based storage for Vercel compatibility
const fs = require('fs');
const path = require('path');

// Development: Use file system
// Production: Return empty array (data is in browser localStorage)
function getUsers() {
  try {
    // Only works in development
    const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
    if (fs.existsSync(usersFilePath)) {
      const usersData = fs.readFileSync(usersFilePath, 'utf8');
      return JSON.parse(usersData);
    }
  } catch (error) {
    // Serverless environment - data is in browser localStorage
  }
  
  // In production, admin panel reads from localStorage directly
  return [];
}

// Add user - format and return for localStorage saving
function addUser(userData) {
  // Format phone number
  let formattedPhone = userData.phone;
  if (formattedPhone.startsWith('+218')) {
    formattedPhone = formattedPhone.replace(/^\+218\s?/, '+218 ');
  } else if (formattedPhone.startsWith('218')) {
    formattedPhone = '+218 ' + formattedPhone.substring(3).trim();
  } else {
    formattedPhone = '+218 ' + formattedPhone;
  }
  
  // Get existing users for ID generation
  const existingUsers = getUsers();
  
  // Create new user
  const newUser = {
    id: existingUsers.length > 0 ? Math.max(...existingUsers.map(u => u.id)) + 1 : 1,
    ...userData,
    phone: formattedPhone,
    registrationDate: new Date().toISOString()
  };
  
  // Try to save to file system (development only)
  try {
    const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
    const updatedUsers = [...existingUsers, newUser];
    fs.writeFileSync(usersFilePath, JSON.stringify(updatedUsers, null, 2));
  } catch (error) {
    // Serverless - file system not writable
    // Data will be saved to localStorage by the frontend
  }
  
  return newUser;
}

module.exports = {
  getUsers,
  addUser
};