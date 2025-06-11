import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { supabaseService } from './supabase-service';

// Admin authentication middleware
async function requireAdmin(req: any, res: Response, next: any) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de autorização necessário' });
    }

    const token = authHeader.split(' ')[1];
    const user = await supabaseService.validateToken(token);

    if (!user) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado - necessário ser administrador' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({ error: 'Erro de autenticação' });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Supabase configuration endpoint
  app.get('/api/config/supabase', (req: Request, res: Response) => {
    res.json({
      url: process.env.SUPABASE_URL,
      key: process.env.SUPABASE_KEY
    });
  });

  // Create first admin user (one-time setup)
  app.post('/api/admin/create-first', async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, senha e nome são obrigatórios' });
      }

      // Create admin user
      await supabaseService.createAdminIfNotExists();

      res.json({
        success: true,
        message: 'Administrador criado com sucesso',
        user: { email: 'admin@templo.com', magical_name: name }
      });
    } catch (error: any) {
      console.error('Admin creation error:', error);
      res.status(500).json({ error: 'Erro ao criar administrador' });
    }
  });

  // Admin login
  app.post('/api/admin/login', async (req: Request, res: Response) => {
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
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Admin logout
  app.post('/api/admin/logout', requireAdmin, async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        await supabaseService.revokeToken(token);
      }
      res.json({ success: true, message: 'Logout realizado com sucesso' });
    } catch (error: any) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Erro ao fazer logout' });
    }
  });

  // Get admin user info
  app.get('/api/admin/me', requireAdmin, async (req: any, res: Response) => {
    try {
      const user = req.user;
      res.json({
        id: user.id,
        email: user.email,
        magical_name: user.magical_name,
        role: user.role,
        member_type: user.member_type,
        initiation_level: user.initiation_level
      });
    } catch (error: any) {
      console.error('Get admin info error:', error);
      res.status(500).json({ error: 'Erro ao obter informações do administrador' });
    }
  });

  // Basic health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'supabase'
    });
  });

  // Error handling middleware
  app.use((err: any, req: Request, res: Response, next: any) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  });

  const httpServer = createServer(app);
  return httpServer;
}