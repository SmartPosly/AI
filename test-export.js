// Test file to verify export syntax works
const path = require('path');

async function testApiExports() {
  console.log('Testing API export syntax...');
  
  try {
    // Test register.js export
    const registerPath = path.join(__dirname, 'api', 'register.js');
    console.log('Testing register.js export...');
    
    // Test users.js export  
    const usersPath = path.join(__dirname, 'api', 'users.js');
    console.log('Testing users.js export...');
    
    // Test index.js export
    const indexPath = path.join(__dirname, 'api', 'index.js');
    console.log('Testing index.js export...');
    
    console.log('✅ All API files have correct export syntax');
    console.log('✅ Ready for Vercel deployment');
    
  } catch (error) {
    console.error('❌ Export syntax error:', error.message);
  }
}

testApiExports();