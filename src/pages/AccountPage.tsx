import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  Shield, Mail, Calendar, Server, Plus, Loader2, AlertCircle,
  CheckCircle2, Gamepad2, Clock,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase, type GameAccount, type Realm } from '@/lib/supabase';

export default function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const [gameAccounts, setGameAccounts] = useState<GameAccount[]>([]);
  const [realms, setRealms] = useState<Realm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newExpansion, setNewExpansion] = useState('WotLK 3.3.5a');
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    const [accRes, realmRes] = await Promise.all([
      supabase.from('game_accounts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('realms').select('*').order('display_order'),
    ]);
    setGameAccounts(accRes.data ?? []);
    setRealms(realmRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!user) return;
    if (newName.trim().length < 3) {
      setFormError('Account name must be at least 3 characters.');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(newName.trim())) {
      setFormError('Account name can only contain letters, numbers, and underscores.');
      return;
    }
    setFormLoading(true);
    const { error } = await supabase
      .from('game_accounts')
      .insert({ account_name: newName.trim(), expansion: newExpansion });
    setFormLoading(false);
    if (error) {
      setFormError(error.message);
    } else {
      setNewName('');
      setShowForm(false);
      fetchData();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* Profile Header */}
      <div className="card p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 flex items-center justify-center bg-gold-500/10 border border-gold-500/30 rounded-lg flex-shrink-0">
            <Shield className="w-10 h-10 text-gold-400" />
          </div>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-gold-200 mb-1">My Account</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-stone-400">
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user.email}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Member since {memberSince}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-sm">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Active</span>
          </div>
        </div>
      </div>

      {/* Game Accounts */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-gold-200 flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-gold-400" />
            Game Accounts
          </h2>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 text-sm text-gold-400 hover:text-gold-300 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Account
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="card p-6 mb-4 animate-fade-in-up">
            {formError && (
              <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 text-sm mb-4">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gold-300 mb-1.5">Account Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="input-field"
                  placeholder="Your in-game account name"
                  maxLength={32}
                />
                <p className="text-xs text-stone-500 mt-1">Letters, numbers, and underscores only.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gold-300 mb-1.5">Expansion</label>
                <select
                  value={newExpansion}
                  onChange={(e) => setNewExpansion(e.target.value)}
                  className="input-field"
                >
                  <option>WotLK 3.3.5a</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button type="submit" disabled={formLoading} className="btn-gold text-sm py-2.5 disabled:opacity-50">
                {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setFormError(null); setNewName(''); }}
                className="btn-ghost text-sm py-2.5"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="card p-6 animate-pulse h-24" />
        ) : gameAccounts.length === 0 ? (
          <div className="card p-8 text-center">
            <Gamepad2 className="w-10 h-10 text-stone-600 mx-auto mb-3" />
            <p className="text-stone-400 mb-2">You don't have any game accounts yet.</p>
            <p className="text-stone-500 text-sm">Create one to register it on the game server.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {gameAccounts.map((acc) => (
              <div key={acc.id} className="card p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-frost-500/10 border border-frost-500/20 rounded-lg">
                    <Gamepad2 className="w-5 h-5 text-frost-300" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-gold-200">{acc.account_name}</p>
                    <p className="text-stone-500 text-xs">{acc.expansion}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-stone-400 text-xs flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {new Date(acc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Realm Quick Access */}
      <div>
        <h2 className="font-display text-xl font-bold text-gold-200 flex items-center gap-2 mb-4">
          <Server className="w-5 h-5 text-gold-400" />
          Realm Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {realms.map((realm) => (
            <div key={realm.id} className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${realm.online ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                <div>
                  <p className="font-display font-medium text-gold-200 text-sm">{realm.name}</p>
                  <p className="text-stone-500 text-xs">{realm.expansion} · {realm.type}</p>
                </div>
              </div>
              <span className="text-stone-400 text-sm">{realm.players_online} online</span>
            </div>
          ))}
        </div>
        <Link to="/realms" className="block text-center text-gold-400 hover:text-gold-300 text-sm mt-4 transition-colors">
          View Full Realm Status →
        </Link>
      </div>

      {/* Connection Reminder */}
      <div className="card p-6 mt-8 bg-dark-300/50">
        <h3 className="font-display font-bold text-gold-300 mb-2">How to Play</h3>
        <p className="text-stone-400 text-sm leading-relaxed mb-3">
          Set your realmlist to <code className="text-gold-300 font-mono bg-dark-500/60 px-1.5 py-0.5 rounded-sm">set realmlist logon.azeroth-eternal.com</code> in your WoW 3.3.5a client, then log in with your website email and password.
        </p>
        <Link to="/connect" className="text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors">
          Full Connection Guide →
        </Link>
      </div>
    </div>
  );
}
