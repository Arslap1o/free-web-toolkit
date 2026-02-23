const express = require('express');
const path = require('path');
const cors = require('cors');

// Import Route Handlers
// Ensure these files exist in /routes/ folder exactly as named
const seoRoutes = require('./routes/seo');
const toolRoutes = require('./routes/tools');

const app = express();

// 1. Essential Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. API Routes (Defined BEFORE static files)
app.use('/api/seo', seoRoutes);
app.use('/api/tools', toolRoutes);

// Health check for monitoring
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'online', 
        timestamp: new Date(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// 3. Static File Serving
// Use process.cwd() to ensure we are looking in the root of the project
const publicPath = path.join(process.cwd(), 'public');
app.use(express.static(publicPath));

// 4. The Catch-All Route
// This must be the LAST route. It handles the frontend.
app.get('*', (req, res) => {
    const indexPath = path.join(publicPath, 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error("Critical Error: index.html not found at", indexPath);
            res.status(500).send("The toolkit frontend is missing. Please check the 'public' folder.");
        }
    });
});

// 5. Local Development Server
// Vercel ignores this block and uses its own internal handler
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Local development server: http://localhost:${PORT}`);
    });
}

// 6. The Vercel Handshake
// This is why the code works as a Serverless Function
module.exports = app;