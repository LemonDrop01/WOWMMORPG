import { setAutoAdmin } from '../src/lib/autoAdmin.ts';

setAutoAdmin().then(success => {
  if (success) {
    console.log('✓ Admin privileges restored successfully');
    process.exit(0);
  } else {
    console.log('✗ Failed to restore admin privileges');
    process.exit(1);
  }
});