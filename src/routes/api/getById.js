const md = require('markdown-it')();
const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
require('dotenv').config();

module.exports = async (req, res) => {
  logger.info('GET /v1/fragments/:id requested');

  const idParams = req.params.id;
  let id, ext;

  if (idParams.indexOf('.') >= 0) {
    id = idParams.substring(0, idParams.lastIndexOf('.'));
    ext = idParams.substring(idParams.lastIndexOf('.') + 1);
  } else {
    id = idParams;
  }

  try {
    const fragment = await Fragment.byId(req.user, id);
    const fragmentData = await fragment.getData();
    logger.debug({ fragment, fragmentData }, 'fragment found by ID');
    // res.setHeader('Location', process.env.API_URL || req.headers.host);

    res.setHeader('Content-Type', fragment.type);
    if (ext === 'html') {
      logger.info(`Convert ${id} to ${ext}`);
      let decoder = new TextDecoder('utf-8');
      let converted = md.render(decoder.decode(fragmentData));
      res.send(converted);
    } else {
      res.send(fragmentData);
    }
  } catch (err) {
    logger.debug({ err }, 'Could not get fragment for requested ID');
    res
      .status(404)
      .json(createErrorResponse({ code: 404, message: 'Requested ID does not exist' }));
  }
};
