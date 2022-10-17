const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
require('dotenv').config();

module.exports = async (req, res) => {
  logger.info('GET /v1/fragments/:id requested');

  try {
    const fragment = await Fragment.byId(req.user, req.params.id);

    if (fragment){
      const fragmentData = await fragment.getData();
    
      logger.debug({ fragment, fragmentData }, 'fragment found by ID');
    
      // res.setHeader('Location', process.env.API_URL || req.headers.host);
      res.send(fragmentData);
    }
  } catch(e) {
    logger.debug({e},'Could not get fragment for requested ID');

    res
      .status(404)
      .json(createErrorResponse({ code: 404, message: 'Requested ID does not exist' }));
  }
};
