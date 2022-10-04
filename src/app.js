const { createErrorResponse } = require('./response');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const passport = require('passport');
const authenticate = require('./authorization/index');
const logger = require('./logger');
const pino = require('pino-http')({
    logger,
});

const app = express();

app.use(pino);

app.use(helmet());

app.use(cors());

app.use(compression());

passport.use(authenticate.strategy());
app.use(passport.initialize());

app.use('/', require('./routes'));

app.use((req, res) => {
    logger.info('Invalid path requested');
    const error = { message: 'Not Found', code: 404 };
    res.status(404).json(createErrorResponse(error));
});

//eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Unable to process request';

    if (status > 499) {
        logger.error({ err }, `Error processing request`);
    }

    res.status(status).json({
        status: 'error',
        error: {
            message,
            code: status,
        },
    });
});

module.exports = app;