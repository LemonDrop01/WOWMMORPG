import { useEffect, useState } from 'react';
import { supabase, type Realm } from '@/lib/supabase';

export default function RealmsPage() {
  const [realms, setRealms] = useState<Realm[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleString());

  useEffect(() => {
    (async () => {
      try {
        // Force fresh data fetch with no cache
        const { data, error } = await supabase
          .from('realms')
          .select('*')
          .order('display_order')
          .throwOnError();
        
        if (error) throw error;
        console.log('Fetched realms data:', data);
        setRealms(data ?? []);
        setLastUpdated(new Date().toLocaleString());
      } catch (err) {
        console.error('Error fetching realms:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Force refresh function
  const handleRefresh = () => {
    setLoading(true);
    (async () => {
      try {
        const { data, error } = await supabase
          .from('realms')
          .select('*')
          .order('display_order')
          .throwOnError();
        
        if (error) throw error;
        console.log('Refreshed realms data:', data);
        setRealms(data ?? []);
        setLastUpdated(new Date().toLocaleString());
      } catch (err) {
        console.error('Error refreshing realms:', err);
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <div style={{ padding: '40px 20px', color: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#d4af37', marginBottom: '16px' }}>
              Realm Status
            </h1>
            <p style={{ color: '#a0a0a0', fontSize: '18px' }}>
              Check the status of all our game realms and join the adventure
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: '#d4af37',
              color: '#0f0f10',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Refreshing...' : 'Refresh Status'}
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ 
                padding: '24px', 
                backgroundColor: 'rgba(30, 30, 33, 0.8)', 
                border: '1px solid rgba(212, 175, 55, 0.15)',
                borderRadius: '8px',
                height: '200px'
              }} />
            ))}
          </div>
        ) : realms.length === 0 ? (
          <div style={{ 
            padding: '48px', 
            textAlign: 'center', 
            backgroundColor: 'rgba(30, 30, 33, 0.8)', 
            border: '1px solid rgba(212, 175, 55, 0.15)',
            borderRadius: '8px'
          }}>
            <p style={{ color: '#a0a0a0', fontSize: '16px' }}>
              No realms currently configured.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            {realms.map((realm) => (
              <div key={realm.id} style={{ 
                padding: '32px', 
                backgroundColor: 'rgba(30, 30, 33, 0.8)', 
                border: '1px solid rgba(212, 175, 55, 0.15)',
                borderRadius: '8px',
                transition: 'all 0.3s'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#d4af37' }}>
                    {realm.name}
                  </h2>
                  <span style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    backgroundColor: realm.online ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: realm.online ? '#4ade80' : '#ef4444'
                  }}>
                    <span style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: realm.online ? '#4ade80' : '#ef4444' 
                    }} />
                    {realm.online ? 'Online' : 'Offline'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                  <span style={{ 
                    padding: '4px 12px',
                    backgroundColor: 'rgba(212, 175, 55, 0.2)',
                    color: '#d4af37',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {realm.type}
                  </span>
                  <span style={{ 
                    padding: '4px 12px',
                    backgroundColor: 'rgba(212, 175, 55, 0.2)',
                    color: '#d4af37',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {realm.expansion}
                  </span>
                </div>

                {realm.description && (
                  <p style={{ color: '#a0a0a0', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
                    {realm.description}
                  </p>
                )}

                <div style={{ 
                  padding: '20px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '6px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <span style={{ color: '#606060', fontSize: '12px', display: 'block', marginBottom: '4px' }}>PLAYERS</span>
                      <span style={{ color: '#d4af37', fontSize: '20px', fontWeight: 'bold' }}>
                        {realm.players_online} / {realm.max_players}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#606060', fontSize: '12px', display: 'block', marginBottom: '4px' }}>UPTIME</span>
                      <span style={{ color: '#d4af37', fontSize: '20px', fontWeight: 'bold' }}>{realm.uptime}</span>
                    </div>
                    <div>
                      <span style={{ color: '#606060', fontSize: '12px', display: 'block', marginBottom: '4px' }}>HOST</span>
                      <span style={{ color: '#a0a0a0', fontSize: '14px', fontFamily: 'monospace' }}>{realm.host}</span>
                    </div>
                    <div>
                      <span style={{ color: '#606060', fontSize: '12px', display: 'block', marginBottom: '4px' }}>PORT</span>
                      <span style={{ color: '#a0a0a0', fontSize: '14px', fontFamily: 'monospace' }}>{realm.port}</span>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: '#606060' }}>
                  Last updated: {new Date(realm.updated_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}