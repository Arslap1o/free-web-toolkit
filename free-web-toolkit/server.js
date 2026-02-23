const express = require('express');
const path = require('path');
const cors = require('cors');

// Import Route Handlers
const seoRoutes = require('./routes/seo');
const toolRoutes = require('./routes/tools');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Serve static files (CSS, JS, Images)
// We use path.resolve to ensure Vercel finds the directory correctly
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

// 2. API Routes
app.use('/api/seo', seoRoutes);
app.use('/api/tools', toolRoutes);

// 3. Health check
app.get('/api/status', (req, res) => {
    res.json({ status: 'online', platform: 'Vercel Serverless' });
});

// 4. THE FIX FOR 404: Catch-all route
// This sends the index.html for ANY request that isn't an API or static file.
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'), (err) => {
        if (err) {
            res.status(500).send("Error loading index.html. Check if the 'public' folder exists in the root.");
        }
    });
});

// Vercel handles the port, but we keep this for local testing
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Local Server: http://localhost:${PORT}`));
}

// Export for Vercel
module.exports = app;