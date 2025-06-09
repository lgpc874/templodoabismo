import express from "express";
import { db } from "./db";

// Standalone API server to test database connectivity
const app = express();
app.use(express.json());

// Enable CORS for testing
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

// Working courses endpoint
app.get('/api/courses', async (req, res) => {
  try {
    console.log('Fetching courses from database...');
    const result = await db.execute(`
      SELECT id, title, description, level, price_brl, modules, requirements, rewards, type, is_active, created_at
      FROM courses 
      WHERE is_active = true 
      ORDER BY level, title
    `);
    console.log('Successfully fetched courses:', result.rows.length);
    res.json(result.rows);
  } catch (error: any) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

// Working grimoires endpoint
app.get('/api/grimoires', async (req, res) => {
  try {
    console.log('Fetching grimoires from database...');
    const result = await db.execute(`
      SELECT id, title, description, author, level, purchase_price_brl, rental_price_brl, 
             chapter_price_brl, rental_days, total_chapters, cover_image, category, 
             enable_chapter_purchase, enable_online_reading, is_active, created_at
      FROM grimoires 
      WHERE is_active = true 
      ORDER BY level, title
    `);
    console.log('Successfully fetched grimoires:', result.rows.length);
    res.json(result.rows);
  } catch (error: any) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const result = await db.execute('SELECT 1 as health');
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error: any) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

const port = 3002;
app.listen(port, '0.0.0.0', () => {
  console.log(`API fix server running on port ${port}`);
});