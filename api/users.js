import { createClient } from '@supabase/supabase-js'

// Supabase configuration for serverless function
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabase = null
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey)
}

// Serverless function for getting users
export default async function handler(req, res) {
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
      let users = [];
      let source = 'memory';
      
      // Try to fetch from Supabase first
      if (supabase) {
        try {
          console.log('Fetching users from Supabase...');
          const { data, error } = await supabase
            .from('registrations')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          
          // Transform Supabase data to match expected format
          users = data.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            experience: user.experience,
            interests: user.interests,
            hearAbout: user.hear_about,
            notes: user.notes,
            registrationDate: user.created_at
          }));
          
          source = 'supabase';
          console.log('Successfully fetched from Supabase:', users.length, 'users');
          
        } catch (supabaseError) {
          console.error('Supabase error:', supabaseError.message);
          users = [];
          source = 'supabase_error';
        }
      } else {
        console.log('No Supabase configured, returning empty array');
        users = [];
        source = 'no_config';
      }
      
      res.status(200).json({
        success: true,
        users: users,
        count: users.length,
        source: source,
        message: supabase ? 'Data fetched from Supabase' : 'No database configured'
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