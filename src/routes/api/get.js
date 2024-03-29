const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
require('dotenv').config();

module.exports = async (req, res) => {
  logger.info('GET /v1/fragments requested');

  let expand = false;
  if (parseInt(req.query.expand, 10) === 1) {
    expand = true;
  }
  const fragments = await Fragment.byUser(req.user, expand);
  logger.debug({ fragments }, 'a list of fragments');

  res.status(200).json(createSuccessResponse({ fragments: fragments }));
};
