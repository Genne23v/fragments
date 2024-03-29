const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const path = require('node:path');

module.exports = async (req, res) => {
  logger.info('GET /v1/fragments/:id requested');

  const id = path.parse(req.params.id).name;
  const ext = path.extname(req.params.id);

  try {
    const fragment = await Fragment.byId(req.user, id);
    logger.debug({ fragment }, 'fragment found by ID');
    let fragmentData;

    if (ext) {
      logger.info(`Converting ${fragment.type} to ${ext}`, { id });
      fragmentData = await fragment.convertData(ext);

      const type = Fragment.getConvertingType(ext);
      res.setHeader('Content-Type', type);
      res.setHeader('Content-Length', fragmentData.length);
    } else {
      fragmentData = await fragment.getData();
      res.setHeader('Content-Length', fragment.size);
      res.setHeader('Content-Type', fragment.type);
    }
    res.send(fragmentData);
  } catch (err) {
    logger.debug({ err }, 'Could not get fragment for requested ID');
    res
      .status(404)
      .json(createErrorResponse({ code: 404, message: 'Requested ID does not exist' }));
  }
};
