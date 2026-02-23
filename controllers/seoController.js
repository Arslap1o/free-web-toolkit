const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Analyzes a URL for SEO metrics: Title, Meta, Headings, and Alt tags.
 */
exports.analyzeUrl = async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Fetch the HTML from the provided URL
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'FreeWebToolkitBot/1.0 (SEO Checker)'
            },
            timeout: 5000 // 5-second timeout
        });

        const $ = cheerio.load(data);

        // Extract Data
        const title = $('title').text().trim() || 'No title tag found';
        const description = $('meta[name="description"]').attr('content') || 'No meta description found';
        
        const h1s = [];
        $('h1').each((i, el) => h1s.push($(el).text().trim()));

        const images = [];
        $('img').each((i, el) => {
            images.push({
                src: $(el).attr('src'),
                alt: $(el).attr('alt') || null
            });
        });

        // Scoring Logic (0-100)
        let score = 0;
        const checks = {
            titleLength: title.length > 10 && title.length < 70,
            hasDesc: description !== 'No meta description found',
            hasH1: h1s.length > 0,
            allAlts: images.every(img => img.alt !== null)
        };

        if (checks.titleLength) score += 25;
        if (checks.hasDesc) score += 25;
        if (checks.hasH1) score += 25;
        if (checks.allAlts && images.length > 0) score += 25;

        res.json({
            url,
            score,
            details: {
                title,
                description,
                h1Count: h1s.length,
                h1List: h1s,
                imageCount: images.length,
                missingAlts: images.filter(img => !img.alt).length
            }
        });

    } catch (error) {
        console.error('SEO Analysis Error:', error.message);
        res.status(500).json({ 
            error: 'Could not analyze the website. Ensure the URL is correct and includes http/https.' 
        });
    }
};