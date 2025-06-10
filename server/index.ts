import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./supabase-storage";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Direct ritual consultation endpoint - highest priority registration
app.post('/api/oracle/ritual-consult', async (req: any, res: Response) => {
  try {
    const { question, oracleType, entityName } = req.body;
    
    if (!question?.trim() || !oracleType || !entityName) {
      return res.status(400).json({ 
        error: 'Question, oracle type, and entity name are required' 
      });
    }

    const entityResponses = {
      'Arcanum': {
        response: `The ancient cards whisper of your question: "${question}". Through the Tarot's sacred geometry, I perceive the threads of fate that bind your path. The Major Arcana speaks - transformation comes through embracing the shadow aspects of your being. The cards reveal that what you seek lies beyond the veil of ordinary perception.`,
        farewell: 'The cards grow cold as Arcanum withdraws into the mystical veil, leaving only echoes of ancient wisdom...'
      },
      'Speculum': {
        response: `Your reflection in the obsidian mirror reveals truths about "${question}". I see through the veils of illusion to perceive your soul's true nature. The mirror shows not what is, but what could be - potential paths written in silver light upon dark glass. Your inner vision must awaken to see what others cannot.`,
        farewell: 'The mirror surface grows dark as Speculum retreats into the realm of infinite reflections...'
      },
      'Runicus': {
        response: `The ancient stones have been cast for your inquiry: "${question}". The Elder Futhark speaks of destiny carved in stone and fate written in the language of the gods. I see Algiz for protection, Dagaz for transformation, and Othala for spiritual inheritance. Your path requires both courage and wisdom.`,
        farewell: 'The runes fall silent as Runicus returns to the sacred grove of ancient knowledge...'
      },
      'Ignis': {
        response: `The sacred flames dance with insight for your question: "${question}". Fire speaks of purification through trial, of passion that burns away illusion. In the dancing flames, I see the phoenix rising from ashes of old patterns. What must die for you to be reborn? The fire knows.`,
        farewell: 'The flames diminish to embers as Ignis retreats to the eternal hearth of transformation...'
      },
      'Abyssos': {
        response: `From the primordial void comes wisdom for your inquiry: "${question}". The abyss speaks in whispers older than creation itself. What you seek dwells not in light but in the fertile darkness where all potentials exist. Embrace the unknown, for it is the womb of all becoming.`,
        farewell: 'Abyssos dissolves back into the infinite void, leaving only the profound silence of endless possibility...'
      }
    };

    const entityData = entityResponses[entityName];
    if (!entityData) {
      return res.status(400).json({ error: 'Unknown entity' });
    }
    
    res.json({
      success: true,
      response: entityData.response,
      farewell: entityData.farewell,
      entityName,
      oracleType,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Ritual consultation error:', error);
    res.status(500).json({ error: 'Failed to perform ritual consultation' });
  }
});

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


  // Register all API routes first, before Vite middleware
  const server = await registerRoutes(app);
  
  // Removed problematic catch-all middleware that was blocking routes

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
