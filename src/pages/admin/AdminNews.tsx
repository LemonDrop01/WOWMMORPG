import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, type NewsArticle } from '@/lib/supabase';
import { isAdmin } from '@/lib/admin';

export default function AdminNews() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_published: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const adminCheck = await isAdmin();
      setIsAuthorized(adminCheck);
      
      if (adminCheck) {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('published_at', { ascending: false });
        if (error) console.error('Error fetching news:', error);
        else setNews(data ?? []);
      }
      
      setLoading(false);
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('news').insert({
        title: formData.title,
        content: formData.content,
        is_published: formData.is_published,
        published_at: new Date().toISOString()
      });

      if (error) throw error;

      setFormData({ title: '', content: '', is_published: true });
      setShowForm(false);
      
      // Refresh news list
      const { data } = await supabase.from('news').select('*').order('published_at', { ascending: false });
      setNews(data ?? []);
    } catch (error) {
      console.error('Error creating news:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) throw error;
      
      const { data } = await supabase.from('news').select('*').order('published_at', { ascending: false });
      setNews(data ?? []);
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: 'white' }}>Loading...</div>;
  if (!isAuthorized) return <div style={{ padding: '40px', color: 'white' }}>Access Denied</div>;

  return (
    <div style={{ padding: '40px 20px', color: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#d4af37', marginBottom: '16px' }}>
              Manage News
            </h1>
            <p style={{ color: '#a0a0a0', fontSize: '18px' }}>
              Create and manage news articles
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: '12px 24px',
                backgroundColor: '#d4af37',
                color: '#0f0f10',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {showForm ? 'Cancel' : '+ Create News'}
            </button>
            <button
              onClick={() => navigate('/admin')}
              style={{
                padding: '12px 24px',
                backgroundColor: 'transparent',
                color: '#d4af37',
                border: '1px solid #d4af37',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Back to Admin
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{
            padding: '32px',
            backgroundColor: 'rgba(30, 30, 33, 0.8)',
            border: '1px solid rgba(212, 175, 55, 0.15)',
            borderRadius: '8px',
            marginBottom: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#d4af37', marginBottom: '8px' }}>
              Create New Article
            </h3>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#a0a0a0' }}>
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(30, 30, 33, 0.8)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#a0a0a0' }}>
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                required
                rows={6}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(30, 30, 33, 0.8)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="published"
                checked={formData.is_published}
                onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                style={{ width: '16px', height: '16px' }}
              />
              <label htmlFor="published" style={{ fontSize: '14px', color: '#a0a0a0' }}>
                Publish immediately
              </label>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#d4af37',
                  color: '#0f0f10',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Create Article
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'transparent',
                  color: '#a0a0a0',
                  border: '1px solid #606060',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div style={{ display: 'grid', gap: '24px' }}>
          {news.map((article) => (
            <div key={article.id} style={{
              padding: '24px',
              backgroundColor: 'rgba(30, 30, 33, 0.8)',
              border: '1px solid rgba(212, 175, 55, 0.15)',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#d4af37' }}>
                    {article.title}
                  </h3>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    backgroundColor: article.is_published ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: article.is_published ? '#4ade80' : '#ef4444'
                  }}>
                    {article.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: '1.6', marginBottom: '12px' }}>
                  {article.content}
                </p>
                <div style={{ fontSize: '12px', color: '#606060' }}>
                  Published: {new Date(article.published_at).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => handleDelete(article.id)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  color: '#ef4444',
                  border: '1px solid #ef4444',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  marginLeft: '16px'
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}