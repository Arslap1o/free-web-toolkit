const express = require('express');
const router = express.Router();
// We will create this controller in the next step
const { analyzeUrl } = require('../controllers/seoController');

/**
 * @route   POST /api/seo/analyze
 * @desc    Analyze a website URL for SEO best practices
 * @access  Public
 */
router.post('/analyze', analyzeUrl);

/**
 * @route   GET /api/seo/status
 * @desc    Check if the SEO worker is active
 */
router.get('/status', (req, res) => {
    res.json({ service: 'SEO Analyzer', status: 'active' });
});

module.exports = router;