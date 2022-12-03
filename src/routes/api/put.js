const { createErrorResponse, createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  logger.info('PUT /v1/fragments/:id requested');

  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    fragment.save();
    await fragment.setData(req.body);

    res.setHeader(
      'Location',
      `${process.env.API_URL}/v1/fragments/${fragment.id}` || req.headers.host
    );
    res.status(200).json(createSuccessResponse({ fragment: fragment }));
  } catch (err) {
    logger.debug({ err }, 'Could not update fragment for requested ID');
    res
      .status(404)
      .json(createErrorResponse({ code: 404, message: 'Requested ID does not exist' }));
  }
};
