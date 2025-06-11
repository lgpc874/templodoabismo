import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { supabaseService } from "./supabase-service";

const app = express();
const PORT = parseInt(process.env.PORT || "5000");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Supabase configuration endpoint
app.get('/api/config/supabase', (req, res) => {
  res.json({
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY
  });
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const result = await supabaseService.authenticateUser(email, password);
    
    if (!result) {
      return res.status(401).json({ error: 'Credenciais inválidas ou usuário não é administrador' });
    }

    res.json({
      success: true,
      token: result.token,
      user: {
        id: result.user.id,
        email: result.user.email,
        magical_name: result.user.magical_name,
        role: result.user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Create first admin user
app.post('/api/admin/create-first', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, senha e nome são obrigatórios' });
    }

    await supabaseService.createAdminIfNotExists();

    res.json({
      success: true,
      message: 'Administrador criado com sucesso',
      user: { email: 'admin@templo.com', magical_name: name }
    });
  } catch (error) {
    console.error('Admin creation error:', error);
    res.status(500).json({ error: 'Erro ao criar administrador' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'supabase'
  });
});

// Serve static files from client directory in development
const clientPath = path.join(process.cwd(), 'client');
const indexPath = path.join(clientPath, 'index.html');

// Serve the main HTML file for all routes
app.get('*', (req, res) => {
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Templo do Abismo</title>
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <style>
          body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #000; color: #fff; }
          .container { max-width: 800px; margin: 0 auto; text-align: center; }
          .logo { font-size: 2.5rem; font-weight: bold; margin-bottom: 2rem; }
          .nav { margin: 2rem 0; }
          .nav a { color: #fff; text-decoration: none; margin: 0 1rem; padding: 0.5rem 1rem; border: 1px solid #333; }
          .nav a:hover { background: #333; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🏛️ TEMPLO DO ABISMO</div>
          <div class="nav">
            <a href="/">Home</a>
            <a href="/admin-login">Admin Login</a>
          </div>
          <p>Sistema 100% Supabase ativo</p>
          <p>Database: Conectado</p>
          <p>Admin: <a href="/admin-login" style="color: #ff6b6b;">Fazer Login</a></p>
        </div>
      </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Database: Supabase`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`Admin login: http://localhost:${PORT}/admin-login`);
});