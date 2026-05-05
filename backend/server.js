require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const { createTable } = require('./models/Feedback');
const errorHandler    = require('./middleware/errorHandler');

const app = express();

// ── Middleware ──
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static uploads folder ──
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ──
app.use('/api/feedback', require('./routes/feedback'));

// ── Health check ──
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Feedback System API is running (PostgreSQL)' });
});

// ── 404 handler ──
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
});

// ── Error handler ──
app.use(errorHandler);

// ── Connect to PostgreSQL and start server ──
const PORT = process.env.PORT || 5000;

createTable()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ PostgreSQL connection failed:', err.message);
    process.exit(1);
  });
