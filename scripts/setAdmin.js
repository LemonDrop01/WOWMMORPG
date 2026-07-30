import { setSimpleAdmin } from '../src/lib/simpleAdmin.ts';

setSimpleAdmin().then(success => {
  if (success) {
    console.log('✓ Admin user set successfully');
    process.exit(0);
  } else {
    console.log('✗ Failed to set admin user');
    process.exit(1);
  }
});