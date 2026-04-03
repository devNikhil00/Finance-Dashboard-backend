const test = require('node:test');
const assert = require('node:assert/strict');
const asyncHandler = require('../utils/asyncHandler');
const isValidObjectId = require('../utils/parseObjectId');

test('isValidObjectId validates object ids', () => {
  assert.equal(isValidObjectId('507f1f77bcf86cd799439011'), true);
  assert.equal(isValidObjectId('invalid-id'), false);
});

test('asyncHandler forwards errors to next', async () => {
  const error = new Error('boom');
  let captured = null;

  const wrapped = asyncHandler(async () => {
    throw error;
  });

  wrapped({}, {}, (nextError) => {
    captured = nextError;
  });

  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(captured, error);
});
