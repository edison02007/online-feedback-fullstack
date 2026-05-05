const { pool } = require('../models/Feedback');

// GET /api/feedback/:id
const getFeedbackById = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM feedbacks WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

module.exports = getFeedbackById;
