-- Schema completo para Supabase - Templo do Abismo
-- Remover tabelas existentes se necessário e recriar estrutura completa

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabela de usuários principal
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  password TEXT NOT NULL,
  initiation_level INTEGER DEFAULT 1,
  personal_seal_generated BOOLEAN DEFAULT false,
  personal_seal_url TEXT,
  magical_name TEXT,
  member_type TEXT DEFAULT 'initiate',
  role TEXT DEFAULT 'user',
  courses_completed TEXT[],
  achievements TEXT[],
  join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  subscription_type TEXT DEFAULT 'free',
  subscription_expires_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de configurações do site
CREATE TABLE IF NOT EXISTS site_config (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  category TEXT DEFAULT 'general',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de páginas do site
CREATE TABLE IF NOT EXISTS pages (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  meta_description TEXT,
  meta_keywords TEXT,
  is_published BOOLEAN DEFAULT false,
  featured_image TEXT,
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  page_type TEXT DEFAULT 'page',
  seo_title TEXT,
  canonical_url TEXT
);

-- Tabela de cursos
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  level INTEGER NOT NULL,
  price_brl INTEGER DEFAULT 0,
  duration_hours INTEGER,
  instructor TEXT,
  cover_image TEXT,
  is_active BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  modules JSONB DEFAULT '[]',
  prerequisites TEXT[],
  learning_objectives TEXT[],
  certificate_available BOOLEAN DEFAULT false,
  max_students INTEGER,
  enrolled_count INTEGER DEFAULT 0,
  meta_description TEXT,
  meta_keywords TEXT,
  seo_title TEXT
);

-- Tabela de níveis/módulos dos cursos
CREATE TABLE IF NOT EXISTS course_levels (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  level_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  video_url TEXT,
  materials JSONB DEFAULT '[]',
  assignments JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT false,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de inscrições em cursos
CREATE TABLE IF NOT EXISTS course_enrollments (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  status TEXT DEFAULT 'active',
  payment_status TEXT DEFAULT 'pending',
  payment_id TEXT,
  UNIQUE(user_id, course_id)
);

-- Tabela de progresso dos usuários nos cursos
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  level_id INTEGER REFERENCES course_levels(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  score DECIMAL(5,2),
  notes TEXT,
  UNIQUE(user_id, course_id, level_id)
);

-- Tabela de grimórios
CREATE TABLE IF NOT EXISTS grimoires (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  chapters JSONB DEFAULT '[]',
  access_level INTEGER DEFAULT 1,
  rental_days INTEGER DEFAULT 30,
  pdf_url TEXT,
  cover_image TEXT,
  can_read_online BOOLEAN DEFAULT true,
  can_download BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  price_brl INTEGER DEFAULT 0,
  rental_price_brl INTEGER DEFAULT 0,
  author TEXT,
  total_pages INTEGER,
  file_size_mb DECIMAL(10,2),
  meta_description TEXT,
  meta_keywords TEXT,
  seo_title TEXT
);

-- Tabela de aluguéis de grimórios
CREATE TABLE IF NOT EXISTS grimoire_rentals (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  grimoire_id INTEGER REFERENCES grimoires(id) ON DELETE CASCADE,
  rented_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  payment_id TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Tabela de categorias do blog
CREATE TABLE IF NOT EXISTS blog_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id INTEGER REFERENCES blog_categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  meta_description TEXT,
  seo_title TEXT
);

-- Tabela de tags do blog
CREATE TABLE IF NOT EXISTS blog_tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usage_count INTEGER DEFAULT 0
);

-- Tabela de posts do blog (Voz da Pluma)
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES users(id),
  category_id INTEGER REFERENCES blog_categories(id),
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  meta_description TEXT,
  meta_keywords TEXT,
  seo_title TEXT,
  generated_by_ai BOOLEAN DEFAULT false,
  ai_prompt TEXT,
  reading_time_minutes INTEGER
);

-- Tabela de tags dos posts (relacionamento many-to-many)
CREATE TABLE IF NOT EXISTS post_tags (
  post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Tabela de citações diárias
CREATE TABLE IF NOT EXISTS daily_quotes (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  date DATE UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category TEXT DEFAULT 'wisdom',
  is_active BOOLEAN DEFAULT true
);

-- Tabela de poemas diários
CREATE TABLE IF NOT EXISTS daily_poems (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  date DATE UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category TEXT DEFAULT 'mystical',
  is_active BOOLEAN DEFAULT true
);

-- Tabela de consultas ao oráculo
CREATE TABLE IF NOT EXISTS oracle_consultations (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  consultation_type TEXT NOT NULL, -- tarot, runes, fire, mirror, abyssal_voice
  question TEXT NOT NULL,
  response JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_private BOOLEAN DEFAULT true,
  rating INTEGER,
  feedback TEXT
);

-- Tabela de histórico de consultas do oráculo
CREATE TABLE IF NOT EXISTS oracle_history (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  consultation_id INTEGER REFERENCES oracle_consultations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de compartilhamentos da Voz da Pluma
CREATE TABLE IF NOT EXISTS pluma_shares (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  platform TEXT NOT NULL,
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET
);

-- Tabela de newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  preferences JSONB DEFAULT '{}',
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de pagamentos
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount_brl INTEGER NOT NULL,
  currency TEXT DEFAULT 'BRL',
  payment_method TEXT NOT NULL, -- paypal, infinitepay, pix, etc
  payment_provider_id TEXT,
  status TEXT DEFAULT 'pending',
  item_type TEXT NOT NULL, -- course, grimoire, subscription
  item_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'
);

-- Tabela de mídia/uploads
CREATE TABLE IF NOT EXISTS media_files (
  id SERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  alt_text TEXT,
  caption TEXT,
  is_public BOOLEAN DEFAULT false
);

-- Tabela de sessões (para autenticação)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_published ON pages(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_oracle_consultations_user ON oracle_consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_oracle_consultations_type ON oracle_consultations(consultation_type);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_config_updated_at BEFORE UPDATE ON site_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir configurações iniciais
INSERT INTO site_config (key, value, category) VALUES 
('site_title', '"Templo do Abismo - Portal de Ensinamentos Ancestrais"', 'general'),
('site_description', '"Portal dedicado aos ensinamentos ancestrais e desenvolvimento espiritual"', 'general'),
('oracle_enabled', 'true', 'features'),
('voz_pluma_enabled', 'true', 'content'),
('voz_pluma_auto_publish', 'false', 'content'),
('voz_pluma_frequency_hours', '24', 'content'),
('seo_auto_enabled', 'true', 'seo'),
('payments_enabled', 'true', 'payments'),
('paypal_enabled', 'true', 'payments'),
('infinitepay_enabled', 'true', 'payments'),
('pix_enabled', 'true', 'payments')
ON CONFLICT (key) DO NOTHING;

-- Criar usuário admin
INSERT INTO users (email, username, password, role, member_type, initiation_level) 
VALUES ('admin@templodoabismo.com', 'admin', '$2b$10$YQiZKpZ8pZ8pZ8pZ8pZ8pOe', 'admin', 'admin', 5)
ON CONFLICT (email) DO UPDATE SET 
  role = 'admin',
  member_type = 'admin',
  initiation_level = 5;

-- Políticas RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE oracle_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE grimoire_rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Políticas para consultas do oráculo
CREATE POLICY "Users can view own consultations" ON oracle_consultations FOR SELECT USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can create consultations" ON oracle_consultations FOR INSERT WITH CHECK (user_id = auth.uid());

-- Função para gerar hash de senha
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar senha
CREATE OR REPLACE FUNCTION verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN hash = crypt(password, hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;