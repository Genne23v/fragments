const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
require('dotenv').config();

module.exports = async (req, res) => {
  logger.info('GET v1/fragments requested');

  const fragments = await Fragment.byUser(req.user, true);
  logger.debug({ fragments }, 'a list of fragments');

  res.setHeader('Location', process.env.API_URL);
  res.status(200).json(createSuccessResponse({fragments: fragments}));
};
