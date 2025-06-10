import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import multer from 'multer';
import { temploAI } from './ai-service';
import { supabase, supabaseAdmin } from '../shared/supabase';

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

    // Get user profile
    const { data: profile } = await supabase
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

async function requireAdmin(req: any, res: Response, next: any) {
  if (!req.user?.role || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
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

  // Special endpoint to make first user admin
  app.post('/api/make-admin', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      console.log('Making admin request for email:', email);
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // First check if users table exists and get all users
      const { data: allUsers, error: allUsersError } = await supabase
        .from('users')
        .select('id, email, role');

      console.log('All users query result:', { allUsers, allUsersError });

      if (allUsersError) {
        console.error('Error querying users table:', allUsersError);
        return res.status(500).json({ error: 'Database error: ' + allUsersError.message });
      }

      // Check if there are any admins in the system
      const existingAdmins = allUsers?.filter(user => user.role === 'admin') || [];
      
      if (existingAdmins.length > 0) {
        return res.status(403).json({ error: 'Admin already exists in the system' });
      }

      // Find user by email
      const userData = allUsers?.find(user => user.email === email);

      if (!userData) {
        return res.status(404).json({ error: 'User not found with email: ' + email });
      }

      console.log('Found user to promote:', userData);

      // Update user to admin using service role client
      const { data: updatedUser, error: updateError } = await supabaseAdmin
        .from('users')
        .update({ role: 'admin' })
        .eq('id', userData.id)
        .select()
        .single();

      console.log('Update result:', { updatedUser, updateError });

      if (updateError) {
        console.error('Update error:', updateError);
        return res.status(500).json({ error: 'Failed to update user: ' + updateError.message });
      }

      res.json({ 
        success: true, 
        message: 'User successfully promoted to admin',
        user: updatedUser 
      });

    } catch (error: any) {
      console.error('Make admin error:', error);
      res.status(500).json({ error: 'Failed to make user admin: ' + error.message });
    }
  });

  // === AUTHENTICATION ENDPOINTS ===
  
  // Alternative registration endpoint that bypasses middleware issues
  app.post('/api/register', async (req: Request, res: Response) => {
    console.log('Registration attempt:', { email: req.body.email, username: req.body.username });
    
    try {
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      console.log('Creating auth user with admin client...');
      
      // Create user in Supabase Auth using admin privileges
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { 
          username,
          is_admin: false 
        }
      });

      console.log('Auth creation result:', { 
        success: !authError, 
        error: authError?.message,
        userId: authData?.user?.id 
      });

      if (authError) {
        console.error('Auth registration failed:', authError);
        return res.status(400).json({ error: authError.message });
      }

      if (!authData?.user?.id) {
        return res.status(500).json({ error: 'User creation failed - no ID returned' });
      }

      console.log('Auth user created successfully:', authData.user.id);

      // Try to create user profile in database
      try {
        const { data: profileData, error: profileError } = await supabaseAdmin
          .from('users')
          .insert({
            id: authData.user.id,
            username: username,
            email: email,
            password_hash: '',
            is_admin: false
          })
          .select()
          .single();

        if (profileError) {
          console.log('Profile creation failed, but auth user exists:', profileError);
        } else {
          console.log('Profile created successfully');
        }
      } catch (profileException) {
        console.log('Profile creation exception, but auth user exists:', profileException);
      }
      
      return res.status(201).json({ 
        success: true,
        message: 'User registered successfully',
        user: { 
          id: authData.user.id, 
          username: username, 
          email: email,
          is_admin: false
        }
      });

    } catch (error: any) {
      console.error('Registration exception:', error);
      res.status(500).json({ error: 'Registration failed: ' + error.message });
    }
  });

  // Main auth register endpoint (kept for compatibility) 
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    console.log('Auth register endpoint hit, redirecting to /api/register');
    
    // Forward the request to the working endpoint
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      // Create user in Supabase Auth using admin privileges
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { 
          username,
          is_admin: false 
        }
      });

      if (authError) {
        console.error('Auth registration failed:', authError);
        return res.status(400).json({ error: authError.message });
      }

      if (!authData?.user?.id) {
        return res.status(500).json({ error: 'User creation failed - no ID returned' });
      }

      console.log('Auth user created successfully:', authData.user.id);

      // Try to create user profile in database
      try {
        const { data: profileData, error: profileError } = await supabaseAdmin
          .from('users')
          .insert({
            id: authData.user.id,
            username: username,
            email: email,
            password_hash: '',
            is_admin: false
          })
          .select()
          .single();

        if (profileError) {
          console.log('Profile creation failed, but auth user exists:', profileError);
        } else {
          console.log('Profile created successfully');
        }
      } catch (profileException) {
        console.log('Profile creation exception, but auth user exists:', profileException);
      }
      
      return res.status(201).json({ 
        success: true,
        message: 'User registered successfully',
        user: { 
          id: authData.user.id, 
          username: username, 
          email: email,
          is_admin: false
        }
      });

    } catch (error: any) {
      console.error('Registration exception:', error);
      res.status(500).json({ error: 'Registration failed: ' + error.message });
    }
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Get user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError) {
        console.error('User profile fetch error:', userError);
      }

      res.json({ 
        success: true, 
        user: userData || { 
          id: data.user.id, 
          email: data.user.email 
        },
        session: data.session
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // === PUBLIC CONTENT ENDPOINTS ===
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

  // === DAILY CONTENT WITH AI ===
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
      console.error('Daily poem error:', error);
      res.status(500).json({ message: 'Failed to fetch daily poem' });
    }
  });

  app.get('/api/daily-quote', async (req: Request, res: Response) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_quotes')
        .select('*')
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) {
        // Generate new daily quote using AI
        const aiQuote = await temploAI.generateDailyQuote();
        const { data: newQuote, error: insertError } = await supabase
          .from('daily_quotes')
          .insert({
            content: aiQuote.content,
            author: aiQuote.author,
            date: today
          })
          .select()
          .single();

        if (insertError) throw insertError;
        res.json(newQuote);
      } else {
        res.json(data);
      }
    } catch (error: any) {
      console.error('Daily quote error:', error);
      res.status(500).json({ error: 'Failed to fetch daily quote' });
    }
  });

  // === ORACLE CONSULTATION WITH AI ===
  app.post('/api/oracle/consult', async (req: any, res: Response) => {
    try {
      const { type, question } = req.body;
      const userId = req.user?.id;

      if (!question || question.trim().length === 0) {
        return res.status(400).json({ error: 'Question is required' });
      }

      if (!type || !['tarot', 'mirror', 'runes', 'fire', 'voice'].includes(type)) {
        return res.status(400).json({ error: 'Valid oracle type is required (tarot, mirror, runes, fire, voice)' });
      }

      let result;
      
      switch (type) {
        case 'tarot':
          result = await temploAI.generateTarotReading(question);
          break;
        case 'mirror':
          result = await temploAI.generateMirrorReading(question);
          break;
        case 'runes':
          result = await temploAI.generateRuneReading(question);
          break;
        case 'fire':
          result = await temploAI.generateFireReading(question);
          break;
        case 'voice':
          result = await temploAI.generateAbyssalVoice(question);
          break;
        default:
          return res.status(400).json({ error: 'Invalid oracle type' });
      }

      // Store consultation in database if user is authenticated
      if (userId) {
        try {
          await supabase
            .from('oracle_consultations')
            .insert({
              user_id: userId,
              oracle_type: type,
              question: question,
              result: result,
              created_at: new Date().toISOString()
            });
        } catch (dbError) {
          console.log('Failed to store consultation in database:', dbError);
          // Continue without throwing error - consultation still works
        }
      }

      res.json({
        type,
        question,
        result,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Oracle consultation error:', error);
      res.status(500).json({ error: 'Oracle consultation failed: ' + error.message });
    }
  });

  // === ADMIN PANEL ENDPOINTS ===
  app.get('/api/admin/stats', requireAuth, requireAdmin, async (req: any, res: Response) => {
    try {
      // Get various stats
      const [usersResult, coursesResult, grimoiresResult, consultationsResult] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('grimoires').select('*', { count: 'exact', head: true }),
        supabase.from('oracle_consultations').select('*', { count: 'exact', head: true })
      ]);

      res.json({
        users: usersResult.count || 0,
        courses: coursesResult.count || 0,
        grimoires: grimoiresResult.count || 0,
        consultations: consultationsResult.count || 0
      });
    } catch (error: any) {
      console.error('Admin stats error:', error);
      res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
  });

  // Course management
  app.get('/api/admin/courses', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error: any) {
      console.error('Error fetching admin courses:', error);
      res.status(500).json({ message: 'Failed to fetch courses' });
    }
  });

  app.post('/api/admin/courses', requireAuth, requireAdmin, async (req: any, res: Response) => {
    try {
      const { title, description, level, content } = req.body;
      
      const { data, error } = await supabase
        .from('courses')
        .insert({
          title,
          description,
          level,
          content,
          created_by: req.user.id,
          is_published: false
        })
        .select()
        .single();

      if (error) throw error;
      res.json({ success: true, course: data });
    } catch (error: any) {
      console.error('Course creation error:', error);
      res.status(500).json({ error: 'Failed to create course' });
    }
  });

  app.put('/api/admin/courses/:id', requireAuth, requireAdmin, async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const { data, error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json({ success: true, course: data });
    } catch (error: any) {
      console.error('Course update error:', error);
      res.status(500).json({ error: 'Failed to update course' });
    }
  });

  app.delete('/api/admin/courses/:id', requireAuth, requireAdmin, async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      console.error('Course deletion error:', error);
      res.status(500).json({ error: 'Failed to delete course' });
    }
  });

  // Grimoire management
  app.get('/api/admin/grimoires', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabase
        .from('grimoires')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error: any) {
      console.error('Error fetching admin grimoires:', error);
      res.status(500).json({ message: 'Failed to fetch grimoires' });
    }
  });

  app.post('/api/admin/grimoires', requireAuth, requireAdmin, async (req: any, res: Response) => {
    try {
      const { title, description, content, price } = req.body;
      
      const { data, error } = await supabase
        .from('grimoires')
        .insert({
          title,
          description,
          content,
          price,
          created_by: req.user.id,
          is_published: false
        })
        .select()
        .single();

      if (error) throw error;
      res.json({ success: true, grimoire: data });
    } catch (error: any) {
      console.error('Grimoire creation error:', error);
      res.status(500).json({ error: 'Failed to create grimoire' });
    }
  });

  // AI Content Generation
  app.post('/api/generate/course', requireAuth, requireAdmin, async (req: any, res: Response) => {
    try {
      const { level, topic } = req.body;
      const courseContent = await temploAI.generateCourseContent(level, topic);
      res.json({ success: true, content: courseContent });
    } catch (error: any) {
      console.error('Course generation error:', error);
      res.status(500).json({ error: 'Failed to generate course content' });
    }
  });

  app.post('/api/generate/grimoire', requireAuth, requireAdmin, async (req: any, res: Response) => {
    try {
      const { title } = req.body;
      const grimoireContent = await temploAI.generateGrimoireContent(title);
      res.json({ success: true, content: grimoireContent });
    } catch (error: any) {
      console.error('Grimoire generation error:', error);
      res.status(500).json({ error: 'Failed to generate grimoire content' });
    }
  });

  // === USER PROFILE ROUTES ===
  app.get('/api/user/profile', requireAuth, async (req: any, res: Response) => {
    try {
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', req.user.id)
        .single();

      if (error) throw error;
      res.json(userProfile);
    } catch (error: any) {
      console.error('User profile error:', error);
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  });

  app.get('/api/user/progress', requireAuth, async (req: any, res: Response) => {
    try {
      const { data: enrollments, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (
            id, title, description, level, duration_weeks, modules
          )
        `)
        .eq('user_id', req.user.id);

      if (error) throw error;
      res.json(enrollments || []);
    } catch (error: any) {
      console.error('User progress error:', error);
      res.status(500).json({ error: 'Failed to fetch user progress' });
    }
  });

  app.get('/api/user/purchases', requireAuth, async (req: any, res: Response) => {
    try {
      const { data: purchases, error } = await supabase
        .from('grimoire_purchases')
        .select(`
          *,
          grimoires (
            id, title, author, category, price, rental_price
          )
        `)
        .eq('user_id', req.user.id);

      if (error) throw error;
      res.json(purchases || []);
    } catch (error: any) {
      console.error('User purchases error:', error);
      res.status(500).json({ error: 'Failed to fetch user purchases' });
    }
  });

  app.get('/api/user/rentals', requireAuth, async (req: any, res: Response) => {
    try {
      const { data: rentals, error } = await supabase
        .from('grimoire_rentals')
        .select(`
          *,
          grimoires (
            id, title, author, category, price, rental_price
          )
        `)
        .eq('user_id', req.user.id)
        .gte('expires_at', new Date().toISOString());

      if (error) throw error;
      res.json(rentals || []);
    } catch (error: any) {
      console.error('User rentals error:', error);
      res.status(500).json({ error: 'Failed to fetch user rentals' });
    }
  });

  app.get('/api/grimoires/:id/download', requireAuth, async (req: any, res: Response) => {
    try {
      const grimoireId = req.params.id;
      
      // Check if user has access (purchased or rented)
      const { data: purchase } = await supabase
        .from('grimoire_purchases')
        .select('*')
        .eq('user_id', req.user.id)
        .eq('grimoire_id', grimoireId)
        .single();

      const { data: rental } = await supabase
        .from('grimoire_rentals')
        .select('*')
        .eq('user_id', req.user.id)
        .eq('grimoire_id', grimoireId)
        .gte('expires_at', new Date().toISOString())
        .single();

      if (!purchase && !rental) {
        return res.status(403).json({ error: 'Access denied - grimoire not purchased or rented' });
      }

      const { data: grimoire } = await supabase
        .from('grimoires')
        .select('title, pdf_url')
        .eq('id', grimoireId)
        .single();

      if (!grimoire || !grimoire.pdf_url) {
        return res.status(404).json({ error: 'Grimoire file not found' });
      }

      res.json({
        downloadUrl: grimoire.pdf_url,
        filename: `${grimoire.title}.pdf`
      });
    } catch (error: any) {
      console.error('Download error:', error);
      res.status(500).json({ error: 'Failed to generate download link' });
    }
  });

  // File upload
  app.post('/api/upload', requireAuth, upload.single('file'), async (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileName = `${Date.now()}-${req.file.originalname}`;
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);

      res.json({ success: true, url: publicUrl });
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  });

  // Error handling middleware
  app.use((err: any, req: Request, res: Response, next: any) => {
    console.error('Server error:', err);
    res.status(500).json({ 
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}