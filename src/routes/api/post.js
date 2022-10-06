const logger = require('../../logger');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = (req, res) => {
  logger.info('POST /v1/fragments requested');

  if (Object.keys(req.body).length === 0) {
    res.status(415).json(createErrorResponse(415, 'Invalid content type'));
  }

  const contentSize = req.get('content-length');
  let fragment = new Fragment({
    ownerId: req.user,
    type: req,
    size: parseInt(contentSize),
  });

  const { ownerId, id, created, updated, type, size } = fragment;
  fragment.setData(req.body);
  fragment.save();
  
  res.setHeader('Location', process.env.API_URL || '');
  res
    .status(200)
    .json(createSuccessResponse({ fragment: { ownerId, id, created, updated, type, size } }));
};
