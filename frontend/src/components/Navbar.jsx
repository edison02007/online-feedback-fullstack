import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Navbar() {
  const { dark, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <div className="nav-brand">
          <span className="nav-logo">💬</span>
          <span>FeedbackPro</span>
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(o => !o)}>
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>🏠 Home</NavLink>
          <NavLink to="/admin" onClick={() => setMenuOpen(false)}>📊 Dashboard</NavLink>
          <button className="theme-toggle" onClick={toggle} title="Toggle dark mode">
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}
