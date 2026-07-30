import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, updateUserRole, type User } from '@/lib/admin';
import { isAdmin } from '@/lib/admin';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const adminCheck = await isAdmin();
      setIsAuthorized(adminCheck);
      
      if (adminCheck) {
        const userData = await getAllUsers();
        setUsers(userData);
      }
      
      setLoading(false);
    })();
  }, []);

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin' | 'super_admin') => {
    try {
      await updateUserRole(userId, newRole);
      
      // Refresh users list
      const userData = await getAllUsers();
      setUsers(userData);
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: 'white' }}>Loading...</div>;
  if (!isAuthorized) return <div style={{ padding: '40px', color: 'white' }}>Access Denied</div>;

  return (
    <div style={{ padding: '40px 20px', color: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#d4af37', marginBottom: '16px' }}>
              Manage Users
            </h1>
            <p style={{ color: '#a0a0a0', fontSize: '18px' }}>
              Manage user accounts and permissions
            </p>
          </div>
          <button
            onClick={() => navigate('/admin')}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: '#d4af37',
              border: '1px solid #d4af37',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Back to Admin
          </button>
        </div>

        <div style={{ 
          padding: '24px', 
          backgroundColor: 'rgba(30, 30, 33, 0.8)', 
          border: '1px solid rgba(212, 175, 55, 0.15)',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#d4af37', marginBottom: '16px' }}>
            User Statistics
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <span style={{ color: '#606060', fontSize: '12px', display: 'block', marginBottom: '4px' }}>TOTAL USERS</span>
              <span style={{ color: '#d4af37', fontSize: '24px', fontWeight: 'bold' }}>{users.length}</span>
            </div>
            <div>
              <span style={{ color: '#606060', fontSize: '12px', display: 'block', marginBottom: '4px' }}>ADMINS</span>
              <span style={{ color: '#d4af37', fontSize: '24px', fontWeight: 'bold' }}>
                {users.filter(u => u.role === 'admin' || u.role === 'super_admin').length}
              </span>
            </div>
            <div>
              <span style={{ color: '#606060', fontSize: '12px', display: 'block', marginBottom: '4px' }}>REGULAR USERS</span>
              <span style={{ color: '#d4af37', fontSize: '24px', fontWeight: 'bold' }}>
                {users.filter(u => u.role === 'user').length}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          {users.map((user) => (
            <div key={user.id} style={{
              padding: '24px',
              backgroundColor: 'rgba(30, 30, 33, 0.8)',
              border: '1px solid rgba(212, 175, 55, 0.15)',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#d4af37', marginBottom: '8px' }}>
                  {user.email}
                </h3>
                <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#a0a0a0' }}>
                  <span>Role: {user.role}</span>
                  <span>•</span>
                  <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'rgba(30, 30, 33, 0.8)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '14px'
                  }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}