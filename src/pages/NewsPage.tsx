import { useEffect, useState } from 'react';
import { Newspaper } from 'lucide-react';
import { supabase, type NewsArticle } from '@/lib/supabase';
import NewsCard from '@/components/NewsCard';

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      setArticles(data ?? []);
      setLoading(false);
    })();
  }, []);

  const categories = ['All', ...Array.from(new Set(articles.map((a) => a.category)))];
  const filtered = filter === 'All' ? articles : articles.filter((a) => a.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <Newspaper className="w-12 h-12 text-gold-400 mx-auto mb-4" />
        <h1 className="font-display text-4xl font-bold text-gold-200">News & Updates</h1>
        <p className="text-stone-400 mt-3">Latest announcements, updates, and events from Azeroth Eternal</p>
        <div className="divider-gold max-w-xs mx-auto mt-6" />
      </div>

      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 text-sm font-display font-medium rounded-sm transition-all ${
                filter === cat
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40'
                  : 'text-stone-400 border border-gold-500/15 hover:text-gold-300 hover:border-gold-500/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="card h-80 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-stone-500 text-center py-12">No articles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
