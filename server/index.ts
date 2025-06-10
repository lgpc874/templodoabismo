import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./supabase-storage";

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
  // Add critical ritual consultation endpoint BEFORE route registration
  app.post('/api/oracle/ritual-consult', async (req: any, res: Response) => {
    try {
      console.log('DIRECT ritual consultation request received:', req.body);
      
      const { question, oracleType, entityName } = req.body;
      
      if (!question?.trim() || !oracleType || !entityName) {
        return res.status(400).json({ 
          error: 'Question, oracle type, and entity name are required' 
        });
      }

      // Import AI service dynamically
      const { temploAI } = await import('./ai-service');
      const result = await temploAI.generateRitualResponse(question.trim(), oracleType, entityName);
      
      res.json({
        success: true,
        response: result.response,
        farewell: result.farewell,
        entityName,
        oracleType,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error in DIRECT ritual consultation:', error);
      res.status(500).json({ error: 'Failed to perform ritual consultation', details: error.message });
    }
  });

  // Register all API routes first, before Vite middleware
  const server = await registerRoutes(app);
  
  // Add explicit API route handling to ensure they're processed before Vite
  app.use('/api/*', (req, res, next) => {
    // If we reach here, the API route wasn't found in registerRoutes
    if (!res.headersSent) {
      console.log(`Unmatched API route: ${req.method} ${req.path}`);
      res.status(404).json({ error: 'API endpoint not found' });
    }
  });

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
