const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = (req, res) => {
  logger.info('POST v1/fragments requested');

  if (Object.keys(req.body).length === 0) {
    res.status(415).json(createErrorResponse(415, 'Invalid content type'));
  }
  res.status(200).json(createSuccessResponse());
};
