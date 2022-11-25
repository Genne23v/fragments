const { createErrorResponse, createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  logger.info('GET /v1/fragments:id/info requested');

  const fragment = await Fragment.byId(req.user, req.params.id);

  if (fragment) {
    res.status(200).json(createSuccessResponse({ fragment: fragment }));
  } else {
    logger.info('Could not find fragment for requested ID');
    res
      .status(404)
      .json(createErrorResponse({ code: 404, message: 'Requested ID does not exist' }));
  }
};
