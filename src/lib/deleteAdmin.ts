import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rbhpjvqtxquoqswnpwib.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiaHBqdnF0eHF1b3Fzd25wd2liIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTIwNzMyMywiZXhwIjoyMTAwNzgzMzIzfQ.B0JdbePdL4wlFwyhMgopH4UnqeRCHXB7H0CoA1KgrG4';

const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

export async function deleteAdminAccount() {
  try {
    // Get the user ID for tygoodhue01@gmail.com
    const { data: { users } } = await adminSupabase.auth.admin.listUsers();
    const targetUser = users.find(u => u.email === 'tygoodhue01@gmail.com');
    
    if (!targetUser) {
      console.error('User tygoodhue01@gmail.com not found');
      return false;
    }

    console.log('Found user to delete:', targetUser.id, targetUser.email);

    // Delete from users table
    const { error: userError } = await adminSupabase
      .from('users')
      .delete()
      .eq('id', targetUser.id);

    if (userError) {
      console.error('Error deleting from users table:', userError);
    } else {
      console.log('Deleted from users table');
    }

    // Delete from game_accounts table if exists
    const { error: gameError } = await adminSupabase
      .from('game_accounts')
      .delete()
      .eq('user_id', targetUser.id);

    if (gameError) {
      console.error('Error deleting from game_accounts table:', gameError);
    } else {
      console.log('Deleted from game_accounts table');
    }

    // Delete from auth.users
    const { error: authError } = await adminSupabase.auth.admin.deleteUser(targetUser.id);

    if (authError) {
      console.error('Error deleting from auth.users:', authError);
      return false;
    }

    console.log('Successfully deleted tygoodhue01@gmail.com from auth.users');
    return true;
  } catch (error) {
    console.error('Error in deleteAdminAccount:', error);
    return false;
  }
}

// Run the function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  deleteAdminAccount().then(success => {
    if (success) {
      console.log('✓ Admin account deleted successfully');
      console.log('Please re-register at /register to create both web and game accounts');
      process.exit(0);
    } else {
      console.log('✗ Failed to delete admin account');
      process.exit(1);
    }
  });
}