import type { Express, Request, Response } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { supabase } from "@shared/supabase";
import { temploAI } from "./ai-service";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";
import multer from "multer";

const upload = multer({ dest: 'uploads/' });

// Supabase auth middleware
async function requireAuth(req: any, res: Response, next: any) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Token required' });
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configuration endpoint for client
  app.get('/api/config/supabase', (req: Request, res: Response) => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;
    
    console.log('Supabase config request:', { 
      hasUrl: !!url, 
      hasKey: !!key,
      urlPrefix: url?.substring(0, 20) + '...'
    });
    
    if (!url || !key) {
      console.error('Missing Supabase configuration');
      return res.status(500).json({ error: 'Supabase configuration missing' });
    }
    
    res.json({ url, key });
  });

  // PayPal routes
  app.get("/setup", loadPaypalDefault);
  app.post("/order", createPaypalOrder);
  app.post("/order/:orderID/capture", capturePaypalOrder);

  // Basic API routes using direct Supabase calls
  app.get('/api/courses', async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ message: 'Failed to fetch courses' });
    }
  });

  app.get('/api/grimoires', async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabase
        .from('grimoires')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error: any) {
      console.error('Error fetching grimoires:', error);
      res.status(500).json({ message: 'Failed to fetch grimoires' });
    }
  });

  // Daily content routes
  app.get('/api/daily-poem', async (req: Request, res: Response) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_poems')
        .select('*')
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) {
        // Generate new daily poem using AI
        const aiPoem = await temploAI.generateDailyPoem();
        const { data: newPoem, error: insertError } = await supabase
          .from('daily_poems')
          .insert({
            title: aiPoem.title,
            content: aiPoem.content,
            author: aiPoem.author,
            date: today
          })
          .select()
          .single();

        if (insertError) throw insertError;
        res.json(newPoem);
      } else {
        res.json(data);
      }
    } catch (error: any) {
      console.error('Error fetching daily poem:', error);
      res.status(500).json({ message: 'Failed to fetch daily poem' });
    }
  });

  app.get('/api/poems/recent', async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabase
        .from('daily_poems')
        .select('*')
        .order('date', { ascending: false })
        .limit(10);

      if (error) throw error;
      res.json(data || []);
    } catch (error: any) {
      console.error('Error fetching recent poems:', error);
      res.status(500).json({ message: 'Failed to fetch recent poems' });
    }
  });

  // Blog routes
  app.get('/api/blog/posts', async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error: any) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ message: 'Failed to fetch blog posts' });
    }
  });

  // Oracle routes
  app.post('/api/oracle/consult', requireAuth, async (req: any, res: Response) => {
    try {
      const { type, question } = req.body;
      const userId = req.user.id;
      
      let response;
      switch (type) {
        case 'tarot':
          response = await temploAI.generateTarotReading(question);
          break;
        case 'mirror':
          response = await temploAI.generateMirrorReading(question);
          break;
        case 'runes':
          response = await temploAI.generateRuneReading(question);
          break;
        case 'fire':
          response = await temploAI.generateFireReading(question);
          break;
        case 'abyssal':
          response = await temploAI.generateAbyssalVoice(question);
          break;
        default:
          return res.status(400).json({ message: 'Invalid consultation type' });
      }
      
      const { data: consultation, error } = await supabase
        .from('oracle_consultations')
        .insert({
          user_id: userId,
          type,
          question,
          response: JSON.stringify(response)
        })
        .select()
        .single();

      if (error) throw error;
      res.json({ consultation, response });
    } catch (error: any) {
      console.error('Oracle consultation error:', error);
      res.status(500).json({ message: 'Failed to process consultation' });
    }
  });

  // File upload example
  app.post('/api/upload', requireAuth, upload.single('file'), async (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Here you would typically upload to Supabase Storage
      // For now, just return success
      res.json({ 
        message: 'File uploaded successfully',
        filename: req.file.filename,
        originalName: req.file.originalname
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Failed to upload file' });
    }
  });

  // Error handling middleware
  app.use((err: any, req: Request, res: Response, next: any) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
  });

  const httpServer = createServer(app);
  return httpServer;
}