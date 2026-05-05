const { pool } = require('../models/Feedback');

// GET /api/feedback/analytics
const getAnalytics = async (req, res, next) => {
  try {
    // Total count
    const totalResult = await pool.query('SELECT COUNT(*) FROM feedbacks');
    const total = parseInt(totalResult.rows[0].count, 10);

    // Average rating
    const avgResult = await pool.query('SELECT ROUND(AVG(rating)::numeric, 1) AS avg_rating FROM feedbacks');
    const avgRating = parseFloat(avgResult.rows[0].avg_rating) || 0;

    // Count by type
    const byTypeResult = await pool.query(
      `SELECT type AS name, COUNT(*) AS value
       FROM feedbacks
       GROUP BY type
       ORDER BY type`
    );
    const byType = byTypeResult.rows.map(r => ({
      name:  r.name,
      value: parseInt(r.value, 10)
    }));

    // Rating distribution (1–5)
    const byRatingResult = await pool.query(
      `SELECT rating, COUNT(*) AS count
       FROM feedbacks
       GROUP BY rating
       ORDER BY rating`
    );
    const ratingMap = {};
    byRatingResult.rows.forEach(r => { ratingMap[r.rating] = parseInt(r.count, 10); });
    const ratingDistribution = [1, 2, 3, 4, 5].map(r => ({
      rating: `${r}★`,
      count:  ratingMap[r] || 0
    }));

    // Count by status
    const byStatusResult = await pool.query(
      `SELECT status, COUNT(*) AS count
       FROM feedbacks
       GROUP BY status
       ORDER BY status`
    );
    const byStatus = byStatusResult.rows.map(r => ({
      status: r.status,
      count:  parseInt(r.count, 10)
    }));

    res.status(200).json({
      success: true,
      data: { total, avgRating, byType, ratingDistribution, byStatus }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getAnalytics;
