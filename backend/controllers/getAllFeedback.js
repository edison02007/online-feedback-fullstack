const { pool } = require('../models/Feedback');

// GET /api/feedback?search=&type=&rating=&sortBy=&page=&limit=
const getAllFeedback = async (req, res, next) => {
  try {
    const { search, type, rating, sortBy, page = 1, limit = 20 } = req.query;

    const conditions = [];
    const values     = [];
    let   idx        = 1;

    if (type && type !== 'all') {
      conditions.push(`type = $${idx++}`);
      values.push(type);
    }

    if (rating && rating !== 'all') {
      conditions.push(`rating = $${idx++}`);
      values.push(Number(rating));
    }

    if (search) {
      conditions.push(
        `(name ILIKE $${idx} OR email ILIKE $${idx} OR message ILIKE $${idx})`
      );
      values.push(`%${search}%`);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const sortMap = {
      'date-desc':   'created_at DESC',
      'date-asc':    'created_at ASC',
      'rating-desc': 'rating DESC',
      'rating-asc':  'rating ASC'
    };
    const orderBy = sortMap[sortBy] || 'created_at DESC';

    const offset = (Number(page) - 1) * Number(limit);

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM feedbacks ${where}`,
      values
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const dataResult = await pool.query(
      `SELECT * FROM feedbacks ${where} ORDER BY ${orderBy} LIMIT $${idx} OFFSET $${idx + 1}`,
      [...values, Number(limit), offset]
    );

    res.status(200).json({
      success: true,
      total,
      page:  Number(page),
      pages: Math.ceil(total / Number(limit)),
      data:  dataResult.rows
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getAllFeedback;
