// const { Buffer } = require('node:buffer')
const logger = require('../../logger');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = (req, res) => {
  logger.info('POST /v1/fragments requested');

  if (Object.keys(req.body).length === 0) {
    // if (Buffer.isBuffer(req.body)) {
    res.status(415).json(createErrorResponse(415, 'Invalid content type'));
  }

  const contentSize = req.get('content-length');
  let fragment = new Fragment({
    ownerId: req.user,
    type: req,
    size: parseInt(contentSize),
  });

  try {
    fragment.save();
    fragment.setData(req.body);
  } catch (e) {
    logger.debug({ e }, 'Failed to save content to database');
    throw new Error('Unable to save data');
  }

  res.setHeader('Location', `${process.env.API_URL}/v1/fragments/${fragment.id}` || req.headers.host);
  res.status(201).json(createSuccessResponse({ fragment: fragment }));
};
