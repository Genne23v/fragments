if (process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID) {
    module.exports = require('./cognito');
} else if (process.env.HTPASSWD_FILE && process.env.NODE_ENV !== 'production') {
    module.exports = require('./basic-auth');
} else {
    throw new Error('Missing env vars: No authorization configuration found');
}