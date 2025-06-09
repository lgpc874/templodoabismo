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
  // Essential API endpoints registered early to avoid Vite interception
  app.get('/api/courses', async (req, res) => {
    try {
      console.log('API: Fetching courses from database...');
      const result = await db.execute(`
        SELECT id, title, description, level, price_brl, modules, requirements, rewards, type, is_active, created_at
        FROM courses 
        WHERE is_active = true 
        ORDER BY level, title
      `);
      console.log('API: Successfully fetched courses:', result.rows.length);
      res.json(result.rows);
    } catch (error: any) {
      console.error('API: Courses error:', error);
      res.status(500).json({ message: 'Failed to get courses', error: error.message });
    }
  });

  app.get('/api/grimoires', async (req, res) => {
    try {
      console.log('API: Fetching grimoires from database...');
      const result = await db.execute(`
        SELECT id, title, description, author, level, purchase_price_brl, rental_price_brl, 
               chapter_price_brl, rental_days, total_chapters, cover_image, category, 
               enable_chapter_purchase, enable_online_reading, is_active, created_at
        FROM grimoires 
        WHERE is_active = true 
        ORDER BY level, title
      `);
      console.log('API: Successfully fetched grimoires:', result.rows.length);
      res.json(result.rows);
    } catch (error: any) {
      console.error('API: Grimoires error:', error);
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
