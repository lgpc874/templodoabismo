import express from "express";
import cors from "cors";
import { db } from "./db";
import { courses, grimoires } from "@shared/schema";
import { eq } from "drizzle-orm";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Essential routes
app.get('/api/courses', async (req, res) => {
  try {
    const result = await db.select().from(courses).where(eq(courses.is_active, true));
    res.json(result);
  } catch (error: any) {
    console.error('Courses error:', error);
    res.status(500).json({ message: 'Failed to get courses' });
  }
});

app.get('/api/grimoires', async (req, res) => {
  try {
    const result = await db.select().from(grimoires).where(eq(grimoires.is_active, true));
    res.json(result);
  } catch (error: any) {
    console.error('Grimoires error:', error);
    res.status(500).json({ message: 'Failed to get grimoires' });
  }
});

app.get('/health', async (req, res) => {
  try {
    const coursesCount = await db.select().from(courses);
    const grimoiresCount = await db.select().from(grimoires);
    res.json({ 
      status: 'healthy', 
      courses: coursesCount.length,
      grimoires: grimoiresCount.length
    });
  } catch (error) {
    res.status(500).json({ status: 'error' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;