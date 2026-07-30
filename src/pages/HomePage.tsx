import { useEffect, useState } from 'react';
import { supabase, type Realm, type NewsArticle, type ServerInfo } from '@/lib/supabase';

export default function HomePage() {
  const [realms, setRealms] = useState<Realm[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [info, setInfo] = useState<ServerInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [realmsRes, newsRes, infoRes] = await Promise.all([
          supabase.from('realms').select('*').order('display_order'),
          supabase.from('news').select('*').eq('is_published', true).order('published_at', { ascending: false }).limit(3),
          supabase.from('server_info').select('*').order('category, display_order'),
        ]);
        
        if (realmsRes.error) throw new Error(`Realms: ${realmsRes.error.message}`);
        if (newsRes.error) throw new Error(`News: ${newsRes.error.message}`);
        if (infoRes.error) throw new Error(`Server Info: ${infoRes.error.message}`);
        
        setRealms(realmsRes.data ?? []);
        setNews(newsRes.data ?? []);
        setInfo(infoRes.data ?? []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalPlayers = realms.reduce((sum, r) => sum + r.players_online, 0);
  const onlineRealms = realms.filter((r) => r.online).length;
  const infoMap = Object.fromEntries(info.map((i) => [i.key, i.value]));
  
  // Use the total_players from server_info if available, otherwise calculate from realms
  const displayTotalPlayers = infoMap.total_players ? parseInt(infoMap.total_players) : totalPlayers;

  return (
    <div style={{ padding: '40px 20px', color: 'white' }}>
      {/* Hero */}
      <div style={{ 
        minHeight: '70vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '8px 16px', 
          marginBottom: '24px',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '20px',
          backgroundColor: 'rgba(12, 12, 13, 0.6)'
        }}>
          <span style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: '#4ade80',
            animation: 'pulse 2s infinite'
          }} />
          <span style={{ color: '#e5c56d', fontSize: '14px' }}>
            {onlineRealms} Realms Online · {totalPlayers} Players In-Game
          </span>
        </div>

        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          marginBottom: '16px', 
          color: '#d4af37',
          textShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          Azeroth Eternal
        </h1>
        <p style={{ fontSize: '24px', marginBottom: '16px', color: '#e5c56d' }}>
          Wrath of the Lich King · 3.3.5a
        </p>
        <p style={{ fontSize: '16px', marginBottom: '32px', color: '#a0a0a0', maxWidth: '600px' }}>
          Experience the full Wrath of the Lich King expansion the way it was meant to be played.
          Blizzlike rates, fully scripted content, and an active community await you in Northrend.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button style={{ 
            padding: '12px 24px', 
            backgroundColor: '#d4af37', 
            color: '#0f0f10', 
            border: 'none', 
            fontWeight: 'bold',
            cursor: 'pointer',
            borderRadius: '4px',
            fontSize: '16px'
          }}>
            Create Your Account
          </button>
          <button style={{ 
            padding: '12px 24px', 
            backgroundColor: 'transparent', 
            color: '#d4af37', 
            border: '1px solid #d4af37', 
            fontWeight: 'bold',
            cursor: 'pointer',
            borderRadius: '4px',
            fontSize: '16px'
          }}>
            How to Connect
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ 
        marginTop: '-40px',
        marginBottom: '60px',
        padding: '32px',
        backgroundColor: 'rgba(30, 30, 33, 0.8)',
        border: '1px solid rgba(212, 175, 55, 0.15)',
        borderRadius: '8px',
        maxWidth: '1000px',
        margin: '-40px auto 60px'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '24px',
          textAlign: 'center'
        }}>
          <div>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#d4af37', marginBottom: '8px' }}>
              {loading ? '—' : displayTotalPlayers.toLocaleString()}
            </p>
            <p style={{ fontSize: '12px', color: '#606060', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Players Online
            </p>
          </div>
          <div>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#d4af37', marginBottom: '8px' }}>
              {loading ? '—' : (infoMap.total_accounts ?? '—')}
            </p>
            <p style={{ fontSize: '12px', color: '#606060', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Total Accounts
            </p>
          </div>
          <div>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#d4af37', marginBottom: '8px' }}>
              {loading ? '—' : (infoMap.discord_members ?? '—')}
            </p>
            <p style={{ fontSize: '12px', color: '#606060', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Discord Members
            </p>
          </div>
          <div>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#d4af37', marginBottom: '8px' }}>
              {loading ? '—' : '99.9%'}
            </p>
            <p style={{ fontSize: '12px', color: '#606060', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Uptime
            </p>
          </div>
        </div>
      </div>

      {/* Realm Status Preview */}
      <div style={{ marginBottom: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#d4af37', marginBottom: '8px' }}>
              Realm Status
            </h2>
            <p style={{ color: '#a0a0a0', fontSize: '16px' }}>
              Check the status of all our game realms
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ 
                padding: '24px', 
                backgroundColor: 'rgba(30, 30, 33, 0.8)', 
                border: '1px solid rgba(212, 175, 55, 0.15)',
                borderRadius: '8px',
                height: '150px'
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
              No realms currently configured. Add realms in the database to see them here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {realms.map((realm) => (
              <div key={realm.id} style={{ 
                padding: '24px', 
                backgroundColor: 'rgba(30, 30, 33, 0.8)', 
                border: '1px solid rgba(212, 175, 55, 0.15)',
                borderRadius: '8px',
                transition: 'all 0.3s'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#d4af37' }}>
                    {realm.name}
                  </h3>
                  <span style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: realm.online ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: realm.online ? '#4ade80' : '#ef4444'
                  }}>
                    <span style={{ 
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%', 
                      backgroundColor: realm.online ? '#4ade80' : '#ef4444' 
                    }} />
                    {realm.online ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <span style={{ color: '#a0a0a0', fontSize: '14px' }}>{realm.type}</span>
                  <span style={{ color: '#606060' }}>·</span>
                  <span style={{ color: '#a0a0a0', fontSize: '14px' }}>{realm.expansion}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <div>
                    <span style={{ color: '#606060', fontSize: '12px', display: 'block' }}>Players</span>
                    <span style={{ color: '#d4af37', fontWeight: 'bold' }}>
                      {realm.players_online} / {realm.max_players}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#606060', fontSize: '12px', display: 'block' }}>Uptime</span>
                    <span style={{ color: '#d4af37', fontWeight: 'bold' }}>{realm.uptime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Latest News */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#d4af37', marginBottom: '8px' }}>
              Latest News
            </h2>
            <p style={{ color: '#a0a0a0', fontSize: '16px' }}>
              Stay updated with the latest server announcements
            </p>
          </div>
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
        ) : news.length === 0 ? (
          <div style={{ 
            padding: '48px', 
            textAlign: 'center', 
            backgroundColor: 'rgba(30, 30, 33, 0.8)', 
            border: '1px solid rgba(212, 175, 55, 0.15)',
            borderRadius: '8px'
          }}>
            <p style={{ color: '#a0a0a0', fontSize: '16px' }}>
              No news articles published yet. Check back soon for updates!
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {news.map((article) => (
              <div key={article.id} style={{ 
                padding: '24px', 
                backgroundColor: 'rgba(30, 30, 33, 0.8)', 
                border: '1px solid rgba(212, 175, 55, 0.15)',
                borderRadius: '8px',
                transition: 'all 0.3s'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ 
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: 'rgba(212, 175, 55, 0.2)',
                    color: '#d4af37',
                    marginBottom: '8px'
                  }}>
                    {article.category}
                  </span>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#e5c56d', marginBottom: '8px' }}>
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
                    {article.excerpt}
                  </p>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#606060' }}>
                  <span>{article.author}</span>
                  <span>{new Date(article.published_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}