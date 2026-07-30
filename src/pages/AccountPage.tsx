import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase, type GameAccount } from '@/lib/supabase';

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const [gameAccounts, setGameAccounts] = useState<GameAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountExpansion, setNewAccountExpansion] = useState('WotLK 3.3.5a');
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchGameAccounts();
    }
  }, [user]);

  const fetchGameAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('game_accounts')
        .select('*')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      setGameAccounts(data ?? []);
    } catch (err) {
      console.error('Error fetching game accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGameAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);

    if (!newAccountName.trim()) {
      setAddError('Account name is required');
      return;
    }

    try {
      const { error } = await supabase
        .from('game_accounts')
        .insert({
          user_id: user?.id,
          account_name: newAccountName,
          expansion: newAccountExpansion
        });

      if (error) throw error;

      setNewAccountName('');
      setShowAddForm(false);
      fetchGameAccounts();
    } catch (err) {
      setAddError('Failed to add game account');
      console.error('Error adding game account:', err);
    }
  };

  const handleDeleteGameAccount = async (id: string) => {
    try {
      const { error } = await supabase
        .from('game_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchGameAccounts();
    } catch (err) {
      console.error('Error deleting game account:', err);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user) {
    return (
      <div style={{ padding: '40px 20px', color: 'white', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#d4af37', marginBottom: '16px' }}>
          Not Signed In
        </h1>
        <p style={{ color: '#a0a0a0', fontSize: '16px' }}>
          Please sign in to view your account
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', color: 'white' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#d4af37', marginBottom: '16px' }}>
            My Account
          </h1>
          <p style={{ color: '#a0a0a0', fontSize: '18px' }}>
            Manage your account and game accounts
          </p>
        </div>

        {/* Account Info */}
        <div style={{ 
          padding: '32px', 
          backgroundColor: 'rgba(30, 30, 33, 0.8)', 
          border: '1px solid rgba(212, 175, 55, 0.15)',
          borderRadius: '8px',
          marginBottom: '32px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#d4af37', marginBottom: '24px' }}>
            Account Information
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <span style={{ color: '#606060', fontSize: '12px', display: 'block', marginBottom: '4px' }}>EMAIL</span>
              <span style={{ color: '#a0a0a0', fontSize: '16px' }}>{user.email}</span>
            </div>
            <div>
              <span style={{ color: '#606060', fontSize: '12px', display: 'block', marginBottom: '4px' }}>USER ID</span>
              <span style={{ color: '#a0a0a0', fontSize: '14px', fontFamily: 'monospace' }}>{user.id.slice(0, 8)}...</span>
            </div>
            <div>
              <span style={{ color: '#606060', fontSize: '12px', display: 'block', marginBottom: '4px' }}>EMAIL VERIFIED</span>
              <span style={{ 
                color: user.email_confirmed_at ? '#4ade80' : '#fca5a5',
                fontSize: '16px'
              }}>
                {user.email_confirmed_at ? '✓ Verified' : '✗ Not Verified'}
              </span>
            </div>
            <div>
              <span style={{ color: '#606060', fontSize: '12px', display: 'block', marginBottom: '4px' }}>MEMBER SINCE</span>
              <span style={{ color: '#a0a0a0', fontSize: '16px' }}>
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(212, 175, 55, 0.1)' }}>
            <button
              onClick={handleSignOut}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                color: '#ef4444',
                border: '1px solid #ef4444',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Game Accounts */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#d4af37' }}>
              Game Accounts
            </h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#d4af37',
                color: '#0f0f10',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {showAddForm ? 'Cancel' : '+ Add Game Account'}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddGameAccount} style={{ 
              padding: '24px', 
              backgroundColor: 'rgba(30, 30, 33, 0.8)', 
              border: '1px solid rgba(212, 175, 55, 0.15)',
              borderRadius: '8px',
              marginBottom: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#d4af37', marginBottom: '8px' }}>
                Add New Game Account
              </h3>
              
              {addError && (
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: 'rgba(239, 68, 68, 0.2)', 
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '4px',
                  fontSize: '14px',
                  color: '#fca5a5'
                }}>
                  {addError}
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#a0a0a0' }}>
                  Account Name
                </label>
                <input
                  type="text"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(30, 30, 33, 0.8)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '14px'
                  }}
                  placeholder="Your in-game account name"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#a0a0a0' }}>
                  Expansion
                </label>
                <select
                  value={newAccountExpansion}
                  onChange={(e) => setNewAccountExpansion(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(30, 30, 33, 0.8)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '14px'
                  }}
                >
                  <option value="WotLK 3.3.5a">WotLK 3.3.5a</option>
                  <option value="Cataclysm 4.3.4">Cataclysm 4.3.4</option>
                  <option value="Mists of Pandaria 5.4.8">Mists of Pandaria 5.4.8</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#d4af37',
                    color: '#0f0f10',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Add Account
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'transparent',
                    color: '#a0a0a0',
                    border: '1px solid #606060',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#a0a0a0' }}>
              Loading game accounts...
            </div>
          ) : gameAccounts.length === 0 ? (
            <div style={{ 
              padding: '48px', 
              textAlign: 'center', 
              backgroundColor: 'rgba(30, 30, 33, 0.8)', 
              border: '1px solid rgba(212, 175, 55, 0.15)',
              borderRadius: '8px'
            }}>
              <p style={{ color: '#a0a0a0', fontSize: '16px', marginBottom: '16px' }}>
                No game accounts linked to your account yet.
              </p>
              <p style={{ color: '#606060', fontSize: '14px' }}>
                Add a game account to get started playing on our realms.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {gameAccounts.map((account) => (
                <div key={account.id} style={{ 
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
                      {account.account_name}
                    </h3>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#a0a0a0' }}>
                      <span>{account.expansion}</span>
                      <span>•</span>
                      <span>Added {new Date(account.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteGameAccount(account.id)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'transparent',
                      color: '#ef4444',
                      border: '1px solid #ef4444',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}