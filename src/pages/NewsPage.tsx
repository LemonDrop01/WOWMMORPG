import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, type NewsArticle } from '@/lib/supabase';

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from('news').select('*').eq('is_published', true).order('published_at', { ascending: false });
        if (error) throw error;
        setNews(data ?? []);
      } catch (err) {
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ padding: '40px 20px', color: 'white' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#d4af37', marginBottom: '16px' }}>
            News & Updates
          </h1>
          <p style={{ color: '#a0a0a0', fontSize: '18px' }}>
            Stay updated with the latest server announcements and updates
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gap: '24px' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ 
                padding: '32px', 
                backgroundColor: 'rgba(30, 30, 33, 0.8)', 
                border: '1px solid rgba(212, 175, 55, 0.15)',
                borderRadius: '8px',
                height: '200px'
              }} />
            ))}
          </div>
        ) : news.length === 0 ? (
          <div style={{ 
            padding: '48px', 
            textAlign: 'center', 
            backgroundColor: 'rgba(30, 30, 33, 0.8)', 
            border: '1px solid rgba(212, 175, 55, 0.15)',
            borderRadius: '8px'
          }}>
            <p style={{ color: '#a0a0a0', fontSize: '16px' }}>
              No news articles published yet. Check back soon for updates!
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '24px' }}>
            {news.map((article) => (
              <Link 
                key={article.id} 
                to={`/news/${article.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{ 
                  padding: '32px', 
                  backgroundColor: 'rgba(30, 30, 33, 0.8)', 
                  border: '1px solid rgba(212, 175, 55, 0.15)',
                  borderRadius: '8px',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ 
                      display: 'inline-block',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '600',
                      backgroundColor: 'rgba(212, 175, 55, 0.2)',
                      color: '#d4af37',
                      marginBottom: '12px'
                    }}>
                      {article.category}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#e5c56d', marginBottom: '12px' }}>
                    {article.title}
                  </h2>

                  {article.excerpt && (
                    <p style={{ color: '#a0a0a0', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
                      {article.excerpt}
                    </p>
                  )}

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingTop: '20px',
                    borderTop: '1px solid rgba(212, 175, 55, 0.1)',
                    fontSize: '14px',
                    color: '#606060'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#a0a0a0' }}>{article.author}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span>{new Date(article.published_at).toLocaleDateString()}</span>
                      <span style={{ color: '#d4af37' }}>Read more →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}