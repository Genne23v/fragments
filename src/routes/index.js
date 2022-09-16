const express = require('express');
const { version, author } = require('../../package.json');
const router = express.Router();

router.use(`/v1`, require('./api'));

router.get('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).json({
        status: 'ok',
        author,
        githubUrl: 'https://github.com/Genne23v/fragments',
        version,
    });
});

module.exports = router;