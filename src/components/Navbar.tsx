import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Shield, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/realms', label: 'Realms' },
    { to: '/news', label: 'News' },
    { to: '/connect', label: 'How to Connect' },
  ];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-dark-700/95 backdrop-blur-md border-b border-gold-500/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
            <Shield className="w-7 h-7 text-gold-400 group-hover:text-gold-300 transition-colors" />
            <span className="font-display font-bold text-lg text-gold-300 tracking-wide">
              Azeroth Eternal
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 font-display text-sm font-medium tracking-wide rounded-sm transition-all ${
                  isActive(link.to)
                    ? 'text-gold-300 bg-gold-500/10'
                    : 'text-stone-400 hover:text-gold-300 hover:bg-gold-500/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/account"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-display font-medium text-gold-300 border border-gold-500/30 rounded-sm hover:bg-gold-500/10 transition-all"
                >
                  <UserIcon className="w-4 h-4" />
                  My Account
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-display font-medium text-stone-400 hover:text-ember-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-display font-medium text-stone-300 hover:text-gold-300 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="btn-gold text-sm py-2">
                  Create Account
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-gold-300 p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-gold-500/20 bg-dark-700">
          <div className="px-4 py-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 font-display text-sm font-medium rounded-sm ${
                  isActive(link.to)
                    ? 'text-gold-300 bg-gold-500/10'
                    : 'text-stone-400 hover:text-gold-300 hover:bg-gold-500/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="divider-gold my-2" />
            {user ? (
              <>
                <Link
                  to="/account"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 font-display text-sm font-medium text-gold-300"
                >
                  My Account
                </Link>
                <button
                  onClick={() => { setOpen(false); handleSignOut(); }}
                  className="block w-full text-left px-4 py-3 font-display text-sm font-medium text-stone-400"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 font-display text-sm font-medium text-stone-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 font-display text-sm font-medium text-gold-300"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
