import request from 'supertest';
import app from '../app';

describe('Flux API Server', () => {
  // Test the basic route
  test('GET / should return server info', async () => {
    const response = await request(app).get('/').expect(200);

    expect(response.body).toHaveProperty('message', 'Flux API Server is running!');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  // Test 404 for unknown routes
  test('GET /unknown should return 404', async () => {
    const response = await request(app).get('/unknown').expect(404);
  });
});
