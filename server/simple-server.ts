import express from "express";
import cors from "cors";
import { createServer } from "http";
import { createServer as createViteServer } from "vite";
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
    key: process.env.SUPABASE_ANON_KEY
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

async function startServer() {
  try {
    // Create Vite server in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
      root: process.cwd() + '/client'
    });

    // Use vite's connect instance as middleware
    app.use(vite.middlewares);

    const server = createServer(app);
    
    server.listen(PORT, () => {
      console.log(`🏛️ TEMPLO DO ABISMO - Servidor ativo na porta ${PORT}`);
      console.log(`📊 Database: Supabase (100% migrado)`);
      console.log(`🌐 Frontend: http://localhost:${PORT}`);
      console.log(`🔐 Admin: http://localhost:${PORT}/admin-login`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();