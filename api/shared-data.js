import { createClient } from '@supabase/supabase-js'

// Supabase configuration for serverless function
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabase = null
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey)
}

// Fallback in-memory storage
let sharedRegistrations = [];

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
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

  try {
    switch (req.method) {
      case 'GET':
        // Return all registrations
        let registrations = [];
        let source = 'memory';
        
        if (supabase) {
          try {
            const { data, error } = await supabase
              .from('registrations')
              .select('*')
              .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            // Transform to expected format
            registrations = data.map(user => ({
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
          } catch (error) {
            console.error('Supabase GET error:', error);
            registrations = sharedRegistrations;
            source = 'memory_fallback';
          }
        } else {
          registrations = sharedRegistrations;
        }
        
        res.status(200).json({
          success: true,
          registrations: registrations,
          count: registrations.length,
          source: source,
          timestamp: new Date().toISOString()
        });
        break;

      case 'POST':
        // Add new registration
        const newUser = req.body;
        if (!newUser || !newUser.name || !newUser.email) {
          return res.status(400).json({
            success: false,
            message: 'Invalid user data'
          });
        }

        // Add ID if not present
        if (!newUser.id) {
          newUser.id = Date.now();
        }

        // Add registration date if not present
        if (!newUser.registrationDate) {
          newUser.registrationDate = new Date().toISOString();
        }

        sharedRegistrations.push(newUser);
        
        console.log('Added registration to shared data:', newUser.name);
        console.log('Total shared registrations:', sharedRegistrations.length);

        res.status(201).json({
          success: true,
          message: 'Registration added to shared data',
          user: newUser,
          totalCount: sharedRegistrations.length
        });
        break;

      case 'PUT':
        // Replace all registrations (for bulk sync)
        const { registrations } = req.body;
        if (!Array.isArray(registrations)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid registrations data'
          });
        }

        sharedRegistrations = registrations;
        
        console.log('Replaced shared registrations with', registrations.length, 'items');

        res.status(200).json({
          success: true,
          message: 'Shared data updated',
          count: sharedRegistrations.length
        });
        break;

      case 'DELETE':
        // Clear all registrations
        const previousCount = sharedRegistrations.length;
        sharedRegistrations = [];
        
        console.log('Cleared shared registrations, previous count:', previousCount);

        res.status(200).json({
          success: true,
          message: 'All registrations cleared',
          previousCount: previousCount
        });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).json({
          success: false,
          message: `Method ${req.method} Not Allowed`
        });
    }
  } catch (error) {
    console.error('Error in shared-data API:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}