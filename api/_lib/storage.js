// Simple storage utility for Vercel serverless functions
const fs = require('fs');
const path = require('path');

// In-memory storage as fallback
let memoryStorage = [];

// Try to read from file system (works in development)
function readUsersFromFile() {
  try {
    const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
    if (fs.existsSync(usersFilePath)) {
      const usersData = fs.readFileSync(usersFilePath, 'utf8');
      const users = JSON.parse(usersData);
      // Update memory storage with file data
      memoryStorage = users;
      return users;
    }
  } catch (error) {
    console.warn('Could not read from file system:', error.message);
  }
  return memoryStorage;
}

// Try to write to file system (works in development)
function writeUsersToFile(users) {
  try {
    const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.warn('Could not write to file system:', error.message);
    return false;
  }
}

// Get all users
function getUsers() {
  return readUsersFromFile();
}

// Add a new user
function addUser(userData) {
  const users = readUsersFromFile();
  
  // Format phone number
  let formattedPhone = userData.phone;
  if (formattedPhone.startsWith('+218')) {
    formattedPhone = formattedPhone.replace(/^\+218\s?/, '+218 ');
  } else if (formattedPhone.startsWith('218')) {
    formattedPhone = '+218 ' + formattedPhone.substring(3).trim();
  } else {
    formattedPhone = '+218 ' + formattedPhone;
  }
  
  // Create new user
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    ...userData,
    phone: formattedPhone,
    registrationDate: new Date().toISOString()
  };
  
  // Add to users array
  users.push(newUser);
  
  // Update memory storage
  memoryStorage = users;
  
  // Try to save to file (works in development)
  writeUsersToFile(users);
  
  return newUser;
}

// Initialize with existing data
readUsersFromFile();

// Export functions
module.exports = {
  getUsers,
  addUser
};