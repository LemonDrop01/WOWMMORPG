import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 20px', color: 'white' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#d4af37', marginBottom: '16px' }}>
            Sign In
          </h1>
          <p style={{ color: '#a0a0a0', fontSize: '16px' }}>
            Welcome back to Azeroth Eternal
          </p>
        </div>

        {error && (
          <div style={{ 
            padding: '16px', 
            backgroundColor: 'rgba(239, 68, 68, 0.2)', 
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '6px',
            marginBottom: '24px',
            fontSize: '14px',
            color: '#fca5a5'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#a0a0a0' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'rgba(30, 30, 33, 0.8)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '4px',
                color: 'white',
                fontSize: '14px',
                opacity: loading ? 0.5 : 1
              }}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#a0a0a0' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'rgba(30, 30, 33, 0.8)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '4px',
                color: 'white',
                fontSize: '14px',
                opacity: loading ? 0.5 : 1
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 24px',
              backgroundColor: '#d4af37',
              color: '#0f0f10',
              border: 'none',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              borderRadius: '4px',
              fontSize: '16px',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#a0a0a0' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#d4af37', textDecoration: 'none' }}>
            Create one
          </Link>
        </div>

        <div style={{ 
          marginTop: '32px', 
          padding: '16px', 
          backgroundColor: 'rgba(212, 175, 55, 0.1)', 
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#a0a0a0'
        }}>
          <strong style={{ color: '#d4af37' }}>Trouble logging in?</strong> Make sure:<br/>
          • Email confirmation is completed (if enabled)<br/>
          • You're using the correct email and password<br/>
          • Email authentication is enabled in Supabase
        </div>
      </div>
    </div>
  );
}