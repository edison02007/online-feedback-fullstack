const { pool } = require('../models/Feedback');
const path = require('path');
const fs   = require('fs');

// DELETE /api/feedback/:id
const deleteFeedback = async (req, res, next) => {
  try {
    const existing = await pool.query(
      'SELECT * FROM feedbacks WHERE id = $1',
      [req.params.id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }

    const feedback = existing.rows[0];

    // Delete attached file from disk if exists
    if (feedback.file) {
      const filePath = path.join(__dirname, '..', 'uploads', feedback.file);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await pool.query('DELETE FROM feedbacks WHERE id = $1', [req.params.id]);

    res.status(200).json({ success: true, message: 'Feedback deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = deleteFeedback;
