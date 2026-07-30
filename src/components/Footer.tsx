import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ 
      borderTop: '1px solid #d4af37', 
      backgroundColor: '#0c0c0d', 
      marginTop: '80px',
      padding: '48px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '32px',
          marginBottom: '32px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span>🛡️</span>
              <span style={{ color: '#d4af37', fontSize: '18px', fontWeight: 'bold' }}>Azeroth Eternal</span>
            </div>
            <p style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: '1.6', maxWidth: '300px' }}>
              A blizzlike World of Warcraft: Wrath of the Lich King private server. Experience
              the full 3.3.5a content with an active community and dedicated staff.
            </p>
          </div>

          <div>
            <h3 style={{ color: '#d4af37', fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Quick Links
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><Link to="/realms" style={{ color: '#a0a0a0', textDecoration: 'none', fontSize: '14px' }}>Realm Status</Link></li>
              <li><Link to="/news" style={{ color: '#a0a0a0', textDecoration: 'none', fontSize: '14px' }}>News & Updates</Link></li>
              <li><Link to="/connect" style={{ color: '#a0a0a0', textDecoration: 'none', fontSize: '14px' }}>How to Connect</Link></li>
              <li><Link to="/register" style={{ color: '#a0a0a0', textDecoration: 'none', fontSize: '14px' }}>Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h3 style={{ color: '#d4af37', fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Server Info
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', color: '#a0a0a0', fontSize: '14px' }}>
              <li>Expansion: WotLK 3.3.5a</li>
              <li>XP Rate: x1 Blizzlike</li>
              <li>Location: Frankfurt, EU</li>
              <li>Uptime: 99.9%</li>
            </ul>
          </div>
        </div>

        <div style={{ 
          borderTop: '1px solid rgba(212, 175, 55, 0.3)', 
          paddingTop: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontSize: '12px',
          color: '#606060'
        }}>
          <p>Azeroth Eternal is a non-profit fan project. World of Warcraft is a trademark of Blizzard Entertainment.</p>
          <p>This server is not affiliated with or endorsed by Blizzard Entertainment.</p>
        </div>
      </div>
    </footer>
  );
}