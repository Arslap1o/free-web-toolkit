const axios = require('axios');
const cheerio = require('cheerio');
const { create } = require('xmlbuilder2');

/**
 * Simple crawler to generate a sitemap.xml
 * @param {string} domain - The base URL (e.g., https://example.com)
 * @param {number} limit - Max pages to crawl (default 50)
 */
async function generateSitemap(domain, limit = 50) {
    const pages = new Set([domain]);
    const queue = [domain];
    const baseUrl = new URL(domain).origin;

    try {
        while (queue.length > 0 && pages.size < limit) {
            const currentUrl = queue.shift();
            
            try {
                const { data } = await axios.get(currentUrl, { timeout: 5000 });
                const $ = cheerio.load(data);

                $('a[href]').each((_, element) => {
                    let href = $(element).attr('href');
                    
                    try {
                        const fullUrl = new URL(href, baseUrl);
                        
                        // Only add internal links and avoid fragments/mailtos
                        if (fullUrl.origin === baseUrl && 
                            !pages.has(fullUrl.href) && 
                            !fullUrl.pathname.match(/\.(jpg|jpeg|png|gif|pdf|zip)$/i)) {
                            
                            pages.add(fullUrl.href);
                            queue.push(fullUrl.href);
                        }
                    } catch (e) {
                        // Invalid URL, skip
                    }
                });
            } catch (e) {
                console.error(`Could not crawl: ${currentUrl}`);
            }
        }

        // Build XML
        const root = create({ version: '1.0', encoding: 'UTF-8' })
            .ele('urlset', { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' });

        pages.forEach(page => {
            const url = root.ele('url');
            url.ele('loc').txt(page);
            url.ele('lastmod').txt(new Date().toISOString().split('T')[0]);
            url.ele('changefreq').txt('daily');
            url.ele('priority').txt('0.8');
        });

        return root.end({ prettyPrint: true });

    } catch (error) {
        throw new Error('Sitemap generation failed: ' + error.message);
    }
}

module.exports = { generateSitemap };