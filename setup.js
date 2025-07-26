const fs = require('fs');
const path = require('path');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  console.log('Creating data directory...');
  fs.mkdirSync(dataDir);
}

// Create users.json file with 50 mock users if it doesn't exist
const usersFilePath = path.join(dataDir, 'users.json');
if (!fs.existsSync(usersFilePath)) {
  console.log('Creating mock users data...');
  
  // Experience levels
  const experienceLevels = ['beginner', 'intermediate', 'advanced'];
  
  // Interest options
  const allInterests = ['prompting', 'n8n', 'coding', 'api'];
  
  // How did you hear about us options
  const hearAboutOptions = [
    'جوجل', 
    'تويتر', 
    'فيسبوك', 
    'إنستغرام', 
    'صديق', 
    'يوتيوب', 
    'لينكد إن',
    'إعلان'
  ];
  
  // Notes options
  const notesOptions = [
    '',
    'أريد معرفة المزيد عن الدورة وطرق الدفع المتاحة.',
    'هل يمكنني الحضور عن بعد؟',
    'هل هناك خصم للمجموعات؟',
    'أحتاج إلى معلومات إضافية عن المحتوى.',
    'هل سيتم تسجيل الدورة؟'
  ];
  
  // Generate 50 mock users
  const mockUsers = Array.from({ length: 50 }, (_, i) => {
    // Generate random registration date within the last 30 days
    const registrationDate = new Date();
    registrationDate.setDate(registrationDate.getDate() - Math.floor(Math.random() * 30));
    
    // Generate random interests (1-4)
    const interestCount = Math.floor(Math.random() * 4) + 1;
    const shuffledInterests = [...allInterests].sort(() => 0.5 - Math.random());
    const interests = shuffledInterests.slice(0, interestCount);
    
    return {
      id: i + 1,
      name: `مستخدم ${i + 1}`,
      email: `user${i + 1}@example.com`,
      phone: `+218 5${Math.floor(10000000 + Math.random() * 90000000)}`,
      experience: experienceLevels[Math.floor(Math.random() * experienceLevels.length)],
      interests,
      hearAbout: hearAboutOptions[Math.floor(Math.random() * hearAboutOptions.length)],
      notes: notesOptions[Math.floor(Math.random() * notesOptions.length)],
      registrationDate: registrationDate.toISOString()
    };
  });
  
  // Write to file
  fs.writeFileSync(usersFilePath, JSON.stringify(mockUsers, null, 2));
  console.log(`Created ${mockUsers.length} mock users in ${usersFilePath}`);
}

console.log('Setup complete! You can now run:');
console.log('- npm start (for React frontend)');
console.log('- node server.js (for Express backend)');