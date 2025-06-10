import { Request, Response, Express } from 'express';
import { eq } from 'drizzle-orm';
import { supabaseAdmin } from './supabase-client';
import { sitePages, educationalCourses, sacredGrimoires, users } from '../shared/schema';

async function requireAuth(req: any, res: Response, next: any) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token de autorização necessário' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    // Buscar dados completos do usuário
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();

    if (userError || !userData) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    req.user = userData;
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    res.status(401).json({ message: 'Erro de autenticação' });
  }
}

async function requireAdmin(req: any, res: Response, next: any) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado - necessário ser administrador' });
  }
  next();
}

export function registerCMSRoutes(app: Express) {
  
  // =================== ESTATÍSTICAS ===================
  app.get('/api/admin/stats', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const [usersCount, pagesCount, coursesCount, grimoiresCount] = await Promise.all([
        supabaseAdmin.from('users').select('id', { count: 'exact' }),
        supabaseAdmin.from('site_pages').select('id', { count: 'exact' }),
        supabaseAdmin.from('educational_courses').select('id', { count: 'exact' }),
        supabaseAdmin.from('sacred_grimoires').select('id', { count: 'exact' })
      ]);

      res.json({
        totalUsers: usersCount.count || 0,
        totalPages: pagesCount.count || 0,
        totalCourses: coursesCount.count || 0,
        totalGrimoires: grimoiresCount.count || 0,
        totalRevenue: "0.00"
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  // =================== PÁGINAS ===================
  app.get('/api/admin/pages', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { data: pages, error } = await supabaseAdmin
        .from('site_pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json(pages || []);
    } catch (error) {
      console.error('Erro ao buscar páginas:', error);
      res.status(500).json({ message: 'Erro ao buscar páginas' });
    }
  });

  app.post('/api/admin/pages', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { title, slug, content, type, status, meta_description, featured_image } = req.body;
      const userId = (req as any).user.id;

      const { data: page, error } = await supabaseAdmin
        .from('site_pages')
        .insert({
          title,
          slug,
          content,
          type: type || 'page',
          status: status || 'draft',
          meta_description,
          featured_image,
          author_id: userId,
          published_at: status === 'published' ? new Date().toISOString() : null
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json(page);
    } catch (error) {
      console.error('Erro ao criar página:', error);
      res.status(500).json({ message: 'Erro ao criar página' });
    }
  });

  app.put('/api/admin/pages/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, slug, content, type, status, meta_description, featured_image } = req.body;

      const updateData: any = {
        title,
        slug,
        content,
        type,
        status,
        meta_description,
        featured_image,
        updated_at: new Date().toISOString()
      };

      if (status === 'published') {
        updateData.published_at = new Date().toISOString();
      }

      const { data: page, error } = await supabaseAdmin
        .from('site_pages')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      res.json(page);
    } catch (error) {
      console.error('Erro ao atualizar página:', error);
      res.status(500).json({ message: 'Erro ao atualizar página' });
    }
  });

  app.delete('/api/admin/pages/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { error } = await supabaseAdmin
        .from('site_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir página:', error);
      res.status(500).json({ message: 'Erro ao excluir página' });
    }
  });

  // =================== CURSOS ===================
  app.get('/api/admin/courses', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { data: courses, error } = await supabaseAdmin
        .from('educational_courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json(courses || []);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      res.status(500).json({ message: 'Erro ao buscar cursos' });
    }
  });

  app.post('/api/admin/courses', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { 
        title, 
        description, 
        slug, 
        content, 
        difficulty_level, 
        price_brl, 
        duration_hours,
        requirements,
        what_you_learn,
        status,
        featured_image 
      } = req.body;
      const userId = (req as any).user.id;

      const { data: course, error } = await supabaseAdmin
        .from('educational_courses')
        .insert({
          title,
          description,
          slug,
          content,
          difficulty_level: parseInt(difficulty_level) || 1,
          price_brl: parseFloat(price_brl) || 0,
          duration_hours: parseInt(duration_hours) || 0,
          requirements: requirements || [],
          what_you_learn: what_you_learn || [],
          status: status || 'draft',
          featured_image,
          author_id: userId,
          published_at: status === 'published' ? new Date().toISOString() : null
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json(course);
    } catch (error) {
      console.error('Erro ao criar curso:', error);
      res.status(500).json({ message: 'Erro ao criar curso' });
    }
  });

  app.put('/api/admin/courses/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { 
        title, 
        description, 
        slug, 
        content, 
        difficulty_level, 
        price_brl, 
        duration_hours,
        requirements,
        what_you_learn,
        status,
        featured_image 
      } = req.body;

      const updateData: any = {
        title,
        description,
        slug,
        content,
        difficulty_level: parseInt(difficulty_level) || 1,
        price_brl: parseFloat(price_brl) || 0,
        duration_hours: parseInt(duration_hours) || 0,
        requirements: requirements || [],
        what_you_learn: what_you_learn || [],
        status,
        featured_image,
        updated_at: new Date().toISOString()
      };

      if (status === 'published') {
        updateData.published_at = new Date().toISOString();
      }

      const { data: course, error } = await supabaseAdmin
        .from('educational_courses')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      res.json(course);
    } catch (error) {
      console.error('Erro ao atualizar curso:', error);
      res.status(500).json({ message: 'Erro ao atualizar curso' });
    }
  });

  app.delete('/api/admin/courses/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { error } = await supabaseAdmin
        .from('educational_courses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir curso:', error);
      res.status(500).json({ message: 'Erro ao excluir curso' });
    }
  });

  // =================== GRIMÓRIOS ===================
  app.get('/api/admin/grimoires', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { data: grimoires, error } = await supabaseAdmin
        .from('sacred_grimoires')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json(grimoires || []);
    } catch (error) {
      console.error('Erro ao buscar grimórios:', error);
      res.status(500).json({ message: 'Erro ao buscar grimórios' });
    }
  });

  app.post('/api/admin/grimoires', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { 
        title, 
        content, 
        slug, 
        category, 
        access_level, 
        is_forbidden, 
        author, 
        status,
        excerpt,
        ritual_type,
        tradition,
        difficulty_rating,
        prerequisites,
        warnings,
        sacred_elements,
        moon_phase,
        planetary_influence,
        seasonal_timing,
        materials_needed,
        preparation_time,
        ritual_duration,
        safety_notes,
        historical_context,
        source_attribution,
        translation_notes,
        commentary,
        related_texts,
        tags
      } = req.body;

      const userId = (req as any).user.id;

      const { data: grimoire, error } = await supabaseAdmin
        .from('sacred_grimoires')
        .insert({
          title,
          content,
          slug,
          category,
          access_level: parseInt(access_level) || 1,
          is_forbidden: Boolean(is_forbidden),
          author,
          status: status || 'draft',
          excerpt: excerpt || '',
          ritual_type: ritual_type || 'general',
          tradition: tradition || 'luciferian',
          difficulty_rating: parseInt(difficulty_rating) || 1,
          prerequisites: prerequisites || [],
          warnings: warnings || [],
          sacred_elements: sacred_elements || [],
          moon_phase: moon_phase || null,
          planetary_influence: planetary_influence || null,
          seasonal_timing: seasonal_timing || null,
          materials_needed: materials_needed || [],
          preparation_time: preparation_time || null,
          ritual_duration: ritual_duration || null,
          safety_notes: safety_notes || '',
          historical_context: historical_context || '',
          source_attribution: source_attribution || '',
          translation_notes: translation_notes || '',
          commentary: commentary || '',
          related_texts: related_texts || [],
          tags: tags || [],
          author_id: userId,
          published_at: status === 'published' ? new Date().toISOString() : null
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json(grimoire);
    } catch (error) {
      console.error('Erro ao criar grimório:', error);
      res.status(500).json({ message: 'Erro ao criar grimório' });
    }
  });

  app.put('/api/admin/grimoires/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { 
        title, 
        content, 
        slug, 
        category, 
        access_level, 
        is_forbidden, 
        author, 
        status,
        excerpt,
        ritual_type,
        tradition,
        difficulty_rating,
        prerequisites,
        warnings,
        sacred_elements,
        moon_phase,
        planetary_influence,
        seasonal_timing,
        materials_needed,
        preparation_time,
        ritual_duration,
        safety_notes,
        historical_context,
        source_attribution,
        translation_notes,
        commentary,
        related_texts,
        tags
      } = req.body;

      const updateData: any = {
        title,
        content,
        slug,
        category,
        access_level: parseInt(access_level) || 1,
        is_forbidden: Boolean(is_forbidden),
        author,
        status,
        updated_at: new Date().toISOString()
      };

      // Add enhanced fields if provided
      if (excerpt !== undefined) updateData.excerpt = excerpt;
      if (ritual_type !== undefined) updateData.ritual_type = ritual_type;
      if (tradition !== undefined) updateData.tradition = tradition;
      if (difficulty_rating !== undefined) updateData.difficulty_rating = parseInt(difficulty_rating) || 1;
      if (prerequisites !== undefined) updateData.prerequisites = prerequisites || [];
      if (warnings !== undefined) updateData.warnings = warnings || [];
      if (sacred_elements !== undefined) updateData.sacred_elements = sacred_elements || [];
      if (moon_phase !== undefined) updateData.moon_phase = moon_phase;
      if (planetary_influence !== undefined) updateData.planetary_influence = planetary_influence;
      if (seasonal_timing !== undefined) updateData.seasonal_timing = seasonal_timing;
      if (materials_needed !== undefined) updateData.materials_needed = materials_needed || [];
      if (preparation_time !== undefined) updateData.preparation_time = preparation_time;
      if (ritual_duration !== undefined) updateData.ritual_duration = ritual_duration;
      if (safety_notes !== undefined) updateData.safety_notes = safety_notes;
      if (historical_context !== undefined) updateData.historical_context = historical_context;
      if (source_attribution !== undefined) updateData.source_attribution = source_attribution;
      if (translation_notes !== undefined) updateData.translation_notes = translation_notes;
      if (commentary !== undefined) updateData.commentary = commentary;
      if (related_texts !== undefined) updateData.related_texts = related_texts || [];
      if (tags !== undefined) updateData.tags = tags || [];

      // Update publication timestamp if publishing
      if (status === 'published') {
        updateData.published_at = new Date().toISOString();
      }

      const { data: grimoire, error } = await supabaseAdmin
        .from('sacred_grimoires')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      res.json(grimoire);
    } catch (error) {
      console.error('Erro ao atualizar grimório:', error);
      res.status(500).json({ message: 'Erro ao atualizar grimório' });
    }
  });

  app.delete('/api/admin/grimoires/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { error } = await supabaseAdmin
        .from('sacred_grimoires')
        .delete()
        .eq('id', id);

      if (error) throw error;

      res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir grimório:', error);
      res.status(500).json({ message: 'Erro ao excluir grimório' });
    }
  });

  // =================== USUÁRIOS ===================
  app.get('/api/admin/users', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { data: users, error } = await supabaseAdmin
        .from('users')
        .select('id, username, email, member_type, role, initiation_level, join_date, createdAt')
        .order('createdAt', { ascending: false });

      if (error) throw error;

      res.json(users || []);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
  });

  app.put('/api/admin/users/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { member_type, role, initiation_level } = req.body;

      const { data: user, error } = await supabaseAdmin
        .from('users')
        .update({
          member_type,
          role,
          initiation_level: parseInt(initiation_level) || 0
        })
        .eq('id', id)
        .select('id, username, email, member_type, role, initiation_level, join_date, createdAt')
        .single();

      if (error) throw error;

      res.json(user);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
  });

  // =================== ENDPOINTS PÚBLICOS PARA EXIBIR CONTEÚDO ===================
  app.get('/api/pages/:slug', async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;

      const { data: page, error } = await supabaseAdmin
        .from('site_pages')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error || !page) {
        return res.status(404).json({ message: 'Página não encontrada' });
      }

      res.json(page);
    } catch (error) {
      console.error('Erro ao buscar página:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  app.get('/api/courses/:slug', async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;

      const { data: course, error } = await supabaseAdmin
        .from('educational_courses')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error || !course) {
        return res.status(404).json({ message: 'Curso não encontrado' });
      }

      res.json(course);
    } catch (error) {
      console.error('Erro ao buscar curso:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  app.get('/api/grimoires/:slug', async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;

      const { data: grimoire, error } = await supabaseAdmin
        .from('sacred_grimoires')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error || !grimoire) {
        return res.status(404).json({ message: 'Grimório não encontrado' });
      }

      res.json(grimoire);
    } catch (error) {
      console.error('Erro ao buscar grimório:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });
}