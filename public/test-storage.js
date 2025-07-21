// Test function to check if localStorage is working properly
function testLocalStorage() {
  try {
    // Test writing to localStorage
    localStorage.setItem('test-key', 'test-value');
    
    // Test reading from localStorage
    const testValue = localStorage.getItem('test-key');
    
    // Check if the value was read correctly
    if (testValue === 'test-value') {
      console.log('✅ localStorage is working properly');
      return true;
    } else {
      console.error('❌ localStorage read/write test failed');
      return false;
    }
  } catch (error) {
    console.error('❌ localStorage test error:', error);
    return false;
  }
}

// Test function to manually add a test registration
function addTestRegistration() {
  try {
    // Get existing registrations or initialize empty array
    const existingData = JSON.parse(localStorage.getItem('registrations') || '[]');
    
    // Create test registration
    const testRegistration = {
      id: existingData.length > 0 ? Math.max(...existingData.map(item => item.id)) + 1 : 1,
      name: 'Test User',
      email: 'test@example.com',
      phone: '0911234567',
      experience: 'beginner',
      interests: ['prompting', 'coding'],
      hearAbout: 'Test',
      notes: 'This is a test registration',
      registrationDate: new Date().toISOString()
    };
    
    // Add to existing data
    existingData.push(testRegistration);
    
    // Save back to localStorage
    localStorage.setItem('registrations', JSON.stringify(existingData));
    
    // Clear any reset flag
    localStorage.removeItem('registrationsReset');
    
    console.log('✅ Test registration added successfully:', testRegistration);
    console.log('Total registrations:', existingData.length);
    return true;
  } catch (error) {
    console.error('❌ Error adding test registration:', error);
    return false;
  }
}

// Function to view all current registrations
function viewRegistrations() {
  try {
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    console.log('📋 Current registrations:', registrations);
    console.log('Total count:', registrations.length);
    return registrations;
  } catch (error) {
    console.error('❌ Error viewing registrations:', error);
    return [];
  }
}

// Make functions available globally
window.testLocalStorage = testLocalStorage;
window.addTestRegistration = addTestRegistration;
window.viewRegistrations = viewRegistrations;

console.log('Storage test utilities loaded. Use the following functions in the console:');
console.log('- testLocalStorage(): Test if localStorage is working');
console.log('- addTestRegistration(): Add a test registration');
console.log('- viewRegistrations(): View all current registrations');