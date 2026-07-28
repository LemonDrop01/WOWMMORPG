import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import type { NewsArticle } from '@/lib/supabase';

const categoryColors: Record<string, string> = {
  Announcement: 'bg-gold-500/15 text-gold-400 border-gold-500/30',
  Update: 'bg-frost-500/15 text-frost-300 border-frost-500/30',
  Event: 'bg-ember-500/15 text-ember-400 border-ember-500/30',
  Maintenance: 'bg-red-500/15 text-red-400 border-red-500/30',
};

export default function NewsCard({ article }: { article: NewsArticle }) {
  const date = new Date(article.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link to={`/news/${article.slug}`} className="card card-hover group flex flex-col">
      {article.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-300 via-dark-300/40 to-transparent" />
          <span
            className={`absolute top-3 left-3 px-3 py-1 text-xs font-medium rounded-full border backdrop-blur-sm ${
              categoryColors[article.category] ?? categoryColors.Announcement
            }`}
          >
            {article.category}
          </span>
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
          <Calendar className="w-3.5 h-3.5" />
          {date}
          <span className="text-stone-600">·</span>
          <span>{article.author}</span>
        </div>
        <h3 className="font-display text-lg font-bold text-gold-200 mb-2 group-hover:text-gold-300 transition-colors">
          {article.title}
        </h3>
        <p className="text-stone-400 text-sm leading-relaxed line-clamp-2 flex-1">
          {article.excerpt}
        </p>
        <span className="flex items-center gap-1 text-gold-400 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
          Read More
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
