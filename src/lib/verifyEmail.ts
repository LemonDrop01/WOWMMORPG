import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rbhpjvqtxquoqswnpwib.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiaHBqdnF0eHF1b3Fzd25wd2liIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTIwNzMyMywiZXhwIjoyMTAwNzgzMzIzfQ.B0JdbePdL4wlFwyhMgopH4UnqeRCHXB7H0CoA1KgrG4';

const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

export async function verifyUserEmail() {
  try {
    // Get the user ID for tygoodhue01@gmail.com
    const { data: { users } } = await adminSupabase.auth.admin.listUsers();
    const targetUser = users.find(u => u.email === 'tygoodhue01@gmail.com');
    
    if (!targetUser) {
      console.error('User tygoodhue01@gmail.com not found');
      return false;
    }

    console.log('Found user:', targetUser.id, targetUser.email);
    console.log('Current email confirmed:', targetUser.email_confirmed_at);

    // Update user to mark email as confirmed
    const { error } = await adminSupabase.auth.admin.updateUserById(targetUser.id, {
      email_confirm: true
    });

    if (error) {
      console.error('Error verifying email:', error);
      return false;
    }

    console.log('Successfully verified email for tygoodhue01@gmail.com');
    return true;
  } catch (error) {
    console.error('Error in verifyUserEmail:', error);
    return false;
  }
}

// Run the function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyUserEmail().then(success => {
    if (success) {
      console.log('✓ Email verified successfully');
      console.log('You can now register without email confirmation');
      process.exit(0);
    } else {
      console.log('✗ Failed to verify email');
      process.exit(1);
    }
  });
}