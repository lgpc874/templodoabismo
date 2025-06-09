import express from "express";
import { db } from "./db";

const app = express();
app.use(express.json());

// Simple test endpoint to verify database connectivity
app.get('/test-courses', async (req, res) => {
  try {
    console.log('Testing courses API...');
    
    // Direct SQL query
    const result = await db.execute(`
      SELECT id, title, description, level, price_brl, type, is_active
      FROM courses 
      WHERE is_active = true 
      ORDER BY level, title
      LIMIT 10
    `);
    
    console.log('Query successful, rows:', result.rows.length);
    res.json({
      success: true,
      count: result.rows.length,
      courses: result.rows
    });
  } catch (error: any) {
    console.error('Query failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const port = 3001;
app.listen(port, () => {
  console.log(`Test API server running on port ${port}`);
});