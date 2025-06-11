import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { supabaseAdmin } from './supabase-client';
import { storage } from './storage';

// Admin authentication middleware
async function requireAdmin(req: any, res: Response, next: any) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de autorização necessário' });
    }

    const token = authHeader.split(' ')[1];
    const user = await storage.validateAdminToken(token);

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

  // Admin login
  app.post('/api/admin/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      const result = await storage.authenticateAdmin(email, password);
      
      if (!result) {
        return res.status(401).json({ error: 'Credenciais inválidas ou usuário não é administrador' });
      }

      const { user, token } = result;
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        user: userWithoutPassword,
        token,
        message: 'Login realizado com sucesso'
      });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Admin logout
  app.post('/api/admin/logout', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        await storage.revokeAdminSession(token);
      }

      res.json({ success: true, message: 'Logout realizado com sucesso' });
    } catch (error) {
      console.error('Admin logout error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Validate admin session
  app.get('/api/admin/me', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token de autorização necessário' });
      }

      const token = authHeader.split(' ')[1];
      const user = await storage.validateAdminToken(token);

      if (!user) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Admin validation error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Create emergency admin user
  app.post('/api/admin/create-emergency', async (req: Request, res: Response) => {
    try {
      const { email, password, username } = req.body;

      if (!email || !password || !username) {
        return res.status(400).json({ error: 'Email, senha e nome de usuário são obrigatórios' });
      }

      // Check if admin already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Usuário já existe' });
      }

      const adminUser = await storage.createUser({
        email,
        password,
        username,
        role: 'admin',
        member_type: 'admin',
        initiation_level: 7,
        is_active: true
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = adminUser;

      res.json({
        success: true,
        user: userWithoutPassword,
        message: 'Usuário administrador criado com sucesso'
      });
    } catch (error) {
      console.error('Create admin error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Test endpoint to verify routing
  app.get('/api/test', (req: Request, res: Response) => {
    res.json({ status: 'API routes working', timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
};