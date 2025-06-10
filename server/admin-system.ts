import { supabase } from './supabase-client';
import { temploAI } from './ai-service';
import { voxPlumaAI } from './ai-vox-service';
import type { Express, Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email?: string;
    [key: string]: any;
  };
}
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configurar multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Middleware de autenticação
async function requireAuth(req: any, res: Response, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticação necessário' });
  }

  const token = authHeader.substring(7);
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();
    
    req.user = userData;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Erro de autenticação' });
  }
}

// Middleware de autorização admin
async function requireAdmin(req: any, res: Response, next: any) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado - privilégios de administrador necessários' });
  }
  next();
}

// Função para gerar SEO automático
function generateAutoSEO(title: string, content: string) {
  const metaTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
  const cleanContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const metaDescription = cleanContent.length > 160 ? cleanContent.substring(0, 157) + '...' : cleanContent;
  
  // Extrair palavras-chave do título e conteúdo
  const keywords = [
    ...title.toLowerCase().split(' '),
    ...cleanContent.toLowerCase().split(' ').slice(0, 20)
  ]
  .filter(word => word.length > 3)
  .filter((word, index, arr) => arr.indexOf(word) === index)
  .slice(0, 10)
  .join(', ');

  return {
    meta_title: metaTitle,
    meta_description: metaDescription,
    meta_keywords: keywords
  };
}

export function setupAdminRoutes(app: Express) {
  
  // ============ AUTENTICAÇÃO ============
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        return res.status(401).json({ error: error.message });
      }
      
      // Buscar dados do usuário
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      res.json({
        user: userData,
        session: data.session
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ PÁGINAS ============
  app.get('/api/admin/pages', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/admin/pages', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { title, content, status = 'draft', featured_image } = req.body;
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      // Gerar SEO automático
      const seoData = generateAutoSEO(title, content);
      
      const { data, error } = await supabase
        .from('pages')
        .insert({
          title,
          slug,
          content,
          featured_image,
          status,
          author_id: req.user.id,
          published_at: status === 'published' ? new Date().toISOString() : null,
          ...seoData
        })
        .select()
        .single();
      
      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/admin/pages/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, content, status, featured_image } = req.body;
      
      const updateData: any = {
        title,
        content,
        featured_image,
        status,
        updated_at: new Date().toISOString()
      };
      
      if (status === 'published') {
        updateData.published_at = new Date().toISOString();
        // Regenerar SEO se publicando
        const seoData = generateAutoSEO(title, content);
        Object.assign(updateData, seoData);
      }
      
      const { data, error } = await supabase
        .from('pages')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/admin/pages/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ CURSOS ============
  app.get('/api/admin/courses', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/admin/courses', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { 
        title, 
        description, 
        long_description,
        featured_image,
        price = 0,
        level = 'iniciante',
        duration_hours = 0,
        modules = [],
        requirements = [],
        what_you_learn = [],
        status = 'draft'
      } = req.body;
      
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const { data, error } = await supabase
        .from('courses')
        .insert({
          title,
          slug,
          description,
          long_description,
          featured_image,
          price,
          level,
          duration_hours,
          modules,
          requirements,
          what_you_learn,
          status,
          author_id: req.user.id,
          published_at: status === 'published' ? new Date().toISOString() : null
        })
        .select()
        .single();
      
      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/admin/courses/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updated_at: new Date().toISOString()
      };
      
      if (req.body.status === 'published') {
        updateData.published_at = new Date().toISOString();
      }
      
      const { data, error } = await supabase
        .from('courses')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/admin/courses/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ VOZ DA PLUMA ============
  app.get('/api/admin/voz-pluma/settings', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('category', 'voz_pluma');
      
      if (error) throw error;
      
      const settings = data.reduce((acc: any, setting: any) => {
        acc[setting.key] = JSON.parse(setting.value);
        return acc;
      }, {});
      
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/admin/voz-pluma/settings', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { interval, auto_enabled, custom_prompt } = req.body;
      
      const updates = [
        { key: 'voz_pluma_interval', value: JSON.stringify(interval) },
        { key: 'voz_pluma_auto', value: JSON.stringify(auto_enabled) },
        { key: 'voz_pluma_prompt', value: JSON.stringify(custom_prompt) }
      ];
      
      for (const update of updates) {
        await supabase
          .from('site_settings')
          .upsert({
            key: update.key,
            value: update.value,
            category: 'voz_pluma',
            updated_at: new Date().toISOString()
          });
      }
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/admin/voz-pluma/publish-now', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { custom_prompt } = req.body;
      
      await voxPlumaAI.publishPoem(custom_prompt);
      
      res.json({ success: true, message: 'Poema publicado com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ UPLOAD DE IMAGENS ============
  app.post('/api/admin/upload', requireAuth, requireAdmin, upload.single('image'), async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }
      
      const fileUrl = `/uploads/${req.file.filename}`;
      
      // Salvar informações do arquivo no banco
      const { data, error } = await supabase
        .from('media_library')
        .insert({
          filename: req.file.filename,
          original_name: req.file.originalname,
          mime_type: req.file.mimetype,
          file_size: req.file.size,
          file_path: fileUrl,
          uploaded_by: req.user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      res.json({
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size,
        media_id: data.id
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ CONFIGURAÇÕES GERAIS ============
  app.get('/api/admin/settings', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      
      const settings = data.reduce((acc: any, setting: any) => {
        acc[setting.key] = JSON.parse(setting.value);
        return acc;
      }, {});
      
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/admin/settings', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const settings = req.body;
      
      for (const [key, value] of Object.entries(settings)) {
        await supabase
          .from('site_settings')
          .upsert({
            key,
            value: JSON.stringify(value),
            category: 'general',
            updated_at: new Date().toISOString()
          });
      }
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ ESTATÍSTICAS ============
  app.get('/api/admin/stats', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const [usersCount, pagesCount, coursesCount, oracleCount] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('pages').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('oracle_consultations').select('*', { count: 'exact', head: true })
      ]);
      
      res.json({
        totalUsers: usersCount.count || 0,
        totalPages: pagesCount.count || 0,
        totalCourses: coursesCount.count || 0,
        totalConsultations: oracleCount.count || 0
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}