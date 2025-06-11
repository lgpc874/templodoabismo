import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { registerViteDevMiddleware } from "./vite";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register Vite dev middleware to serve the frontend
registerViteDevMiddleware(app);

// Routes
registerRoutes(app).then((server) => {
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Database: Supabase`);
    console.log(`Frontend: http://localhost:${PORT}`);
    console.log(`Admin login: /admin-login`);
  });
}).catch((error) => {
  console.error("Erro ao iniciar servidor:", error);
  process.exit(1);
});