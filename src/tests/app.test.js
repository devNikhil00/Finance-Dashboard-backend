const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const request = require('supertest');
const app = require('../app');

test('GET /api/health returns 200', async () => {
  const response = await request(app).get('/api/health');
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.message, 'Finance Dashboard API is running');
});

test('unknown route returns 404', async () => {
  const response = await request(app).get('/api/not-a-real-route');
  assert.equal(response.status, 404);
  assert.equal(response.body.success, false);
  assert.match(response.body.message, /Not Found/i);
});
