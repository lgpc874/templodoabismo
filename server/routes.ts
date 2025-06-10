import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import multer from 'multer';
import { temploAI } from './ai-service';
import { supabase } from './supabase-client';
import { supabaseAdmin } from './supabase-admin';
import { registerAdminRoutes } from './admin-routes';

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Auth middleware
async function requireAuth(req: any, res: Response, next: any) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user profile from database
    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    req.user = profile || user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Register admin routes
  registerAdminRoutes(app);

  // Supabase configuration endpoint
  app.get('/api/config/supabase', (req: Request, res: Response) => {
    res.json({
      url: process.env.SUPABASE_URL,
      key: process.env.SUPABASE_KEY
    });
  });

  // Authentication endpoints
  app.post('/api/auth/signup', async (req: Request, res: Response) => {
    try {
      const { email, password, fullName } = req.body;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) throw error;
      res.json({ user: data.user });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(400).json({ error: 'Failed to create account' });
    }
  });

  app.post('/api/auth/signin', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      res.json({ user: data.user, session: data.session });
    } catch (error) {
      console.error('Signin error:', error);
      res.status(400).json({ error: 'Invalid credentials' });
    }
  });

  app.post('/api/auth/signout', async (req: Request, res: Response) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      console.error('Signout error:', error);
      res.status(400).json({ error: 'Failed to sign out' });
    }
  });

  app.get('/api/auth/user', requireAuth, async (req: any, res: Response) => {
    res.json(req.user);
  });

  // Get published courses only
  app.get('/api/courses', async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('courses')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  });

  // Get course by ID
  app.get('/api/courses/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { data, error } = await supabaseAdmin
        .from('courses')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error fetching course:', error);
      res.status(404).json({ error: 'Course not found' });
    }
  });

  // Get published grimoires only
  app.get('/api/grimoires', async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('grimoires')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Error fetching grimoires:', error);
      res.status(500).json({ error: 'Failed to fetch grimoires' });
    }
  });

  // Get grimoire by ID
  app.get('/api/grimoires/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { data, error } = await supabaseAdmin
        .from('grimoires')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error fetching grimoire:', error);
      res.status(404).json({ error: 'Grimoire not found' });
    }
  });

  // Get published pages only
  app.get('/api/pages', async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('pages')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
      res.status(500).json({ error: 'Failed to fetch pages' });
    }
  });

  // Get page by slug
  app.get('/api/pages/:slug', async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const { data, error } = await supabaseAdmin
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error fetching page:', error);
      res.status(404).json({ error: 'Page not found' });
    }
  });

  // Get recent Voz da Pluma posts (published only)
  app.get('/api/voz-pluma/recent', async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('voz_pluma_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Error fetching Voz da Pluma posts:', error);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  });

  // Get Voz da Pluma posts by type
  app.get('/api/voz-pluma/:type', async (req: Request, res: Response) => {
    try {
      const { type } = req.params;
      const { data, error } = await supabaseAdmin
        .from('voz_pluma_posts')
        .select('*')
        .eq('type', type)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Error fetching Voz da Pluma posts:', error);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  });

  // Oracle consultation
  app.post('/api/oracle/consult', requireAuth, async (req: any, res: Response) => {
    try {
      const { type, question } = req.body;
      const userId = req.user?.id;

      if (!question?.trim()) {
        return res.status(400).json({ error: 'Question is required' });
      }

      const consultation = { type, question: question.trim(), userId };
      const response = await temploAI.performOracleConsultation(consultation);
      
      res.json(response);
    } catch (error) {
      console.error('Error in oracle consultation:', error);
      res.status(500).json({ error: 'Failed to perform consultation' });
    }
  });

  // Get oracle history for user
  app.get('/api/oracle/history', requireAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user?.id;
      const limit = parseInt(req.query.limit as string) || 10;

      const { data, error } = await supabaseAdmin
        .from('oracle_consultations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Error fetching oracle history:', error);
      res.status(500).json({ error: 'Failed to fetch oracle history' });
    }
  });

  // File upload to Supabase Storage
  app.post('/api/upload', requireAuth, upload.single('file'), async (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { data, error } = await supabaseAdmin.storage
        .from('uploads')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('uploads')
        .getPublicUrl(fileName);

      res.json({ url: publicUrl });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  });

  // Site settings from Supabase
  app.get('/api/settings', async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('site_config')
        .select('*');

      if (error) throw error;
      
      const settings = data?.reduce((acc: any, config: any) => {
        acc[config.key] = config.value;
        return acc;
      }, {});

      res.json(settings || {});
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  // Error handling middleware
  app.use((err: any, req: Request, res: Response, next: any) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  const httpServer = createServer(app);
  return httpServer;
}