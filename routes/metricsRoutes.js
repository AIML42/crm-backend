const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getMetrics } = require('../controllers/metricsController');

const router = express.Router();

router.get('/', [protect], getMetrics);

module.exports = router;