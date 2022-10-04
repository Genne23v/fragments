const logger = require('../../logger');
const contentType = require('content-type');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = (req, res) => {
  logger.info('POST v1/fragments requested');

  if (Object.keys(req.body).length === 0) {
    res.status(415).json(createErrorResponse(415, 'Invalid content type'));
  }

  const contentSize = req.get('content-length');
  let fragment = new Fragment({
    ownerId: req.user,
    type: contentType.parse(req),
    size: parseInt(contentSize),
  });

  const { ownerId, id, created, updated, type, size } = fragment;
  console.log('TYPE: ', type)
  logger.fatal({type},'type in post route')
  fragment.setData(req.body);
  
  res.status(200).json(createSuccessResponse({ ownerId, id, created, updated, type, size }));
};
