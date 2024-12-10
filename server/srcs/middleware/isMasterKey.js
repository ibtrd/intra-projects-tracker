const MASTER_API_KEY = process.env.MASTER_API_KEY;

function isMasterKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (apiKey === MASTER_API_KEY) {
        return next();
    }
    res.status(403).json({ error: 'Forbidden: Invalid API key' });
}
