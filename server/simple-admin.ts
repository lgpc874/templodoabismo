import type { Express, Request, Response } from 'express';
import { supabaseAdmin } from './supabase-client';

export function registerSimpleAdminRoutes(app: Express) {
  // Simple stats endpoint without auth for testing
  app.get('/api/admin/stats/test', async (req: Request, res: Response) => {
    try {
      console.log('Testing admin stats endpoint...');
      
      const [usersCount, coursesCount, pagesCount] = await Promise.all([
        supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('courses').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('pages').select('*', { count: 'exact', head: true })
      ]);

      const stats = {
        totalUsers: usersCount.count || 0,
        totalCourses: coursesCount.count || 0,
        totalPages: pagesCount.count || 0,
        totalGrimoires: 3,
        totalArticles: 5,
        totalPublications: 8,
        totalVisits: 1247,
        monthlyGrowth: 15,
        activeUsers: 42,
        totalRevenue: "R$ 12.450,00",
        popularPages: [
          { name: 'Liber Prohibitus', views: 1247 },
          { name: 'Voz da Pluma', views: 892 },
          { name: 'Oráculo Abissal', views: 634 }
        ],
        recentActivity: [
          { action: 'Nova publicação da Voz da Pluma', timestamp: new Date().toLocaleDateString('pt-BR'), user: 'Sistema' },
          { action: 'Consulta ao Oráculo Abissal', timestamp: new Date().toLocaleDateString('pt-BR'), user: 'Iniciado' }
        ]
      };

      console.log('Stats response:', stats);
      res.json(stats);
    } catch (error) {
      console.error('Error in test stats:', error);
      res.status(500).json({ error: 'Failed to fetch test stats' });
    }
  });

  // Simple pages endpoint without auth for testing
  app.get('/api/admin/pages/test', async (req: Request, res: Response) => {
    try {
      console.log('Testing pages endpoint...');
      
      const { data, error } = await supabaseAdmin
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Pages query error:', error);
        return res.status(500).json({ error: error.message });
      }

      console.log('Pages found:', data?.length || 0);
      res.json(data || []);
    } catch (error) {
      console.error('Error in test pages:', error);
      res.status(500).json({ error: 'Failed to fetch test pages' });
    }
  });

  // Simple courses endpoint without auth for testing
  app.get('/api/admin/courses/test', async (req: Request, res: Response) => {
    try {
      console.log('Testing courses endpoint...');
      
      const { data, error } = await supabaseAdmin
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Courses query error:', error);
        return res.status(500).json({ error: error.message });
      }

      console.log('Courses found:', data?.length || 0);
      res.json(data || []);
    } catch (error) {
      console.error('Error in test courses:', error);
      res.status(500).json({ error: 'Failed to fetch test courses' });
    }
  });
}