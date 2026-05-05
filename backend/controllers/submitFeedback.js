const { pool } = require('../models/Feedback');

// POST /api/feedback
const submitFeedback = async (req, res, next) => {
  try {
    const { name, email, type, rating, tags, message, status } = req.body;

    const parsedTags = tags
      ? (Array.isArray(tags) ? tags : JSON.parse(tags))
      : [];

    const result = await pool.query(
      `INSERT INTO feedbacks (name, email, type, rating, tags, message, file, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        name,
        email,
        type || 'general',
        Number(rating),
        parsedTags,
        message,
        req.file ? req.file.filename : null,
        status || 'new'
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

module.exports = submitFeedback;
