// Serverless function for getting users
module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle GET request
  if (req.method === 'GET') {
    try {
      // In a real application, you would fetch this data from a database
      // For now, we'll just return mock data
      const mockUsers = Array.from({ length: 50 }, (_, i) => {
        // Generate random interests
        const allInterests = ['prompting', 'n8n', 'coding', 'api'];
        const interestCount = Math.floor(Math.random() * 4) + 1;
        const shuffledInterests = [...allInterests].sort(() => 0.5 - Math.random());
        const interests = shuffledInterests.slice(0, interestCount);
        
        // Generate random registration date within the last 30 days
        const registrationDate = new Date();
        registrationDate.setDate(registrationDate.getDate() - Math.floor(Math.random() * 30));
        
        return {
          id: i + 1,
          name: `مستخدم ${i + 1}`,
          email: `user${i + 1}@example.com`,
          phone: `+966 5${Math.floor(10000000 + Math.random() * 90000000)}`,
          experience: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
          interests,
          hearAbout: ['جوجل', 'تويتر', 'فيسبوك', 'صديق', 'إنستغرام'][Math.floor(Math.random() * 5)],
          notes: Math.random() > 0.7 ? 'أريد معرفة المزيد عن الدورة وطرق الدفع المتاحة.' : '',
          registrationDate: registrationDate.toISOString()
        };
      });
      
      res.status(200).json(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ 
        success: false, 
        message: 'حدث خطأ في جلب البيانات. يرجى المحاولة مرة أخرى.' 
      });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ 
      success: false, 
      message: `Method ${req.method} Not Allowed` 
    });
  }
};