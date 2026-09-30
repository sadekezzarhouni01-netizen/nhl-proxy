const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

app.get('/nhl/*', async (req, res) => {
    try {
        const nhlPath = req.params[0];
        const nhlUrl = 'https://api-web.nhle.com/' + nhlPath;
        const nhlRes = await fetch(nhlUrl, {
            headers: { 'User-Agent': 'NHL-Analyzer/1.0' }
        });
        if (!nhlRes.ok) {
            return res.status(nhlRes.status).json({ error: 'NHL API returned ' + nhlRes.status });
        }
        const data = await nhlRes.json();
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

app.listen(PORT, () => {
    console.log('NHL Proxy démarré sur le port ' + PORT);
});
