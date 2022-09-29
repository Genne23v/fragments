const express = require('express');
const { authenticate } = require('../authentication');
const { createSuccessResponse } = require('../response');
const { version, author } = require('../../package.json');
const logger = require('../logger');
const router = express.Router();

router.use(`/v1`, authenticate(), require('./api'));

router.get('/', (req, res) => {
  logger.info('GET / requested');
  const githubUrl = 'https://github.com/Genne23v/fragments';
  const data = { version, author, githubUrl };

  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).json(createSuccessResponse(data));
});

module.exports = router;
