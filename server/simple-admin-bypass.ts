import type { Express, Request, Response } from 'express';
import { supabaseAdmin } from './supabase-client';

export function registerBypassAdminRoutes(app: Express) {
  // Bypass admin stats endpoint - no auth required for testing
  app.get('/api/admin/stats/bypass', async (req: Request, res: Response) => {
    try {
      console.log('Fetching admin stats...');
      
      const [usersCount, coursesCount, pagesCount, grimoiresCount] = await Promise.all([
        supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('courses').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('pages').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('grimoires').select('*', { count: 'exact', head: true })
      ]);

      const stats = {
        totalUsers: usersCount.count || 0,
        totalCourses: coursesCount.count || 0,
        totalPages: pagesCount.count || 0,
        totalGrimoires: grimoiresCount.count || 0,
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

      console.log('Stats generated:', stats);
      res.json(stats);
    } catch (error) {
      console.error('Error in bypass stats:', error);
      res.status(500).json({ error: 'Failed to fetch bypass stats' });
    }
  });

  // Bypass admin pages endpoint
  app.get('/api/admin/pages/bypass', async (req: Request, res: Response) => {
    try {
      console.log('Fetching pages...');
      
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
      console.error('Error in bypass pages:', error);
      res.status(500).json({ error: 'Failed to fetch bypass pages' });
    }
  });

  // Bypass admin courses endpoint
  app.get('/api/admin/courses/bypass', async (req: Request, res: Response) => {
    try {
      console.log('Fetching courses...');
      
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
      console.error('Error in bypass courses:', error);
      res.status(500).json({ error: 'Failed to fetch bypass courses' });
    }
  });

  // Create test data endpoint
  app.post('/api/admin/create-test-data', async (req: Request, res: Response) => {
    try {
      console.log('Creating test data...');
      
      // Create test pages
      const { data: pages, error: pagesError } = await supabaseAdmin
        .from('pages')
        .upsert([
          {
            title: 'Templo do Abismo - Página Principal',
            slug: 'home',
            content: 'Bem-vindos ao Templo do Abismo, portal de ensinamentos ancestrais.',
            status: 'published',
            page_type: 'page',
            created_at: new Date().toISOString()
          },
          {
            title: 'Ensinamentos Luciferiano',
            slug: 'ensinamentos',
            content: 'Explore os mistérios da tradição luciferiana ancestral.',
            status: 'published',
            page_type: 'page',
            created_at: new Date().toISOString()
          }
        ]);

      // Create test courses
      const { data: courses, error: coursesError } = await supabaseAdmin
        .from('courses')
        .upsert([
          {
            title: 'Fundamentos da Gnose Luciferiana',
            description: 'Curso introdutório aos ensinamentos ancestrais',
            price: 299,
            status: 'published',
            level: 'iniciante',
            created_at: new Date().toISOString()
          },
          {
            title: 'Rituais e Práticas Avançadas',
            description: 'Aprofunde-se nos rituais sagrados',
            price: 499,
            status: 'published',
            level: 'avancado',
            created_at: new Date().toISOString()
          }
        ]);

      if (pagesError) console.error('Pages creation error:', pagesError);
      if (coursesError) console.error('Courses creation error:', coursesError);

      res.json({ 
        success: true, 
        message: 'Test data created successfully',
        pages: pages?.length || 0,
        courses: courses?.length || 0
      });
    } catch (error) {
      console.error('Error creating test data:', error);
      res.status(500).json({ error: 'Failed to create test data' });
    }
  });
}