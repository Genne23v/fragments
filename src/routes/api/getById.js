const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const path = require('node:path');

module.exports = async (req, res) => {
  logger.info('GET /v1/fragments/:id requested');

  const id = path.basename(req.params.id, '.html');
  const ext = path.extname(req.params.id);

  try {
    const fragment = await Fragment.byId(req.user, id);
    const fragmentData = await fragment.getData();
    logger.debug({ fragment, fragmentData }, 'fragment found by ID');

    res.setHeader('Content-Length', fragment.size);
    res.setHeader('Content-Type', fragment.type);

    if (ext === 'html') {
      logger.info(`Converting ${id} to markdown`);
      const htmlConverted = fragment.convertToHtml(fragmentData.toString());
      res.send(htmlConverted);
    } else {
      res.send(fragmentData.toString());
    }
  } catch (err) {
    logger.debug({ err }, 'Could not get fragment for requested ID');
    res
      .status(404)
      .json(createErrorResponse({ code: 404, message: 'Requested ID does not exist' }));
  }
};
