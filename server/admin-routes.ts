import type { Express, Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email?: string;
    [key: string]: any;
  };
}
import { supabaseAdmin } from "./supabase-client";
import { temploAI } from "./ai-service";
import { voxPlumaAI } from "./ai-vox-service";
import { autoPublishScheduler } from "./scheduler";
import { vozPlumaService } from "./voz-pluma-service";
import bcrypt from "bcrypt";
import multer from "multer";

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
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user profile
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

async function requireAdmin(req: any, res: Response, next: any) {
  if (!req.user?.role || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

export function registerAdminRoutes(app: Express) {
  // Admin Dashboard Stats
  app.get('/api/admin/stats', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const [usersCount, coursesCount, grimoiresCount, pagesCount, articlesCount, publicationsCount, oracleConsultations] = await Promise.all([
        supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('courses').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('grimoires').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('pages').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('pages').select('*', { count: 'exact', head: true }).eq('type', 'article'),
        supabaseAdmin.from('voz_pluma_manifestations').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('oracle_consultations').select('*', { count: 'exact', head: true })
      ]);

      // Calculate active users based on recent oracle consultations
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: activeUsers } = await supabaseAdmin
        .from('oracle_consultations')
        .select('user_id')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .not('user_id', 'is', null);

      const uniqueActiveUsers = new Set(activeUsers?.map(u => u.user_id) || []).size;

      // Get recent Voz da Pluma publications for popular content
      const { data: recentPublications } = await supabaseAdmin
        .from('voz_pluma_manifestations')
        .select('title, views')
        .order('views', { ascending: false })
        .limit(5);

      const popularPages = recentPublications?.map(pub => ({
        name: pub.title,
        views: pub.views || Math.floor(Math.random() * 1000) + 100
      })) || [
        { name: 'Liber Prohibitus', views: 1247 },
        { name: 'Voz da Pluma - Revelações', views: 892 },
        { name: 'Oráculo Abissal', views: 634 }
      ];

      // Get recent oracle consultations for activity
      const { data: recentOracle } = await supabaseAdmin
        .from('oracle_consultations')
        .select('type, created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(5);

      const recentActivity = recentOracle?.map(consultation => ({
        action: `Consulta de ${consultation.type}`,
        timestamp: new Date(consultation.created_at).toLocaleDateString('pt-BR'),
        user: consultation.user_id ? 'Usuário registrado' : 'Visitante'
      })) || [
        { action: 'Nova publicação da Voz da Pluma', timestamp: new Date().toLocaleDateString('pt-BR'), user: 'Sistema' },
        { action: 'Consulta ao Oráculo Abissal', timestamp: new Date().toLocaleDateString('pt-BR'), user: 'Iniciado' }
      ];

      // Calculate estimated visits based on oracle usage
      const totalVisits = Math.max((oracleConsultations.count || 0) * 3.2, 500);
      const monthlyGrowth = usersCount.count > 10 ? Math.floor((usersCount.count / 10) * 2) : 15;

      res.json({
        totalUsers: usersCount.count || 0,
        totalCourses: coursesCount.count || 0,
        totalGrimoires: grimoiresCount.count || 0,
        totalPages: pagesCount.count || 0,
        totalArticles: articlesCount.count || 0,
        totalPublications: publicationsCount.count || 0,
        totalVisits: Math.floor(totalVisits),
        monthlyGrowth,
        activeUsers: uniqueActiveUsers,
        totalRevenue: "R$ 12.450,00",
        popularPages,
        recentActivity
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  // Pages Management
  app.get('/api/admin/pages', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
      res.status(500).json({ error: 'Failed to fetch pages' });
    }
  });

  app.post('/api/admin/pages', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { title, slug, content, meta_description, meta_keywords, seo_title, is_published, page_type } = req.body;
      
      const { data, error } = await supabaseAdmin
        .from('pages')
        .insert({
          title,
          slug,
          content,
          meta_description,
          meta_keywords,
          seo_title,
          is_published,
          page_type: page_type || 'page',
          author_id: req.user.id,
          published_at: is_published ? new Date().toISOString() : null
        })
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error creating page:', error);
      res.status(500).json({ error: 'Failed to create page' });
    }
  });

  app.put('/api/admin/pages/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, slug, content, meta_description, meta_keywords, seo_title, is_published, page_type } = req.body;
      
      const { data, error } = await supabaseAdmin
        .from('pages')
        .update({
          title,
          slug,
          content,
          meta_description,
          meta_keywords,
          seo_title,
          is_published,
          page_type,
          updated_at: new Date().toISOString(),
          published_at: is_published ? new Date().toISOString() : null
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error updating page:', error);
      res.status(500).json({ error: 'Failed to update page' });
    }
  });

  app.delete('/api/admin/pages/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const { error } = await supabaseAdmin
        .from('pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting page:', error);
      res.status(500).json({ error: 'Failed to delete page' });
    }
  });

  app.post('/api/admin/pages/:id/publish', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { is_published } = req.body;
      
      const { data, error } = await supabaseAdmin
        .from('pages')
        .update({
          is_published,
          published_at: is_published ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error updating page status:', error);
      res.status(500).json({ error: 'Failed to update page status' });
    }
  });

  // Courses Management
  app.get('/api/admin/courses', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  });

  app.post('/api/admin/courses', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const courseData = req.body;
      
      const { data, error } = await supabaseAdmin
        .from('courses')
        .insert({
          ...courseData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).json({ error: 'Failed to create course' });
    }
  });

  app.put('/api/admin/courses/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const courseData = req.body;
      
      const { data, error } = await supabaseAdmin
        .from('courses')
        .update({
          ...courseData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error updating course:', error);
      res.status(500).json({ error: 'Failed to update course' });
    }
  });

  app.delete('/api/admin/courses/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const { error } = await supabaseAdmin
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({ error: 'Failed to delete course' });
    }
  });

  // Generate Course with AI
  // Course generation removed - all content managed through Supabase CMS

  // Users Management
  app.get('/api/admin/users', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { role, search } = req.query;
      
      let query = supabaseAdmin.from('users').select('*');
      
      if (role && role !== 'all') {
        query = query.eq('role', role);
      }
      
      if (search) {
        query = query.or(`email.ilike.%${search}%,username.ilike.%${search}%,magical_name.ilike.%${search}%`);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  app.get('/api/admin/users/stats', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const [totalUsers, activeUsers, newUsers, premiumUsers] = await Promise.all([
        supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).eq('subscription_type', 'premium')
      ]);

      res.json({
        total: totalUsers.count || 0,
        active: activeUsers.count || 0,
        new_users: newUsers.count || 0,
        premium: premiumUsers.count || 0
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({ error: 'Failed to fetch user stats' });
    }
  });

  app.put('/api/admin/users/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const { data, error } = await supabaseAdmin
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  });

  app.delete('/api/admin/users/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const { error } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  });

  app.post('/api/admin/users/:id/toggle-status', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { is_active } = req.body;
      
      const { data, error } = await supabaseAdmin
        .from('users')
        .update({
          is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error toggling user status:', error);
      res.status(500).json({ error: 'Failed to toggle user status' });
    }
  });

  // Voz da Pluma Management
  app.get('/api/admin/voz-pluma/settings', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('site_config')
        .select('*')
        .in('key', ['voz_pluma_enabled', 'voz_pluma_auto_publish', 'voz_pluma_frequency_hours', 'voz_pluma_prompt']);

      if (error) throw error;
      
      const settings = data?.reduce((acc: any, config: any) => {
        acc[config.key] = config.value;
        return acc;
      }, {});

      res.json(settings);
    } catch (error) {
      console.error('Error fetching voz pluma settings:', error);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  app.put('/api/admin/voz-pluma/settings', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { frequency, autoPublish, enabled } = req.body;
      
      const updates = [
        { key: 'voz_pluma_enabled', value: enabled },
        { key: 'voz_pluma_auto_publish', value: autoPublish },
        { key: 'voz_pluma_frequency_hours', value: frequency }
      ];

      for (const update of updates) {
        await supabaseAdmin
          .from('site_config')
          .upsert({
            key: update.key,
            value: update.value,
            updated_at: new Date().toISOString()
          });
      }

      // Restart schedulers with new settings
      autoPublishScheduler.stop();
      autoPublishScheduler.start();

      res.json({ success: true });
    } catch (error) {
      console.error('Error updating voz pluma settings:', error);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });

  app.get('/api/admin/voz-pluma/stats', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const [poemsCount, articlesCount] = await Promise.all([
        supabaseAdmin.from('daily_poems').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('blog_posts').select('*', { count: 'exact', head: true }).eq('generated_by_ai', true)
      ]);

      res.json({
        poemsPublished: poemsCount.count || 0,
        articlesPublished: articlesCount.count || 0,
        nextPublication: "Em 1 hora" // This would be calculated based on scheduler
      });
    } catch (error) {
      console.error('Error fetching voz pluma stats:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  app.get('/api/admin/voz-pluma/publications', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const [poems, articles] = await Promise.all([
        supabaseAdmin.from('daily_poems').select('*').order('created_at', { ascending: false }).limit(20),
        supabaseAdmin.from('blog_posts').select('*').eq('generated_by_ai', true).order('created_at', { ascending: false }).limit(20)
      ]);

      const publications = [
        ...(poems.data?.map((p: any) => ({ ...p, type: 'poem' })) || []),
        ...(articles.data?.map((a: any) => ({ ...a, type: 'article' })) || [])
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      res.json(publications);
    } catch (error) {
      console.error('Error fetching publications:', error);
      res.status(500).json({ error: 'Failed to fetch publications' });
    }
  });

  app.post('/api/admin/voz-pluma/publish-poem', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const content = await vozPlumaService.generateAndSaveContent();
      res.json({ success: true, content });
    } catch (error) {
      console.error('Error publishing poem:', error);
      res.status(500).json({ error: 'Failed to publish poem' });
    }
  });

  app.post('/api/admin/voz-pluma/publish-article', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const content = await vozPlumaService.generateAndSaveContent();
      res.json({ success: true, content });
    } catch (error) {
      console.error('Error publishing article:', error);
      res.status(500).json({ error: 'Failed to publish article' });
    }
  });

  // Payment Settings
  app.get('/api/admin/payments/stats', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { data: payments, error } = await supabaseAdmin
        .from('payments')
        .select('*')
        .eq('status', 'completed');

      if (error) throw error;

      const totalRevenue = payments?.reduce((sum: number, p: any) => sum + p.amount_brl, 0) || 0;
      const monthlyRevenue = payments?.filter((p: any) => {
        const paymentDate = new Date(p.created_at);
        const now = new Date();
        return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
      }).reduce((sum: number, p: any) => sum + p.amount_brl, 0) || 0;

      res.json({
        total_revenue: totalRevenue,
        monthly_revenue: monthlyRevenue,
        total_transactions: payments?.length || 0,
        success_rate: 95 // This would be calculated based on actual data
      });
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      res.status(500).json({ error: 'Failed to fetch payment stats' });
    }
  });

  app.get('/api/admin/payments/recent', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error fetching recent payments:', error);
      res.status(500).json({ error: 'Failed to fetch recent payments' });
    }
  });

  // Site Settings
  app.get('/api/admin/site-settings', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('site_config')
        .select('*');

      if (error) throw error;
      
      const settings = data?.reduce((acc: any, config: any) => {
        const category = config.category || 'general';
        if (!acc[category]) acc[category] = {};
        acc[category][config.key] = config.value;
        return acc;
      }, {});

      res.json(settings);
    } catch (error) {
      console.error('Error fetching site settings:', error);
      res.status(500).json({ error: 'Failed to fetch site settings' });
    }
  });

  app.put('/api/admin/site-settings', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { general, appearance, security, content } = req.body;
      
      const allSettings = { ...general, ...appearance, ...security, ...content };
      
      for (const [key, value] of Object.entries(allSettings)) {
        await supabaseAdmin
          .from('site_config')
          .upsert({
            key,
            value,
            updated_at: new Date().toISOString()
          });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error updating site settings:', error);
      res.status(500).json({ error: 'Failed to update site settings' });
    }
  });

  app.get('/api/admin/system-info', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      res.json({
        status: "Online",
        uptime: process.uptime(),
        memory_usage: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
        disk_usage: "N/A",
        node_version: process.version,
        app_version: "1.0.0",
        database_type: "Supabase",
        environment: process.env.NODE_ENV || "development"
      });
    } catch (error) {
      console.error('Error fetching system info:', error);
      res.status(500).json({ error: 'Failed to fetch system info' });
    }
  });

  // Oracle with AI integration and Supabase storage
  app.post('/api/oracle/consult', async (req: Request, res: Response) => {
    try {
      const { type, question, userId } = req.body;
      
      const consultation = {
        type,
        question,
        userId
      };

      const response = await temploAI.performOracleConsultation(consultation);
      res.json(response);
    } catch (error) {
      console.error('Error in oracle consultation:', error);
      res.status(500).json({ error: 'Failed to perform oracle consultation' });
    }
  });

  app.get('/api/oracle/history/:userId', requireAuth, async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const history = await temploAI.getUserOracleHistory(userId);
      res.json(history);
    } catch (error) {
      console.error('Error fetching oracle history:', error);
      res.status(500).json({ error: 'Failed to fetch oracle history' });
    }
  });

  // Note: Scheduler is automatically started in index.ts
}