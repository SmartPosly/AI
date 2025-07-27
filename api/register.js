import { createClient } from '@supabase/supabase-js'

// Supabase configuration for serverless function
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabase = null
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey)
}

// In-memory storage as fallback
let registrations = [];

// Serverless function for registration
export default async function handler(req, res) {
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
      const userData = req.body;
      
      // Format phone number
      let formattedPhone = userData.phone;
      if (formattedPhone.startsWith('+218')) {
        formattedPhone = formattedPhone.replace(/^\+218\s?/, '+218 ');
      } else if (formattedPhone.startsWith('218')) {
        formattedPhone = '+218 ' + formattedPhone.substring(3).trim();
      } else {
        formattedPhone = '+218 ' + formattedPhone;
      }
      
      // Create user with formatted data
      const newUser = {
        name: userData.name,
        email: userData.email,
        phone: formattedPhone,
        experience: userData.experience,
        interests: userData.interests,
        hear_about: userData.hearAbout,
        notes: userData.notes,
        created_at: new Date().toISOString()
      };
      
      let savedUser = null;
      let totalCount = 0;
      
      // Try to save to Supabase first
      if (supabase) {
        try {
          console.log('Saving to Supabase...');
          const { data, error } = await supabase
            .from('registrations')
            .insert([newUser])
            .select()
            .single();
          
          if (error) throw error;
          
          savedUser = {
            id: data.id,
            ...userData,
            phone: formattedPhone,
            registrationDate: data.created_at
          };
          
          // Get total count
          const { count } = await supabase
            .from('registrations')
            .select('*', { count: 'exact', head: true });
          
          totalCount = count || 1;
          
          console.log('Successfully saved to Supabase:', savedUser.name);
          console.log('Total registrations in Supabase:', totalCount);
          
        } catch (supabaseError) {
          console.error('Supabase error, falling back to memory:', supabaseError.message);
          // Fall back to memory storage
          savedUser = {
            id: Date.now(),
            ...userData,
            phone: formattedPhone,
            registrationDate: new Date().toISOString()
          };
          registrations.push(savedUser);
          totalCount = registrations.length;
        }
      } else {
        // No Supabase configured, use memory storage
        console.log('No Supabase configured, using memory storage');
        savedUser = {
          id: Date.now(),
          ...userData,
          phone: formattedPhone,
          registrationDate: new Date().toISOString()
        };
        registrations.push(savedUser);
        totalCount = registrations.length;
      }
      
      res.status(201).json({ 
        success: true, 
        message: 'تم التسجيل بنجاح',
        user: savedUser,
        totalRegistrations: totalCount,
        storage: supabase ? 'supabase' : 'memory'
      });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ 
        success: false, 
        message: 'حدث خطأ في التسجيل. يرجى المحاولة مرة أخرى.' 
      });
    }
  } else if (req.method === 'GET') {
    // Allow GET to retrieve current registrations for debugging
    res.status(200).json({
      success: true,
      registrations: registrations,
      count: registrations.length
    });
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).json({ 
      success: false, 
      message: `Method ${req.method} Not Allowed` 
    });
  }
};