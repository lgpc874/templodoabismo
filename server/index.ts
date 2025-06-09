import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { db } from "./db";
import { courses, grimoires } from "@shared/schema";
import { eq } from "drizzle-orm";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Core API endpoints with direct database access
  app.get('/api/courses', async (req, res) => {
    try {
      const result = await db.select().from(courses).where(eq(courses.is_active, true));
      res.json(result);
    } catch (error: any) {
      console.error('Courses API error:', error);
      res.status(500).json({ message: 'Failed to get courses', error: error.message });
    }
  });

  // New course system endpoints
  app.get('/api/courses-new', async (req, res) => {
    try {
      const result = await db.execute(`
        SELECT id, title, short_description, slug, category, difficulty_level, 
               total_levels, full_course_price_brl, discount_percentage, 
               estimated_duration_hours, cover_image, requirements, what_you_learn, is_active
        FROM courses 
        WHERE is_active = true 
        ORDER BY difficulty_level, title
      `);
      res.json(result.rows);
    } catch (error: any) {
      console.error('Courses New API error:', error);
      res.status(500).json({ message: 'Failed to get courses', error: error.message });
    }
  });

  app.get('/api/course/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      
      // Get course details
      const courseQuery = `
        SELECT * FROM courses WHERE slug = '${slug}' AND is_active = true
      `;
      const courseResult = await db.execute(courseQuery);
      
      if (courseResult.rows.length === 0) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      const course = courseResult.rows[0];
      
      // Get course levels
      const levelsQuery = `
        SELECT * FROM course_levels 
        WHERE course_id = ${course.id} AND is_active = true 
        ORDER BY level_number
      `;
      const levelsResult = await db.execute(levelsQuery);
      
      const courseWithLevels = {
        ...course,
        levels: levelsResult.rows
      };
      
      res.json(courseWithLevels);
    } catch (error: any) {
      console.error('Course Detail API error:', error);
      res.status(500).json({ message: 'Failed to get course details', error: error.message });
    }
  });

  app.get('/api/grimoires', async (req, res) => {
    try {
      const result = await db.select().from(grimoires).where(eq(grimoires.is_active, true));
      res.json(result);
    } catch (error: any) {
      console.error('Grimoires API error:', error);
      res.status(500).json({ message: 'Failed to get grimoires', error: error.message });
    }
  });

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
