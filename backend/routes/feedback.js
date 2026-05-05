const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const submitFeedback   = require('../controllers/submitFeedback');
const getAllFeedback    = require('../controllers/getAllFeedback');
const getFeedbackById  = require('../controllers/getFeedbackById');
const updateFeedback   = require('../controllers/updateFeedback');
const deleteFeedback   = require('../controllers/deleteFeedback');
const getAnalytics     = require('../controllers/getAnalytics');

// GET  /api/feedback/analytics  — must be before /:id to avoid conflict
router.get('/analytics', getAnalytics);

// POST /api/feedback
router.post('/', upload.single('file'), submitFeedback);

// GET  /api/feedback
router.get('/', getAllFeedback);

// GET  /api/feedback/:id
router.get('/:id', getFeedbackById);

// PUT  /api/feedback/:id
router.put('/:id', updateFeedback);

// DELETE /api/feedback/:id
router.delete('/:id', deleteFeedback);

module.exports = router;
