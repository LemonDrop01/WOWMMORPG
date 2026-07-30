import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rbhpjvqtxquoqswnpwib.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiaHBqdnF0eHF1b3Fzd25wd2liIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTIwNzMyMywiZXhwIjoyMTAwNzgzMzIzfQ.B0JdbePdL4wlFwyhMgopH4UnqeRCHXB7H0CoA1KgrG4';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function setSimpleAdmin() {
  try {
    // First, let's check if users table exists
    const { data: tables, error: tableError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('Users table error:', tableError);
      return false;
    }

    console.log('Users table exists, data:', tables);

    // Get the user ID from auth.users for tygoodhue01@gmail.com
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const targetUser = users.find(u => u.email === 'tygoodhue01@gmail.com');
    
    if (!targetUser) {
      console.error('User tygoodhue01@gmail.com not found');
      return false;
    }

    console.log('Found user:', targetUser.id, targetUser.email);

    // Insert or update the user in the users table
    const { error } = await supabase
      .from('users')
      .upsert({
        id: targetUser.id,
        email: targetUser.email,
        role: 'admin',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (error) {
      console.error('Error setting admin:', error);
      return false;
    }

    console.log('Successfully set tygoodhue01@gmail.com as admin');
    return true;
  } catch (error) {
    console.error('Error in setSimpleAdmin:', error);
    return false;
  }
}

// Run the function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setSimpleAdmin().then(success => {
    if (success) {
      console.log('✓ Admin user set successfully');
      process.exit(0);
    } else {
      console.log('✗ Failed to set admin user');
      process.exit(1);
    }
  });
}