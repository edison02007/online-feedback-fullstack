import React, { useState } from 'react';

export default function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          className={`star ${star <= (hovered || value) ? 'filled' : ''}`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
        >
          ★
        </button>
      ))}
      <span className="star-label">
        {value ? ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][value] : 'Select rating'}
      </span>
    </div>
  );
}
