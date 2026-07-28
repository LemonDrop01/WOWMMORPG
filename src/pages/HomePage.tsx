import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Users, Server, Zap, Swords, ScrollText,
  ChevronRight, Activity, Globe, Star,
} from 'lucide-react';
import { supabase, type Realm, type NewsArticle, type ServerInfo } from '@/lib/supabase';
import RealmCard from '@/components/RealmCard';
import NewsCard from '@/components/NewsCard';

export default function HomePage() {
  const [realms, setRealms] = useState<Realm[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [info, setInfo] = useState<ServerInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [realmsRes, newsRes, infoRes] = await Promise.all([
        supabase.from('realms').select('*').order('display_order'),
        supabase.from('news').select('*').eq('is_published', true).order('published_at', { ascending: false }).limit(3),
        supabase.from('server_info').select('*').order('category, display_order'),
      ]);
      setRealms(realmsRes.data ?? []);
      setNews(newsRes.data ?? []);
      setInfo(infoRes.data ?? []);
      setLoading(false);
    })();
  }, []);

  const totalPlayers = realms.reduce((sum, r) => sum + r.players_online, 0);
  const onlineRealms = realms.filter((r) => r.online).length;
  const infoMap = Object.fromEntries(info.map((i) => [i.key, i.value]));

  const features = [
    { icon: Shield, title: 'Blizzlike Content', desc: 'Full Wrath of the Lich King 3.3.5a content with all quests, dungeons, and raids fully scripted.' },
    { icon: Swords, title: 'Active PvP', desc: 'Battlegrounds, arenas, and world PvP with regular arena seasons and rewards.' },
    { icon: Users, title: 'Growing Community', desc: 'Thousands of active players and a friendly, helpful community on Discord.' },
    { icon: Zap, title: 'Stable & Fast', desc: '99.9% uptime with dedicated hardware in Frankfurt, Germany for low latency.' },
    { icon: ScrollText, title: 'Regular Updates', desc: 'Continuous development with bug fixes, new content, and quality of life improvements.' },
    { icon: Star, title: 'Professional Staff', desc: 'Experienced GMs and developers who actively maintain and improve the server.' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg"
            alt="Fantasy landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-800/70 via-dark-700/60 to-dark-600" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-800/80 via-transparent to-dark-800/80" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 border border-gold-500/30 rounded-full bg-dark-700/60 backdrop-blur-sm animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-gold-300 text-sm font-display tracking-wide">
              {onlineRealms} Realms Online · {totalPlayers} Players In-Game
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-black text-gold-200 mb-6 animate-fade-in-up tracking-tight drop-shadow-2xl">
            Azeroth Eternal
          </h1>
          <p className="text-xl md:text-2xl text-stone-300 mb-3 font-display tracking-wide">
            Wrath of the Lich King · 3.3.5a
          </p>
          <p className="text-stone-400 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience the full Wrath of the Lich King expansion the way it was meant to be played.
            Blizzlike rates, fully scripted content, and an active community await you in Northrend.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-gold text-base px-8 py-4">
              Create Your Account
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link to="/connect" className="btn-ghost text-base px-8 py-4">
              How to Connect
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-dark-600 to-transparent" />
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-10 z-20 px-4">
        <div className="max-w-5xl mx-auto card p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="flex items-center justify-center mb-2">
                <Activity className="w-6 h-6 text-gold-400" />
              </div>
              <p className="font-display text-2xl md:text-3xl font-bold text-gold-300">
                {loading ? '—' : totalPlayers.toLocaleString()}
              </p>
              <p className="text-stone-500 text-xs uppercase tracking-wider mt-1">Players Online</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-gold-400" />
              </div>
              <p className="font-display text-2xl md:text-3xl font-bold text-gold-300">
                {loading ? '—' : (infoMap.total_accounts ?? '—')}
              </p>
              <p className="text-stone-500 text-xs uppercase tracking-wider mt-1">Total Accounts</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <Globe className="w-6 h-6 text-gold-400" />
              </div>
              <p className="font-display text-2xl md:text-3xl font-bold text-gold-300">
                {loading ? '—' : (infoMap.discord_members ?? '—')}
              </p>
              <p className="text-stone-500 text-xs uppercase tracking-wider mt-1">Discord Members</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <Server className="w-6 h-6 text-gold-400" />
              </div>
              <p className="font-display text-2xl md:text-3xl font-bold text-gold-300">
                {loading ? '—' : '99.9%'}
              </p>
              <p className="text-stone-500 text-xs uppercase tracking-wider mt-1">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Azeroth Eternal?</h2>
            <p className="section-subtitle">A premium blizzlike WotLK experience built by passionate developers</p>
            <div className="divider-gold max-w-xs mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="card card-hover p-6 animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 flex items-center justify-center bg-gold-500/10 border border-gold-500/20 rounded-lg mb-4">
                  <f.icon className="w-6 h-6 text-gold-400" />
                </div>
                <h3 className="font-display text-lg font-bold text-gold-200 mb-2">{f.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Realm Status Preview */}
      <section className="py-16 px-4 bg-dark-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="section-title">Realm Status</h2>
              <p className="section-subtitle">Check the status of all our game realms</p>
            </div>
            <Link to="/realms" className="hidden sm:flex items-center gap-1 text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="card p-6 animate-pulse h-56" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {realms.slice(0, 3).map((realm) => (
                <RealmCard key={realm.id} realm={realm} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link to="/realms" className="btn-ghost text-sm">View All Realms</Link>
          </div>
        </div>
      </section>

      {/* News Preview */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="section-title">Latest News</h2>
              <p className="section-subtitle">Stay up to date with server announcements</p>
            </div>
            <Link to="/news" className="hidden sm:flex items-center gap-1 text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors">
              All News <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="card h-80 animate-pulse" />
              ))}
            </div>
          ) : news.length === 0 ? (
            <p className="text-stone-500 text-center py-12">No news articles yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center card p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-ember-500/5" />
          <div className="relative z-10">
            <Shield className="w-12 h-12 text-gold-400 mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gold-200 mb-4">
              Ready to Begin Your Adventure?
            </h2>
            <p className="text-stone-400 mb-8 max-w-xl mx-auto">
              Create your free account in seconds and join thousands of players in Northrend.
              Your journey to the Frozen Throne starts here.
            </p>
            <Link to="/register" className="btn-gold text-base px-10 py-4">
              Create Free Account
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
