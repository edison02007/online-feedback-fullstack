import React, { useState } from 'react';
import StarRating from '../components/StarRating.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { API_URL } from '../config';

const TAGS = ['UI', 'Performance', 'Bug', 'Suggestion', 'Feature', 'Other'];
const MAX_CHARS = 500;

const INITIAL = {
  name: '',
  email: '',
  type: 'general',
  message: '',
  rating: 0,
  tags: [],
  file: null
};

function validate(data) {
  if (!data.name.trim()) return 'Full name is required.';
  if (!data.email.trim()) return 'Email address is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'Invalid email.';
  if (!data.rating) return 'Select rating.';
  if (!data.message.trim()) return 'Message required.';
  if (data.message.length > MAX_CHARS) return 'Too long message.';
  return null;
}

export default function FeedbackForm() {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const toggleTag = (tag) =>
    set('tags', form.tags.includes(tag)
      ? form.tags.filter(t => t !== tag)
      : [...form.tags, tag]
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate(form);
    if (error) return addToast(error, 'error');

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error();

      setForm(INITIAL);
      addToast('Submitted successfully!', 'success');

    } catch {
      addToast('Submission failed', 'error');
    }

    setLoading(false);
  };

  return (
    <div className="page">
      <h2>Feedback</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => set('name', e.target.value)}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={e => set('email', e.target.value)}
        />

        <select value={form.type} onChange={e => set('type', e.target.value)}>
          <option value="general">General</option>
          <option value="bug">Bug</option>
          <option value="suggestion">Suggestion</option>
        </select>

        <StarRating value={form.rating} onChange={v => set('rating', v)} />

        <textarea
          placeholder="Message"
          value={form.message}
          onChange={e => set('message', e.target.value)}
        />

        <button type="submit">
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}