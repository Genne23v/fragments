const { createErrorResponse, createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = (req, res) => {
  logger.info('DELETE /v1/fragments/:id requested');

  const id = req.params.id;

  try {
    Fragment.delete(req.user, id);
    logger.info('Fragment has been deleted');
    res.send(
      createSuccessResponse({ code: 200, message: 'Fragment has been deleted successfully' })
    );
  } catch (err) {
    logger.debug({ err }, 'Could not get fragment for requested ID');
    res
      .status(404)
      .json(createErrorResponse({ code: 404, message: 'Requested ID does not exist' }));
  }
};
