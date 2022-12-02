module.exports.createSuccessResponse = function () {
  return {
    status: 'ok',
  };
};

module.exports.createSuccessResponse = function (data) {
  return {
    status: 'ok',
    ...data,
  };
};

module.exports.createErrorResponse = function (error) {
  return {
    status: 'error',
    error,
  };
};
