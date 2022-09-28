const { createSuccessResponse } = require('../../response');

module.exports = (req, res) => {
  return res.status(200).json(createSuccessResponse());
};
