import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { useToast } from '../context/ToastContext.jsx';

const TYPE_ICON  = { general: '💬', bug: '🐛', suggestion: '💡', compliment: '⭐' };
const TYPE_BADGE = { general: 'badge-general', bug: 'badge-bug', suggestion: 'badge-suggestion', compliment: 'badge-compliment' };
const PIE_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

export default function AdminDashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [search, setSearch]       = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy]       = useState('date-desc');
  const [editId, setEditId]       = useState(null);
  const [editMsg, setEditMsg]     = useState('');
  const [tab, setTab]             = useState('table');
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => { load(); }, []);

  const load = () => {
    const data = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    setFeedbacks(data);
  };

  const save = (updated) => {
    localStorage.setItem('feedbacks', JSON.stringify(updated));
    setFeedbacks(updated);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    save(feedbacks.filter(f => f.id !== id));
    addToast('Feedback deleted.', 'error');
  };

  const startEdit = (fb) => { setEditId(fb.id); setEditMsg(fb.message); };

  const saveEdit = (id) => {
    save(feedbacks.map(f => f.id === id ? { ...f, message: editMsg } : f));
    setEditId(null);
    addToast('Feedback updated successfully.', 'success');
  };

  const filtered = useMemo(() => {
    let list = [...feedbacks];
    if (typeFilter !== 'all') list = list.filter(f => f.type === typeFilter);
    if (ratingFilter !== 'all') list = list.filter(f => f.rating === Number(ratingFilter));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.email.toLowerCase().includes(q) ||
        f.message.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-asc')  return new Date(a.date) - new Date(b.date);
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      if (sortBy === 'rating-asc')  return a.rating - b.rating;
      return 0;
    });
    return list;
  }, [feedbacks, typeFilter, ratingFilter, search, sortBy]);

  // Analytics data
  const typeData = useMemo(() => {
    const counts = {};
    feedbacks.forEach(f => { counts[f.type] = (counts[f.type] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [feedbacks]);

  const ratingData = useMemo(() =>
    [1,2,3,4,5].map(r => ({
      rating: `${r}★`,
      count: feedbacks.filter(f => f.rating === r).length
    })), [feedbacks]);

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + (f.rating || 0), 0) / feedbacks.length).toFixed(1)
    : '—';

  const count = (type) => feedbacks.filter(f => f.type === type).length;

  return (
    <div className="page-wide">
      <div className="page-header">
        <h2>Admin Dashboard</h2>
        <p>Monitor, manage, and analyze all submitted feedback.</p>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="stat-card stat-blue">
          <div className="stat-number">{feedbacks.length}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card stat-yellow">
          <div className="stat-number">{avgRating}</div>
          <div className="stat-label">Avg Rating</div>
        </div>
        <div className="stat-card stat-red">
          <div className="stat-number">{count('bug')}</div>
          <div className="stat-label">Bug Reports</div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-number">{count('suggestion')}</div>
          <div className="stat-label">Suggestions</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        <button className={`tab-btn ${tab === 'table' ? 'tab-active' : ''}`} onClick={() => setTab('table')}>
          📋 Feedback Table
        </button>
        <button className={`tab-btn ${tab === 'analytics' ? 'tab-active' : ''}`} onClick={() => setTab('analytics')}>
          📊 Analytics
        </button>
      </div>

      {tab === 'table' && (
        <>
          {/* Controls */}
          <div className="controls-bar">
            <input
              className="search-input"
              type="text"
              placeholder="🔍 Search by name, email or message..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              <option value="general">💬 General</option>
              <option value="bug">🐛 Bug</option>
              <option value="suggestion">💡 Suggestion</option>
              <option value="compliment">⭐ Compliment</option>
            </select>
            <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)}>
              <option value="all">All Ratings</option>
              {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ★</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="rating-desc">Highest Rating</option>
              <option value="rating-asc">Lowest Rating</option>
            </select>
            <button className="btn-refresh" onClick={load}>↻ Refresh</button>
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No feedback found.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="feedback-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Rating</th>
                    <th>Tags</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((fb, i) => (
                    <tr key={fb.id} className="table-row animate-in">
                      <td className="td-num">{i + 1}</td>
                      <td className="td-name">{fb.name}</td>
                      <td className="td-email">{fb.email}</td>
                      <td>
                        <span className={`feedback-type-badge ${TYPE_BADGE[fb.type] || 'badge-general'}`}>
                          {TYPE_ICON[fb.type]} {fb.type}
                        </span>
                      </td>
                      <td>
                        <span className="table-stars">
                          {'★'.repeat(fb.rating || 0)}{'☆'.repeat(5 - (fb.rating || 0))}
                        </span>
                      </td>
                      <td>
                        <div className="tag-group" style={{ flexWrap: 'wrap', gap: '4px' }}>
                          {fb.tags?.slice(0, 2).map(t => (
                            <span key={t} className="tag-btn tag-active" style={{ fontSize: '11px', padding: '2px 8px' }}>{t}</span>
                          ))}
                          {fb.tags?.length > 2 && <span className="tag-btn">+{fb.tags.length - 2}</span>}
                        </div>
                      </td>
                      <td className="td-date">
                        {new Date(fb.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-action btn-view" onClick={() => navigate(`/feedback/${fb.id}`)}>👁</button>
                          <button className="btn-action btn-edit" onClick={() => startEdit(fb)}>✏️</button>
                          <button className="btn-action btn-del"  onClick={() => handleDelete(fb.id)}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Inline Edit Modal */}
          {editId && (
            <div className="modal-overlay" onClick={() => setEditId(null)}>
              <div className="modal" onClick={e => e.stopPropagation()}>
                <h3>Edit Feedback Message</h3>
                <textarea
                  value={editMsg}
                  onChange={e => setEditMsg(e.target.value)}
                  rows={5}
                  style={{ width: '100%', marginTop: '12px' }}
                />
                <div className="modal-actions">
                  <button className="btn-submit" style={{ width: 'auto', padding: '10px 24px' }} onClick={() => saveEdit(editId)}>
                    Save Changes
                  </button>
                  <button className="btn-refresh" onClick={() => setEditId(null)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {tab === 'analytics' && (
        <div className="analytics-grid">
          <div className="chart-card">
            <h3>Feedback by Type</h3>
            {typeData.length === 0 ? <p className="no-data">No data yet.</p> : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={typeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {typeData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="chart-card">
            <h3>Rating Distribution</h3>
            {feedbacks.length === 0 ? <p className="no-data">No data yet.</p> : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={ratingData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="rating" tick={{ fill: 'var(--text-muted)', fontSize: 13 }} />
                  <YAxis allowDecimals={false} tick={{ fill: 'var(--text-muted)', fontSize: 13 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="chart-card chart-full">
            <h3>Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-val">{feedbacks.length}</span>
                <span className="summary-label">Total Submissions</span>
              </div>
              <div className="summary-item">
                <span className="summary-val">{avgRating} ⭐</span>
                <span className="summary-label">Average Rating</span>
              </div>
              <div className="summary-item">
                <span className="summary-val">{count('bug')}</span>
                <span className="summary-label">Bug Reports</span>
              </div>
              <div className="summary-item">
                <span className="summary-val">{count('suggestion')}</span>
                <span className="summary-label">Suggestions</span>
              </div>
              <div className="summary-item">
                <span className="summary-val">{count('compliment')}</span>
                <span className="summary-label">Compliments</span>
              </div>
              <div className="summary-item">
                <span className="summary-val">{count('general')}</span>
                <span className="summary-label">General</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
