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
  // Test endpoint to verify routing
  app.get('/api/test', (req: Request, res: Response) => {
    res.json({ status: 'API routes working', timestamp: new Date().toISOString() });
  });

  // Oracle ritual consultation with entities - CRITICAL ENDPOINT
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

  // Oracle chat consultation with tiers
  app.post('/api/oracle/chat-consult', requireAuth, async (req: any, res: Response) => {
    try {
      const { question, tier, conversationHistory } = req.body;
      const userId = req.user?.id;
      
      if (!question?.trim() || !tier) {
        return res.status(400).json({ 
          error: 'Question and tier are required' 
        });
      }

      const isPremium = tier === 'premium';
      let response;

      try {
        if (isPremium) {
          response = await temploAI.generatePremiumChatResponse(question.trim(), conversationHistory || []);
        } else {
          response = await temploAI.generateFreeChatResponse(question.trim());
        }
      } catch (aiError) {
        console.error('AI service error:', aiError);
        if (isPremium) {
          response = temploAI.getFallbackPremiumResponse(question.trim());
        } else {
          response = temploAI.getFallbackFreeResponse(question.trim());
        }
      }

      // Save chat consultation to database
      try {
        await supabaseAdmin
          .from('oracle_chat_consultations')
          .insert({
            user_id: userId,
            question: question.trim(),
            response: response,
            tier: tier,
            created_at: new Date().toISOString()
          });
      } catch (dbError) {
        console.error('Database save error:', dbError);
      }

      res.json({ 
        success: true, 
        response,
        tier,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error in oracle chat consultation:', error);
      res.status(500).json({ error: 'Failed to perform chat consultation' });
    }
  });

  // Oracle ritual consultation with entities
  app.post('/api/oracle/ritual-consult', async (req: any, res: Response) => {
    try {
      console.log('Ritual consultation request received:', req.body);
      
      const { question, oracleType, entityName, conversationHistory } = req.body;
      
      if (!question?.trim() || !oracleType || !entityName) {
        console.log('Missing required fields:', { question: !!question, oracleType: !!oracleType, entityName: !!entityName });
        return res.status(400).json({ 
          error: 'Question, oracle type, and entity name are required' 
        });
      }

      console.log('Calling temploAI.generateRitualResponse with:', { question: question.trim(), oracleType, entityName });
      
      const result = await temploAI.generateRitualResponse(question.trim(), oracleType, entityName);
      
      console.log('AI response received:', { hasResponse: !!result.response, hasFarewell: !!result.farewell });
      
      res.json({
        success: true,
        response: result.response,
        farewell: result.farewell,
        entityName,
        oracleType,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error in ritual consultation:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ error: 'Failed to perform ritual consultation', details: error.message });
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

  // Catch-all for unmatched API routes - must be after all API route definitions
  app.use('/api/*', (req: Request, res: Response) => {
    console.log(`Unmatched API route: ${req.method} ${req.path}`);
    res.status(404).json({ error: 'API endpoint not found' });
  });

  // Error handling middleware
  app.use((err: any, req: Request, res: Response, next: any) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  const httpServer = createServer(app);
  return httpServer;
}