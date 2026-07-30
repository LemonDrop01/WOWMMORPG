import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, type ServerInfo } from '@/lib/supabase';
import { isAdmin } from '@/lib/admin';

export default function AdminServerInfo() {
  const [serverInfo, setServerInfo] = useState<ServerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    key: '',
    label: '',
    value: '',
    category: 'General',
    display_order: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const adminCheck = await isAdmin();
      setIsAuthorized(adminCheck);
      
      if (adminCheck) {
        const { data, error } = await supabase
          .from('server_info')
          .select('*')
          .order('category, display_order');
        if (error) console.error('Error fetching server info:', error);
        else setServerInfo(data ?? []);
      }
      
      setLoading(false);
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('server_info').insert({
        key: formData.key,
        label: formData.label,
        value: formData.value,
        category: formData.category,
        display_order: formData.display_order
      });

      if (error) throw error;

      setFormData({ key: '', label: '', value: '', category: 'General', display_order: 0 });
      setShowForm(false);
      
      // Refresh server info
      const { data } = await supabase.from('server_info').select('*').order('category, display_order');
      setServerInfo(data ?? []);
    } catch (error) {
      console.error('Error creating server info:', error);
    }
  };

  const handleDelete = async (key: string) => {
    try {
      const { error } = await supabase.from('server_info').delete().eq('key', key);
      if (error) throw error;
      
      const { data } = await supabase.from('server_info').select('*').order('category, display_order');
      setServerInfo(data ?? []);
    } catch (error) {
      console.error('Error deleting server info:', error);
    }
  };

  const groupedInfo = serverInfo.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ServerInfo[]>);

  if (loading) return <div style={{ padding: '40px', color: 'white' }}>Loading...</div>;
  if (!isAuthorized) return <div style={{ padding: '40px', color: 'white' }}>Access Denied</div>;

  return (
    <div style={{ padding: '40px 20px', color: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#d4af37', marginBottom: '16px' }}>
              Server Information
            </h1>
            <p style={{ color: '#a0a0a0', fontSize: '18px' }}>
              Manage server statistics and information
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowForm(!showForm)}
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
              {showForm ? 'Cancel' : '+ Add Info'}
            </button>
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
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{
            padding: '32px',
            backgroundColor: 'rgba(30, 30, 33, 0.8)',
            border: '1px solid rgba(212, 175, 55, 0.15)',
            borderRadius: '8px',
            marginBottom: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#d4af37', marginBottom: '8px' }}>
              Add Server Information
            </h3>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#a0a0a0' }}>
                Key
              </label>
              <input
                type="text"
                value={formData.key}
                onChange={(e) => setFormData({...formData, key: e.target.value})}
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
                placeholder="e.g., total_accounts"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#a0a0a0' }}>
                Label
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({...formData, label: e.target.value})}
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
                placeholder="e.g., Total Accounts"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#a0a0a0' }}>
                Value
              </label>
              <input
                type="text"
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
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
                placeholder="e.g., 1234"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#a0a0a0' }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
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
                <option value="General">General</option>
                <option value="Social">Social</option>
                <option value="Technical">Technical</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#a0a0a0' }}>
                Display Order
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(30, 30, 33, 0.8)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '14px'
                }}
              />
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
                Add Info
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
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

        {Object.entries(groupedInfo).map(([category, items]) => (
          <div key={category} style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#d4af37', marginBottom: '16px' }}>
              {category}
            </h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              {items.map((info) => (
                <div key={info.key} style={{
                  padding: '24px',
                  backgroundColor: 'rgba(30, 30, 33, 0.8)',
                  border: '1px solid rgba(212, 175, 55, 0.15)',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#d4af37', marginBottom: '8px' }}>
                      {info.label}
                    </h4>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#d4af37' }}>
                      {info.value}
                    </p>
                    <p style={{ fontSize: '12px', color: '#606060', marginTop: '8px' }}>
                      Key: {info.key} • Order: {info.display_order}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(info.key)}
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
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}