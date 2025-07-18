const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

// Data file path
const dataFilePath = path.join(__dirname, 'data', 'users.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Initialize users data file if it doesn't exist
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([]));
}

// Read users data
const getUsers = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users data:', error);
    return [];
  }
};

// Write users data
const saveUsers = (users) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving users data:', error);
    return false;
  }
};

// API Routes
// Get all users
app.get('/api/users', (req, res) => {
  const users = getUsers();
  res.json(users);
});

// Register a new user
app.post('/api/register', (req, res) => {
  try {
    const users = getUsers();
    const newUser = {
      id: users.length + 1,
      ...req.body,
      registrationDate: new Date().toISOString()
    };
    
    users.push(newUser);
    
    if (saveUsers(users)) {
      res.status(201).json({ success: true, user: newUser });
    } else {
      res.status(500).json({ success: false, message: 'Failed to save user data' });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Export users to Excel (API endpoint alternative)
app.get('/api/export', (req, res) => {
  try {
    const users = getUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Error exporting users:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Serve React app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});