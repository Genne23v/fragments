const logger = require('../logger');

if (process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID) {
  module.exports = require('./cognito');
} else if (process.env.HTPASSWD_FILE && process.NODE_ENV !== 'production') {
  module.exports = require('./basic-auth');
} else {
  logger.info(process.env.AWS_COGNITO_CLIENT_ID, process.env.AWS_COGNITO_POOL_ID);
  console.log('ENV', process.env.AWS_COGNITO_CLIENT_ID, process.env.AWS_COGNITO_POOL_ID);
  throw new Error('Missing env vars: no authorization configuration found');
}
