import React, { useState } from 'react';
import StarRating from '../components/StarRating.jsx';
import { useToast } from '../context/ToastContext.jsx';

const TAGS = ['UI', 'Performance', 'Bug', 'Suggestion', 'Feature', 'Other'];
const MAX_CHARS = 500;
const INITIAL = { name: '', email: '', type: 'general', message: '', rating: 0, tags: [], file: null };

function validate(data) {
  if (!data.name.trim()) return 'Full name is required.';
  if (!data.email.trim()) return 'Email address is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'Please enter a valid email address.';
  if (!data.rating) return 'Please select a star rating.';
  if (!data.message.trim()) return 'Message cannot be empty.';
  if (data.message.length > MAX_CHARS) return `Message must be under ${MAX_CHARS} characters.`;
  return null;
}

export default function FeedbackForm() {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { addToast } = useToast();

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const toggleTag = (tag) =>
    set('tags', form.tags.includes(tag) ? form.tags.filter(t => t !== tag) : [...form.tags, tag]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      addToast('File size must be under 2MB.', 'error');
      return;
    }
    set('file', file ? file.name : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate(form);
    if (error) { addToast(error, 'error'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1000)); // simulate API call

    const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    feedbacks.push({ ...form, id: Date.now(), date: new Date().toISOString(), status: 'new' });
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

    setLoading(false);
    setForm(INITIAL);
    addToast('Feedback submitted successfully! Thank you 🎉', 'success');
  };

  const charCount = form.message.length;
  const charOver = charCount > MAX_CHARS;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Share Your Feedback</h2>
        <p>Help us improve by sharing your thoughts, suggestions, or issues.</p>
      </div>

      <div className="card animate-in">
        <form onSubmit={handleSubmit} noValidate>

          {/* Name & Email */}
          <div className="form-row">
            <div className="form-group">
              <label>Full Name <span className="required">*</span></label>
              <input
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Email Address <span className="required">*</span></label>
              <input
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
          </div>

          {/* Type */}
          <div className="form-group">
            <label>Feedback Type <span className="required">*</span></label>
            <select value={form.type} onChange={e => set('type', e.target.value)}>
              <option value="general">💬 General</option>
              <option value="bug">🐛 Bug Report</option>
              <option value="suggestion">💡 Suggestion</option>
              <option value="compliment">⭐ Compliment</option>
            </select>
          </div>

          {/* Star Rating */}
          <div className="form-group">
            <label>Overall Rating <span className="required">*</span></label>
            <StarRating value={form.rating} onChange={v => set('rating', v)} />
          </div>

          {/* Category Tags */}
          <div className="form-group">
            <label>Category Tags</label>
            <div className="tag-group">
              {TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-btn ${form.tags.includes(tag) ? 'tag-active' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="form-group">
            <label>
              Message <span className="required">*</span>
              <span className={`char-counter ${charOver ? 'over' : ''}`}>
                {charCount}/{MAX_CHARS}
              </span>
            </label>
            <textarea
              placeholder="Describe your feedback in detail..."
              value={form.message}
              onChange={e => set('message', e.target.value)}
              className={charOver ? 'input-error' : ''}
            />
          </div>

          {/* File Upload */}
          <div className="form-group">
            <label>Attach Screenshot <span className="optional">(optional, max 2MB)</span></label>
            <div className="file-upload">
              <label className="file-label">
                📎 {form.file ? form.file : 'Choose file...'}
                <input type="file" accept="image/*" onChange={handleFile} hidden />
              </label>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? <span className="spinner" /> : '🚀 Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
}
