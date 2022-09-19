const { createSuccessResponse } = require('../../response');

module.exports = (req, res) => {
    console.log('v1/fragments working');
    const fragments = [];

    return res.status(200).json(createSuccessResponse({ fragments }));
};