import { useEffect, useState } from 'react';
import { supabase, type Realm, type NewsArticle, type ServerInfo } from '@/lib/supabase';

export default function HomePage() {
  const [realms, setRealms] = useState<Realm[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [info, setInfo] = useState<ServerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  // Helper function for responsive font sizes
  function clamp(min: number, max: number, val: number) {
    return Math.min(Math.max(val, min), max);
  }

  return (
    <div style={{ padding: '40px 20px', color: 'white', background: 'linear-gradient(135deg, #0a0a0c 0%, #1a1a20 50%, #0f0f10 100%)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{ 
        minHeight: '85vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center',
        marginBottom: '40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
          animation: 'pulse 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          right: '-20%',
          width: '60%',
          height: '60%',
          background: 'radial-gradient(circle, rgba(168, 142, 222, 0.1) 0%, transparent 50%)',
          animation: 'pulse 6s ease-in-out infinite reverse'
        }} />
        
        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
          {/* Status Badge */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '12px 24px', 
            marginBottom: '32px',
            background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)',
            border: '1px solid rgba(74, 222, 128, 0.3)',
            borderRadius: '30px',
            animation: mounted ? 'slideIn 0.8s ease-out' : 'none',
            transition: 'all 0.3s'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#4ade80',
              animation: 'pulse 2s infinite',
              boxShadow: '0 0 12px #4ade80'
            }} />
            <span style={{ color: '#4ade80', fontSize: '16px', fontWeight: '600' }}>
              {onlineRealms} {onlineRealms === 1 ? 'Realm' : 'Realms'} Online · {displayTotalPlayers.toLocaleString()} Heroes in Rune Haven
            </span>
          </div>

          {/* Main Title */}
          <h1 style={{ 
            fontSize: clamp(48, 72, window.innerWidth),
            fontWeight: '900', 
            marginBottom: '20px', 
            color: '#d4af37',
            textShadow: '0 8px 32px rgba(212, 175, 55, 0.4), 0 0 64px rgba(212, 175, 55, 0.2)',
            letterSpacing: '-2px',
            animation: mounted ? 'fadeInUp 1s ease-out' : 'none',
            lineHeight: 1.1
          }}>
            ⚔️ Rune Haven ⚔️
          </h1>
          
          <p style={{ 
            fontSize: '28px', 
            marginBottom: '16px', 
            color: '#e5c56d',
            fontWeight: '600',
            textShadow: '0 4px 16px rgba(229, 197, 109, 0.3)',
            animation: mounted ? 'fadeInUp 1s ease-out 0.2s' : 'none'
          }}>
            runehaven-online · Wrath of the Lich King
          </p>
          
          <p style={{ 
            fontSize: '18px', 
            marginBottom: '40px', 
            color: '#a0a0a0', 
            maxWidth: '700px',
            lineHeight: 1.8,
            animation: mounted ? 'fadeInUp 1s ease-out 0.4s' : 'none'
          }}>
            Experience the full Rune Haven world the way it was meant to be played.
            Epic quests, challenging dungeons, and legendary adventures await in Northrend.
          </p>

          {/* CTA Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            flexWrap: 'wrap', 
            justifyContent: 'center',
            animation: mounted ? 'fadeInUp 1s ease-out 0.6s' : 'none'
          }}>
            <button style={{ 
              padding: '16px 32px', 
              background: 'linear-gradient(135deg, #d4af37 0%, #c9a227 100%)',
              color: '#0f0f10', 
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              borderRadius: '12px',
              fontSize: '18px',
              boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)',
              transition: 'all 0.3s',
              transform: 'scale(1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(212, 175, 55, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(212, 175, 55, 0.4)';
            }}
            >
              🛡️ Begin Your Journey
            </button>
            <button style={{ 
              padding: '16px 32px', 
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
              color: '#d4af37', 
              border: '2px solid #d4af37',
              fontWeight: 'bold',
              cursor: 'pointer',
              borderRadius: '12px',
              fontSize: '18px',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)';
            }}
            >
              📜 How to Connect
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ 
        marginTop: '-60px',
        marginBottom: '80px',
        padding: '40px',
        background: 'linear-gradient(135deg, rgba(30, 30, 33, 0.95) 0%, rgba(20, 20, 23, 0.95) 100%)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '16px',
        maxWidth: '1200px',
        margin: '-60px auto 80px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'conic-gradient(from 0deg, transparent, rgba(212, 175, 55, 0.1), transparent)',
          animation: 'spin 20s linear infinite'
        }} />
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '32px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ 
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
            borderRadius: '12px',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(212, 175, 55, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚔️</div>
            <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#d4af37', marginBottom: '8px', fontFamily: 'fantasy' }}>
              {loading ? '—' : displayTotalPlayers.toLocaleString()}
            </p>
            <p style={{ fontSize: '14px', color: '#a0a0a0', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>
              Heroes Online
            </p>
          </div>
          
          <div style={{ 
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(168, 142, 222, 0.1) 0%, rgba(168, 142, 222, 0.05) 100%)',
            borderRadius: '12px',
            border: '1px solid rgba(168, 142, 222, 0.2)',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(168, 142, 222, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>👥</div>
            <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#a896de', marginBottom: '8px', fontFamily: 'fantasy' }}>
              {loading ? '—' : (infoMap.total_accounts ?? '—')}
            </p>
            <p style={{ fontSize: '14px', color: '#a0a0a0', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>
              Total Accounts
            </p>
          </div>
          
          <div style={{ 
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.1) 0%, rgba(74, 222, 128, 0.05) 100%)',
            borderRadius: '12px',
            border: '1px solid rgba(74, 222, 128, 0.2)',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(74, 222, 128, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>💬</div>
            <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#4ade80', marginBottom: '8px', fontFamily: 'fantasy' }}>
              {loading ? '—' : (infoMap.discord_members ?? '—')}
            </p>
            <p style={{ fontSize: '14px', color: '#a0a0a0', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>
              Discord Members
            </p>
          </div>
          
          <div style={{ 
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(249, 115, 22, 0.05) 100%)',
            borderRadius: '12px',
            border: '1px solid rgba(249, 115, 22, 0.2)',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(249, 115, 22, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚡</div>
            <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#f97316', marginBottom: '8px', fontFamily: 'fantasy' }}>
              {loading ? '—' : '99.9%'}
            </p>
            <p style={{ fontSize: '14px', color: '#a0a0a0', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>
              Server Uptime
            </p>
          </div>
        </div>
      </div>

      {/* Realm Status Preview */}
      <div style={{ marginBottom: '80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '40px', fontWeight: 'bold', color: '#d4af37', marginBottom: '8px', fontFamily: 'fantasy' }}>
              🏰 Realm Status
            </h2>
            <p style={{ color: '#a0a0a0', fontSize: '18px' }}>
              Check the status of all our game realms
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ 
                padding: '32px', 
                background: 'linear-gradient(135deg, rgba(30, 30, 33, 0.9) 0%, rgba(20, 20, 23, 0.9) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '12px',
                height: '200px',
                animation: 'pulse 2s infinite'
              }} />
            ))}
          </div>
        ) : realms.length === 0 ? (
          <div style={{ 
            padding: '64px', 
            textAlign: 'center', 
            background: 'linear-gradient(135deg, rgba(30, 30, 33, 0.9) 0%, rgba(20, 20, 23, 0.9) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏰</div>
            <p style={{ color: '#a0a0a0', fontSize: '18px' }}>
              No realms currently configured. Add realms in the database to see them here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            {realms.map((realm) => (
              <div key={realm.id} style={{ 
                padding: '32px', 
                background: 'linear-gradient(135deg, rgba(30, 30, 33, 0.9) 0%, rgba(20, 20, 23, 0.9) 100%)',
                border: `1px solid ${realm.online ? 'rgba(74, 222, 128, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                borderRadius: '12px',
                transition: 'all 0.3s',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = `0 16px 32px ${realm.online ? 'rgba(74, 222, 128, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                {/* Status bar */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: realm.online ? 'linear-gradient(90deg, #4ade80, #22c55e)' : 'linear-gradient(90deg, #ef4444, #dc2626)'
                }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#d4af37', fontFamily: 'fantasy' }}>
                    {realm.name}
                  </h3>
                  <span style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    background: realm.online ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: realm.online ? '#4ade80' : '#ef4444',
                    border: `1px solid ${realm.online ? '#4ade80' : '#ef4444'}40`
                  }}>
                    <span style={{ 
                      width: '10px', 
                      height: '10px', 
                      borderRadius: '50%', 
                      backgroundColor: realm.online ? '#4ade80' : '#ef4444',
                      animation: 'pulse 2s infinite'
                    }} />
                    {realm.online ? '🟢 Online' : '🔴 Offline'}
                  </span>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                  <span style={{ 
                    padding: '6px 16px',
                    background: 'rgba(212, 175, 55, 0.2)',
                    color: '#d4af37',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {realm.type}
                  </span>
                  <span style={{ 
                    padding: '6px 16px',
                    background: 'rgba(168, 142, 222, 0.2)',
                    color: '#a896de',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {realm.expansion}
                  </span>
                </div>
                
                <div style={{ 
                  padding: '20px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <span style={{ color: '#606060', fontSize: '12px', display: 'block', marginBottom: '4px' }}>HEROES</span>
                      <span style={{ color: '#d4af37', fontSize: '20px', fontWeight: 'bold' }}>
                        {realm.players_online} / {realm.max_players}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#606060', fontSize: '12px', display: 'block', marginBottom: '4px' }}>UPTIME</span>
                      <span style={{ color: '#d4af37', fontSize: '20px', fontWeight: 'bold' }}>{realm.uptime}</span>
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