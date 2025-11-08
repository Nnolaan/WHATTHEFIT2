// This is the entire content for:  api/generate.js
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(204).end();
  
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });
  
    try {
      const { prompt } = req.body || {};
      if (!prompt) return res.status(400).json({ error: 'Missing prompt' });
  
      const key = process.env.GEMINI_API_KEY;
      if (!key) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });
  
      // Corrected model name to the latest working version
      const model = 'gemini-1.5-flash-latest';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  
      const upstream = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
  
      const data = await upstream.json();
  
      if (!upstream.ok) {
        const msg = data?.error?.message || 'Upstream API error';
        return res.status(upstream.status).json({ error: msg });
      }
  
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return res.status(200).json({ text });
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  }