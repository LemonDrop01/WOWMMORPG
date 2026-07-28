import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);

    if (error) {
      setError(error);
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/account'), 1500);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="card p-10 max-w-md text-center animate-fade-in-up">
          <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-gold-200 mb-2">Account Created!</h2>
          <p className="text-stone-400">Redirecting you to your account dashboard...</p>
          <Loader2 className="w-6 h-6 text-gold-400 mx-auto mt-4 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="w-12 h-12 text-gold-400 mx-auto mb-3" />
          <h1 className="font-display text-3xl font-bold text-gold-200">Create Your Account</h1>
          <p className="text-stone-400 mt-2">Join the Azeroth Eternal community</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-5">
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gold-300 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="adventurer@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gold-300 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-10"
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-gold-400"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gold-300 mb-1.5">Confirm Password</label>
            <input
              type={showPw ? 'text' : 'password'}
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="input-field"
              placeholder="Re-enter your password"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Creating Account...</>
            ) : (
              'Create Account'
            )}
          </button>

          <p className="text-xs text-stone-500 text-center leading-relaxed">
            By creating an account you agree to follow our server rules.
            Your website login is the same as your in-game account login.
          </p>
        </form>

        <p className="text-center text-stone-400 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-gold-400 hover:text-gold-300 font-medium">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
