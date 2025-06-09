// Emergency API fix - JavaScript version to bypass TypeScript compilation issues
const express = require('express');
const { Pool } = require('@neondatabase/serverless');
const ws = require('ws');

// Configure Neon connection
const neonConfig = { webSocketConstructor: ws };
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const app = express();
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Courses endpoint
app.get('/api/courses', async (req, res) => {
  try {
    console.log('Fetching courses...');
    const result = await pool.query(`
      SELECT id, title, description, level, price_brl, modules, requirements, rewards, type, is_active, created_at
      FROM courses 
      WHERE is_active = true 
      ORDER BY level, title
    `);
    console.log('Courses fetched:', result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error('Courses error:', error);
    res.status(500).json({ message: 'Failed to get courses', error: error.message });
  }
});

// Grimoires endpoint
app.get('/api/grimoires', async (req, res) => {
  try {
    console.log('Fetching grimoires...');
    const result = await pool.query(`
      SELECT id, title, description, author, level, purchase_price_brl, rental_price_brl, 
             chapter_price_brl, rental_days, total_chapters, cover_image, category, 
             enable_chapter_purchase, enable_online_reading, is_active, created_at
      FROM grimoires 
      WHERE is_active = true 
      ORDER BY level, title
    `);
    console.log('Grimoires fetched:', result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error('Grimoires error:', error);
    res.status(500).json({ message: 'Failed to get grimoires', error: error.message });
  }
});

// Health check
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1 as health');
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

const port = 3003;
app.listen(port, '0.0.0.0', () => {
  console.log(`Emergency API server running on port ${port}`);
});