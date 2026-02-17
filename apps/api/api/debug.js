module.exports = function handler(req, res) {
  res.json({ url: req.url, headers: { host: req.headers.host, 'x-matched-path': req.headers['x-matched-path'], 'x-vercel-forwarded-for': req.headers['x-vercel-forwarded-for'] } });
};
