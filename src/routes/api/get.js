const { createSuccessResponse } = require('../../response');
const logger = require('../../logger');
require('dotenv').config();

module.exports = (req, res) => {
  logger.info('GET v1/fragments requested');
  const fragments = [];
  res.setHeader('Location', process.env.API_URL);
  res.status(200).json(createSuccessResponse({ fragments }));
};
