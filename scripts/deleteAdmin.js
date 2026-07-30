import { deleteAdminAccount } from '../src/lib/deleteAdmin.ts';

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