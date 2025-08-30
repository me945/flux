import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
const app = express();

//Add CORS middleware
app.use(cors());

//Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Flux API Server is running!',
    timestamp: new Date().toISOString(),
  });
});

export default app;
