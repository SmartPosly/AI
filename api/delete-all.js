import { createClient } from '@supabase/supabase-js'

// Supabase configuration for serverless function
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabase = null
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey)
}

// Serverless function for deleting all registrations
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,OPTIONS');
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

  // Handle DELETE request
  if (req.method === 'DELETE') {
    try {
      let deletedCount = 0;
      
      // Try to delete from Supabase first
      if (supabase) {
        try {
          console.log('Deleting all registrations from Supabase...');
          
          // First get the count
          const { count: beforeCount } = await supabase
            .from('registrations')
            .select('*', { count: 'exact', head: true });
          
          // Delete all records
          const { error } = await supabase
            .from('registrations')
            .delete()
            .neq('id', 0); // This deletes all records
          
          if (error) throw error;
          
          deletedCount = beforeCount || 0;
          console.log('Successfully deleted', deletedCount, 'registrations from Supabase');
          
        } catch (supabaseError) {
          console.error('Supabase delete error:', supabaseError.message);
          throw supabaseError;
        }
      } else {
        console.log('No Supabase configured, cannot delete from database');
      }
      
      res.status(200).json({
        success: true,
        message: 'تم حذف جميع التسجيلات بنجاح',
        deletedCount: deletedCount,
        source: supabase ? 'supabase' : 'no_database'
      });
    } catch (error) {
      console.error('Error deleting registrations:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء حذف التسجيلات. يرجى المحاولة مرة أخرى.',
        error: error.message
      });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['DELETE']);
    res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`
    });
  }
}