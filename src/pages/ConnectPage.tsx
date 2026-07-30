export default function ConnectPage() {
  return (
    <div style={{ padding: '40px 20px', color: 'white' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#d4af37', marginBottom: '16px' }}>
            How to Connect
          </h1>
          <p style={{ color: '#a0a0a0', fontSize: '18px' }}>
            Follow these steps to connect to Azeroth Eternal
          </p>
        </div>

        <div style={{ display: 'grid', gap: '32px' }}>
          <div style={{ 
            padding: '32px', 
            backgroundColor: 'rgba(30, 30, 33, 0.8)', 
            border: '1px solid rgba(212, 175, 55, 0.15)',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: '#d4af37', 
                color: '#0f0f10',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '18px'
              }}>
                1
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#d4af37' }}>
                Download the Game Client
              </h2>
            </div>
            <p style={{ color: '#a0a0a0', fontSize: '16px', lineHeight: '1.6', marginBottom: '16px' }}>
              Download World of Warcraft: Wrath of the Lich King (3.3.5a) client. You can find this on various game distribution platforms or through official Blizzard archives.
            </p>
            <div style={{ 
              padding: '16px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '6px',
              fontSize: '14px',
              color: '#a0a0a0'
            }}>
              <strong style={{ color: '#d4af37' }}>Required Version:</strong> 3.3.5a (build 12340)
            </div>
          </div>

          <div style={{ 
            padding: '32px', 
            backgroundColor: 'rgba(30, 30, 33, 0.8)', 
            border: '1px solid rgba(212, 175, 55, 0.15)',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: '#d4af37', 
                color: '#0f0f10',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '18px'
              }}>
                2
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#d4af37' }}>
                Create an Account
              </h2>
            </div>
            <p style={{ color: '#a0a0a0', fontSize: '16px', lineHeight: '1.6', marginBottom: '16px' }}>
              Register an account on our website to get your game credentials. This will be the same username and password you use to log into the game server.
            </p>
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
              Create Account
            </button>
          </div>

          <div style={{ 
            padding: '32px', 
            backgroundColor: 'rgba(30, 30, 33, 0.8)', 
            border: '1px solid rgba(212, 175, 55, 0.15)',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: '#d4af37', 
                color: '#0f0f10',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '18px'
              }}>
                3
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#d4af37' }}>
                Configure realmlist.wtf
              </h2>
            </div>
            <p style={{ color: '#a0a0a0', fontSize: '16px', lineHeight: '1.6', marginBottom: '16px' }}>
              Navigate to your World of Warcraft installation directory and find the <code style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '2px 6px', borderRadius: '3px', fontFamily: 'monospace' }}>Data/enUS/realmlist.wtf</code> file. Open it with a text editor and replace the contents with:
            </p>
            <div style={{ 
              padding: '16px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '14px',
              color: '#d4af37',
              marginBottom: '16px',
              wordBreak: 'break-all'
            }}>
              set realmlist azeroth.eternal
            </div>
            <p style={{ color: '#a0a0a0', fontSize: '14px' }}>
              Note: The realm address may vary depending on which realm you want to connect to. Check the Realms page for the correct address.
            </p>
          </div>

          <div style={{ 
            padding: '32px', 
            backgroundColor: 'rgba(30, 30, 33, 0.8)', 
            border: '1px solid rgba(212, 175, 55, 0.15)',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: '#d4af37', 
                color: '#0f0f10',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '18px'
              }}>
                4
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#d4af37' }}>
                Launch and Play
              </h2>
            </div>
            <p style={{ color: '#a0a0a0', fontSize: '16px', lineHeight: '1.6' }}>
              Launch the WoW.exe application (not the launcher) and log in with your website credentials. Select your realm and start your adventure in Azeroth!
            </p>
          </div>

          <div style={{ 
            padding: '32px', 
            backgroundColor: 'rgba(212, 175, 55, 0.1)', 
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '8px'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#d4af37', marginBottom: '16px' }}>
              Need Help?
            </h3>
            <p style={{ color: '#a0a0a0', fontSize: '16px', lineHeight: '1.6', marginBottom: '16px' }}>
              If you encounter any issues connecting to the server, join our Discord community for live support from our staff team and fellow players.
            </p>
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
              Join Discord
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}