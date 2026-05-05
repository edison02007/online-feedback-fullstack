import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const TYPE_ICON = { general: '💬', bug: '🐛', suggestion: '💡', compliment: '⭐' };
const BADGE = { general: 'badge-general', bug: 'badge-bug', suggestion: 'badge-suggestion', compliment: 'badge-compliment' };

export default function FeedbackDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fb, setFb] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch from backend instead of localStorage
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch(`${API_URL}/api/feedback/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setFb(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [id]);

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: '60px' }}>
        <p>Loading...</p>
      </div>
    );
  }

  // ❌ Not found
  if (!fb) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: '60px' }}>
      <div style={{ fontSize: '48px' }}>🔍</div>
      <h3 style={{ marginTop: '16px' }}>Feedback not found.</h3>
      <button className="btn-back" onClick={() => navigate('/admin')} style={{ marginTop: '20px' }}>
        ← Back to Dashboard
      </button>
    </div>
  );

  return (
    <div className="page">
      <button className="btn-back" onClick={() => navigate('/admin')}>← Back to Dashboard</button>

      <div className="card animate-in" style={{ marginTop: '20px' }}>
        <div className="detail-header">
          <div>
            <h2 className="detail-name">{fb.name}</h2>
            <p className="detail-email">📧 {fb.email}</p>
          </div>
          <span className={`feedback-type-badge ${BADGE[fb.type] || 'badge-general'}`}>
            {TYPE_ICON[fb.type]} {fb.type.charAt(0).toUpperCase() + fb.type.slice(1)}
          </span>
        </div>

        <div className="detail-meta">
          <div className="meta-item">
            <span className="meta-label">📅 Submitted</span>
            <span>{new Date(fb.created_at).toLocaleString()}</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">⭐ Rating</span>
            <span className="detail-stars">
              {[1,2,3,4,5].map(s => (
                <span key={s} className={s <= fb.rating ? 'star-filled' : 'star-empty'}>★</span>
              ))}
              <span style={{ marginLeft: '6px', fontSize: '14px', color: 'var(--text-muted)' }}>
                ({fb.rating}/5)
              </span>
            </span>
          </div>

          {fb.tags?.length > 0 && (
            <div className="meta-item">
              <span className="meta-label">🏷️ Tags</span>
              <div className="tag-group">
                {fb.tags.map(tag => (
                  <span key={tag} className="tag-btn tag-active">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {fb.file && (
            <div className="meta-item">
              <span className="meta-label">📎 Attachment</span>
              <span>{fb.file}</span>
            </div>
          )}
        </div>

        <div className="detail-message">
          <h4>Message</h4>
          <p>{fb.message}</p>
        </div>
      </div>
    </div>
  );
}