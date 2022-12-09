// const { Buffer } = require('node:buffer')
const logger = require('../../logger');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  logger.info('POST /v1/fragments requested');

  if (Buffer.isBuffer(req.body) === true) {
    const contentSize = req.get('content-length');
    let fragment = new Fragment({
      ownerId: req.user,
      type: req,
      size: parseInt(contentSize, 10),
    });

    try {
      await fragment.save();
      await fragment.setData(req.body);

      res.setHeader(
        'Location',
        `${process.env.API_URL}/v1/fragments/${fragment.id}` || req.headers.host
      );
      res.status(201).json(createSuccessResponse({ fragment: fragment }));
    } catch (err) {
      logger.debug({ err }, 'Failed to save content to database');
      throw new Error('Unable to save data');
    }
  } else {
    res.status(415).json(createErrorResponse({ code: 415, message: 'Invalid content type' }));
  }
};
