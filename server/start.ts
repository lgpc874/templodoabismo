import express from "express";
import { db } from "./db";
import { courses, grimoires } from "@shared/schema";
import { eq } from "drizzle-orm";

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

// Working API endpoints
app.get('/api/courses', async (req, res) => {
  try {
    console.log('Fetching courses from database...');
    const result = await db.select().from(courses).where(eq(courses.is_active, true));
    console.log('Successfully fetched courses:', result.length);
    res.json(result);
  } catch (error: any) {
    console.error('Courses error:', error);
    res.status(500).json({ message: 'Failed to get courses', error: error.message });
  }
});

app.get('/api/grimoires', async (req, res) => {
  try {
    console.log('Fetching grimoires from database...');
    const result = await db.select().from(grimoires).where(eq(grimoires.is_active, true));
    console.log('Successfully fetched grimoires:', result.length);
    res.json(result);
  } catch (error: any) {
    console.error('Grimoires error:', error);
    res.status(500).json({ message: 'Failed to get grimoires', error: error.message });
  }
});

// Health check
app.get('/health', async (req, res) => {
  try {
    const coursesCount = await db.select().from(courses);
    const grimoiresCount = await db.select().from(grimoires);
    res.json({ 
      status: 'healthy', 
      database: 'connected',
      courses: coursesCount.length,
      grimoires: grimoiresCount.length
    });
  } catch (error: any) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

const port = 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Templo do Abismo API server running on port ${port}`);
});