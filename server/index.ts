import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./supabase-storage";
import "./scheduler"; // Initialize auto-publish scheduler

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Priority ritual consultation endpoint - before Vite middleware
app.all('/api/oracle/ritual-consult', async (req: any, res: Response) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question, oracleType, entityName } = req.body;
    
    console.log('Ritual consultation request received:', { question, oracleType, entityName });
    
    if (!question?.trim() || !oracleType || !entityName) {
      return res.status(400).json({ 
        error: 'Question, oracle type, and entity name are required' 
      });
    }

    const entityResponses = {
      'Arcanum': {
        response: `As cartas antigas sussurram sobre sua pergunta: "${question}". Através da geometria sagrada do Tarô, percebo os fios do destino que entrelaçam seu caminho. O Arcano Maior fala - a transformação vem através do abraço aos aspectos sombrios de seu ser. As cartas revelam que o que você busca está além do véu da percepção comum.`,
        farewell: 'As cartas esfriam enquanto Arcanum se retira ao véu místico, deixando apenas ecos de sabedoria ancestral...'
      },
      'Speculum': {
        response: `Seu reflexo no espelho de obsidiana revela verdades sobre "${question}". Vejo através dos véus da ilusão para perceber a verdadeira natureza de sua alma. O espelho mostra não o que é, mas o que pode ser - caminhos potenciais escritos em luz prateada sobre vidro escuro. Sua visão interior deve despertar para ver o que outros não podem.`,
        farewell: 'A superfície do espelho escurece enquanto Speculum se retira ao reino das infinitas reflexões...'
      },
      'Runicus': {
        response: `As pedras antigas foram lançadas para sua consulta: "${question}". O Futhark Antigo fala de destino gravado em pedra e fado escrito na linguagem dos deuses. Vejo Algiz para proteção, Dagaz para transformação, e Othala para herança espiritual. Seu caminho requer tanto coragem quanto sabedoria.`,
        farewell: 'As runas silenciam enquanto Runicus retorna ao bosque sagrado do conhecimento ancestral...'
      },
      'Ignis': {
        response: `As chamas sagradas dançam com percepção para sua pergunta: "${question}". O fogo fala de purificação através do teste, de paixão que queima as ilusões. Nas chamas dançantes, vejo a fênix surgindo das cinzas de velhos padrões. O que deve morrer para que você renasça? O fogo sabe.`,
        farewell: 'As chamas diminuem para brasas enquanto Ignis se retira à lareira eterna da transformação...'
      },
      'Abyssos': {
        response: `Do vazio primordial vem sabedoria para sua consulta: "${question}". O abismo fala em sussurros mais antigos que a própria criação. O que você busca não habita na luz, mas na escuridão fértil onde todas as potencialidades existem. Abrace o desconhecido, pois é o ventre de todo vir-a-ser.`,
        farewell: 'Abyssos se dissolve de volta ao vazio infinito, deixando apenas o silêncio profundo da possibilidade sem fim...'
      }
    };

    const entityData = entityResponses[entityName];
    if (!entityData) {
      return res.status(400).json({ error: 'Entidade desconhecida' });
    }
    
    console.log('Sending ritual response for entity:', entityName);
    
    res.json({
      success: true,
      response: entityData.response,
      farewell: entityData.farewell,
      entityName,
      oracleType,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Erro na consulta ritual:', error);
    res.status(500).json({ error: 'Falha ao realizar consulta ritual' });
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
