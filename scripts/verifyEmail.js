import { verifyUserEmail } from '../src/lib/verifyEmail.ts';

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