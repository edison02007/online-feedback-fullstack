const { pool } = require('../models/Feedback');

// PUT /api/feedback/:id
const updateFeedback = async (req, res, next) => {
  try {
    const { message, status } = req.body;

    const existing = await pool.query(
      'SELECT * FROM feedbacks WHERE id = $1',
      [req.params.id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }

    const updated = await pool.query(
      `UPDATE feedbacks
       SET message    = COALESCE($1, message),
           status     = COALESCE($2, status),
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [message ?? null, status ?? null, req.params.id]
    );

    res.status(200).json({
      success: true,
      message: 'Feedback updated successfully',
      data: updated.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

module.exports = updateFeedback;
