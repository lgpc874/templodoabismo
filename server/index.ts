import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite } from "./vite";

const app = express();
const PORT = parseInt(process.env.PORT || "5000");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
registerRoutes(app).then(async (server) => {
  // Setup Vite for development
  if (process.env.NODE_ENV !== "production") {
    await setupVite(app, server);
  }
  
  server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Database: Supabase`);
    console.log(`Frontend: http://localhost:${PORT}`);
    console.log(`Admin login: /admin-login`);
  });
}).catch((error) => {
  console.error("Erro ao iniciar servidor:", error);
  process.exit(1);
});