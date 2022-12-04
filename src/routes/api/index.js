const express = require('express');
const router = express.Router();
const contentType = require('content-type');
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');

const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      const { type } = contentType.parse(req);
      logger.debug({ type }, 'parsed content-type');
      return Fragment.isSupportedType(type);
    },
  });

router.get('/fragments/:id/info', require('./getInfoById'));

router.get('/fragments/:id', require('./getById'));

router.put('/fragments/:id', rawBody(), require('./put'));

router.delete('/fragments/:id', require('./delete'));

router.post('/fragments', rawBody(), require('./post'));

router.get('/fragments', require('./get'));

module.exports = router;
