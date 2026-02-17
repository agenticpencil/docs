module.exports = function handler(req, res) {
  res.json({ status: 'ok', path: req.url, time: new Date().toISOString() });
};
