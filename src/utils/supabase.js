import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'your-project-url'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database operations for registrations
export const registrationService = {
  // Create a new registration
  async create(userData) {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .insert([{
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          experience: userData.experience,
          interests: userData.interests,
          hear_about: userData.hearAbout,
          notes: userData.notes,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error creating registration:', error)
      return { success: false, error: error.message }
    }
  },

  // Get all registrations
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Error fetching registrations:', error)
      return { success: false, error: error.message, data: [] }
    }
  },

  // Delete all registrations (for reset functionality)
  async deleteAll() {
    try {
      const { error } = await supabase
        .from('registrations')
        .delete()
        .neq('id', 0) // Delete all records

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error deleting all registrations:', error)
      return { success: false, error: error.message }
    }
  },

  // Get registration count
  async getCount() {
    try {
      const { count, error } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })

      if (error) throw error
      return { success: true, count: count || 0 }
    } catch (error) {
      console.error('Error getting registration count:', error)
      return { success: false, count: 0 }
    }
  },

  // Subscribe to real-time changes
  subscribeToChanges(callback) {
    return supabase
      .channel('registrations')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'registrations' }, 
        callback
      )
      .subscribe()
  }
}