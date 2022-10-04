const { createSuccessResponse, createErrorResponse } = require('../../src/response');

describe('API Response', () => {
  test('createErrorResponse()', () => {
    const errorResponse = createErrorResponse(404, 'Not found');
    expect(errorResponse).toEqual({
      status: 'error',
      error: {
        code: 404,
        message: 'Not found',
      },
    });
  });

  test('createSuccessResponse()', () => {
    const successResponse = createSuccessResponse();
    expect(successResponse).toEqual({
      status: 'ok',
    });
  });

  test('createSuccessResponse(data)', () => {
    const data = { a: 1, b: 2 };
    const successResponse = createSuccessResponse(data);
    expect(successResponse).toEqual({
      status: 'ok',
      a: 1,
      b: 2,
    });
  });
});
