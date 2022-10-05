const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
require('dotenv').config();

module.exports = async (req, res) => {
  logger.info('GET v1/fragments/:id requested');

  await Fragment.byId(req.user, req.params.id)
    .then(async (fragment) => {
      await fragment.getData().then((fragmentData) => {
          logger.debug({ fragment, fragmentData }, 'fragment found by ID');
    
          res.setHeader('Location', process.env.API_URL);
          //   res.status(200).json(createSuccessResponse(plainText));
          res.send(fragmentData);
      });
    })
    .catch((err) => {
      logger.debug({ err }, 'Could not get fragment for requested ID');
      res
        .status(404)
        .json(createErrorResponse({ code: 404, message: 'Requested ID does not exist' }));
    });
};
