import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rbhpjvqtxquoqswnpwib.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiaHBqdnF0eHF1b3Fzd25wd2liIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTIwNzMyMywiZXhwIjoyMTAwNzgzMzIzfQ.B0JdbePdL4wlFwyhMgopH4UnqeRCHXB7H0CoA1KgrG4';

const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

export async function setAutoAdmin() {
  try {
    // Get the user ID for tygoodhue01@gmail.com
    const { data: { users } } = await adminSupabase.auth.admin.listUsers();
    const targetUser = users.find(u => u.email === 'tygoodhue01@gmail.com');
    
    if (!targetUser) {
      console.error('User tygoodhue01@gmail.com not found. Please register first.');
      return false;
    }

    console.log('Found user:', targetUser.id, targetUser.email);

    // Insert or update the user in the users table as admin
    const { error } = await adminSupabase
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
    console.error('Error in setAutoAdmin:', error);
    return false;
  }
}

// Run the function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setAutoAdmin().then(success => {
    if (success) {
      console.log('✓ Admin privileges restored successfully');
      process.exit(0);
    } else {
      console.log('✗ Failed to restore admin privileges');
      process.exit(1);
    }
  });
}