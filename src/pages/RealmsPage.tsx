import { useEffect, useState } from 'react';
import { Server, RefreshCw } from 'lucide-react';
import { supabase, type Realm } from '@/lib/supabase';
import RealmCard from '@/components/RealmCard';

export default function RealmsPage() {
  const [realms, setRealms] = useState<Realm[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRealms = async () => {
    setLoading(true);
    const { data } = await supabase.from('realms').select('*').order('display_order');
    setRealms(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRealms();
  }, []);

  const totalOnline = realms.reduce((sum, r) => sum + r.players_online, 0);
  const onlineCount = realms.filter((r) => r.online).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <Server className="w-12 h-12 text-gold-400 mx-auto mb-4" />
        <h1 className="font-display text-4xl font-bold text-gold-200">Realm Status</h1>
        <p className="text-stone-400 mt-3">Live status of all Azeroth Eternal game realms</p>
        <div className="divider-gold max-w-xs mx-auto mt-6" />
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="card p-5 text-center">
          <p className="font-display text-2xl font-bold text-gold-300">{onlineCount} / {realms.length || '—'}</p>
          <p className="text-stone-500 text-xs uppercase tracking-wider mt-1">Realms Online</p>
        </div>
        <div className="card p-5 text-center">
          <p className="font-display text-2xl font-bold text-gold-300">{loading ? '—' : totalOnline.toLocaleString()}</p>
          <p className="text-stone-500 text-xs uppercase tracking-wider mt-1">Players In-Game</p>
        </div>
        <div className="card p-5 text-center">
          <p className="font-display text-2xl font-bold text-gold-300">{realms.length || '—'}</p>
          <p className="text-stone-500 text-xs uppercase tracking-wider mt-1">Total Realms</p>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={fetchRealms}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="card p-6 animate-pulse h-56" />
          ))}
        </div>
      ) : realms.length === 0 ? (
        <p className="text-stone-500 text-center py-12">No realms found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {realms.map((realm) => (
            <RealmCard key={realm.id} realm={realm} />
          ))}
        </div>
      )}
    </div>
  );
}
