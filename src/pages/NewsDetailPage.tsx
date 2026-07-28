import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, AlertCircle, ChevronRight } from 'lucide-react';
import { supabase, type NewsArticle } from '@/lib/supabase';

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      if (!slug) return;
      const { data } = await supabase
        .from('news')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();
      if (!data) {
        setNotFound(true);
      } else {
        setArticle(data);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="card h-96 animate-pulse" />
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-ember-400 mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold text-gold-200 mb-2">Article Not Found</h1>
        <p className="text-stone-400 mb-6">This article may have been removed or never existed.</p>
        <Link to="/news" className="btn-ghost">
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>
      </div>
    );
  }

  const date = new Date(article.published_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="font-display text-xl font-bold text-gold-200 mt-6 mb-3">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="font-display text-lg font-semibold text-gold-300 mt-5 mb-2">{line.slice(4)}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="text-stone-300 ml-6 list-disc">{parseInline(line.slice(2))}</li>;
      }
      if (/^\d+\. /.test(line)) {
        return <li key={i} className="text-stone-300 ml-6 list-decimal">{parseInline(line.replace(/^\d+\. /, ''))}</li>;
      }
      if (line.trim() === '') {
        return <div key={i} className="h-3" />;
      }
      return <p key={i} className="text-stone-300 leading-relaxed">{parseInline(line)}</p>;
    });
  };

  const parseInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-gold-200 font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="text-gold-300 font-mono text-sm bg-dark-500/60 px-1.5 py-0.5 rounded-sm">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link to="/news" className="flex items-center gap-1 text-stone-400 hover:text-gold-300 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to News
      </Link>

      {article.image_url && (
        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-8">
          <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-600 via-dark-600/30 to-transparent" />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500 mb-4">
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gold-500/15 text-gold-400 border border-gold-500/30">
          {article.category}
        </span>
        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {date}</span>
        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {article.author}</span>
      </div>

      <h1 className="font-display text-3xl md:text-4xl font-bold text-gold-200 mb-4">{article.title}</h1>
      {article.excerpt && (
        <p className="text-stone-400 text-lg leading-relaxed mb-6 italic border-l-2 border-gold-500/30 pl-4">
          {article.excerpt}
        </p>
      )}

      <div className="divider-gold mb-8" />

      <div className="space-y-1">
        {article.content ? renderContent(article.content) : <p className="text-stone-500">No content available.</p>}
      </div>

      <div className="divider-gold my-10" />

      <Link to="/news" className="btn-ghost">
        <ArrowLeft className="w-4 h-4" /> All News
        <ChevronRight className="w-4 h-4 opacity-0" />
      </Link>
    </div>
  );
}
