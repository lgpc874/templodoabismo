-- =====================================================
-- TEMPLO DO ABISMO - SUPABASE DATABASE SETUP COMPLETO
-- =====================================================

-- 1. TABELA DE USUÁRIOS
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  
  -- Dados de iniciação
  initiation_level INTEGER DEFAULT 0,
  personal_seal_generated BOOLEAN DEFAULT false,
  personal_seal_url TEXT,
  magical_name TEXT,
  member_type TEXT DEFAULT 'visitante', -- visitante, iniciado, vip
  role TEXT NOT NULL DEFAULT 'user',
  
  -- Sistema T'KAZH (créditos)
  tkazh_credits INTEGER DEFAULT 100,
  tkazh_purchased INTEGER DEFAULT 0,
  last_weekly_reset TIMESTAMP DEFAULT NOW(),
  vip_daily_bonus BOOLEAN DEFAULT false,
  last_daily_bonus TIMESTAMP,
  
  courses_completed TEXT[] DEFAULT '{}',
  achievements TEXT[] DEFAULT '{}',
  join_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. SESSÕES ADMINISTRATIVAS
CREATE TABLE IF NOT EXISTS admin_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. CONFIGURAÇÕES DO SITE
CREATE TABLE IF NOT EXISTS site_config (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  category TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. SEÇÕES DE CONTEÚDO
CREATE TABLE IF NOT EXISTS content_sections (
  id SERIAL PRIMARY KEY,
  page_id TEXT NOT NULL,
  section_type TEXT NOT NULL,
  title TEXT,
  content TEXT,
  image_url TEXT,
  "order" INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  custom_styles JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. CURSOS
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty_level INTEGER DEFAULT 1,
  total_levels INTEGER DEFAULT 1,
  base_price_brl DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  featured_image TEXT,
  tags TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  what_you_learn TEXT[] DEFAULT '{}',
  includes TEXT[] DEFAULT '{}',
  instructor TEXT,
  estimated_duration TEXT,
  certification_available BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. NÍVEIS DE CURSOS
CREATE TABLE IF NOT EXISTS course_levels (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) NOT NULL,
  level_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price_brl DECIMAL(10,2),
  content_modules JSONB,
  duration_hours INTEGER,
  materials_included TEXT[] DEFAULT '{}',
  unlock_requirements TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 7. INSCRIÇÕES EM CURSOS
CREATE TABLE IF NOT EXISTS course_enrollments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  course_id INTEGER REFERENCES courses(id) NOT NULL,
  enrollment_type TEXT NOT NULL, -- full_course, single_level
  level_id INTEGER REFERENCES course_levels(id),
  status TEXT DEFAULT 'active', -- active, completed, cancelled
  progress_percentage INTEGER DEFAULT 0,
  purchase_price_brl DECIMAL(10,2),
  enrolled_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- 8. GRIMÓRIOS
CREATE TABLE IF NOT EXISTS grimoires (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  author TEXT NOT NULL,
  level TEXT NOT NULL, -- iniciante, intermediario, avancado
  access_level TEXT NOT NULL, -- free, premium, vip
  purchase_price_brl DECIMAL(10,2),
  rental_price_brl DECIMAL(10,2),
  chapter_price_brl DECIMAL(10,2),
  rental_days INTEGER DEFAULT 30,
  total_chapters INTEGER DEFAULT 1,
  pdf_url TEXT,
  cover_image TEXT,
  enable_rental BOOLEAN DEFAULT false,
  enable_purchase BOOLEAN DEFAULT true,
  enable_chapter_purchase BOOLEAN DEFAULT false,
  enable_online_reading BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 9. CAPÍTULOS DE GRIMÓRIOS
CREATE TABLE IF NOT EXISTS grimoire_chapters (
  id SERIAL PRIMARY KEY,
  grimoire_id INTEGER REFERENCES grimoires(id) NOT NULL,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  is_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 10. ACESSO A GRIMÓRIOS
CREATE TABLE IF NOT EXISTS grimoire_access (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  grimoire_id INTEGER REFERENCES grimoires(id) NOT NULL,
  access_type TEXT NOT NULL, -- purchase, rental, chapter
  chapter_id INTEGER REFERENCES grimoire_chapters(id),
  granted_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  purchase_price_brl DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true
);

-- 11. PAGAMENTOS
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  item_type TEXT NOT NULL, -- course, grimoire, credits, vip
  item_id TEXT,
  amount_brl DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL, -- pix, paypal, stripe
  payment_provider TEXT NOT NULL,
  provider_payment_id TEXT,
  status TEXT DEFAULT 'pending', -- pending, completed, failed, cancelled
  provider_status TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 12. MANIFESTAÇÕES VOZ DA PLUMA
CREATE TABLE IF NOT EXISTS voz_pluma_manifestations (
  id SERIAL PRIMARY KEY,
  manifestation_time TEXT NOT NULL, -- '07:00', '09:00', '11:00'
  type TEXT NOT NULL, -- 'ritual', 'verso', 'reflexao'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  posted_date TEXT NOT NULL, -- YYYY-MM-DD
  posted_at TIMESTAMP DEFAULT NOW(),
  is_current BOOLEAN DEFAULT true
);

-- 13. CONSULTAS ORACULARES
CREATE TABLE IF NOT EXISTS oracle_consultations (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  consultation_type TEXT NOT NULL, -- tarot, runes, mirror, fire, abyssal
  question TEXT NOT NULL,
  response JSONB NOT NULL,
  cost_credits INTEGER DEFAULT 0,
  ritual_type TEXT, -- for ritual consultations
  entity_name TEXT, -- for ritual consultations
  created_at TIMESTAMP DEFAULT NOW()
);

-- 14. TRANSAÇÕES T'KAZH
CREATE TABLE IF NOT EXISTS tkazh_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  transaction_type TEXT NOT NULL, -- credit, debit, purchase, bonus
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  reference_type TEXT, -- oracle, course, vip, manual
  reference_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 15. MENSAGENS DE CHAT
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  chat_type TEXT NOT NULL, -- free, premium
  cost_credits INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 16. SELOS PESSOAIS
CREATE TABLE IF NOT EXISTS personal_seals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  magical_name TEXT NOT NULL,
  seal_image_url TEXT NOT NULL,
  seal_description TEXT NOT NULL,
  energy_type TEXT NOT NULL,
  generated_at TIMESTAMP DEFAULT NOW()
);

-- 17. POSTS DO BLOG
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured_image TEXT,
  seo_title TEXT,
  seo_description TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 18. ASSINANTES DA NEWSLETTER
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  subscription_type TEXT DEFAULT 'general',
  preferences JSONB,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  unsubscribed_at TIMESTAMP
);

-- =====================================================
-- INSERÇÃO DE DADOS INICIAIS
-- =====================================================

-- Configurações básicas do site
INSERT INTO site_config (key, value, category) VALUES
('site_title', '"Templo do Abismo"', 'general'),
('site_description', '"Portal místico de ensinamentos luciferianos ancestrais"', 'general'),
('maintenance_mode', 'false', 'system'),
('voz_pluma_enabled', 'true', 'features'),
('oracle_enabled', 'true', 'features'),
('courses_enabled', 'true', 'features'),
('grimoires_enabled', 'true', 'features')
ON CONFLICT (key) DO NOTHING;

-- Manifestações iniciais da Voz da Pluma
INSERT INTO voz_pluma_manifestations (manifestation_time, type, title, content, author, posted_date, is_current) VALUES
('07:00', 'dica', 'Despertar da Consciência', 'Ao amanhecer, quando as energias se renovam, permita que sua consciência desperte não apenas para o mundo físico, mas para as dimensões superiores de sua essência. O primeiro pensamento do dia molda toda a jornada.', 'Escriba do Templo', CURRENT_DATE::TEXT, true),
('09:00', 'verso', 'Verso da Manhã', 'Nas brumas matinais da existência,\nEu caminho entre mundos visíveis e ocultos,\nCarregando em mim a chama ancestral\nQue jamais se extingue.', 'Voz da Pluma', CURRENT_DATE::TEXT, true),
('11:00', 'reflexao', 'Reflexão do Meio-Dia', 'No auge do dia, quando o sol atinge seu zênite, reflita sobre o poder que reside em você. Cada decisão, cada pensamento, cada ação carrega o potencial de transformação. Use-o conscientemente.', 'Guardião da Sabedoria', CURRENT_DATE::TEXT, true)
ON CONFLICT DO NOTHING;

-- Curso inicial de exemplo
INSERT INTO courses (title, description, category, difficulty_level, total_levels, base_price_brl, instructor, estimated_duration, is_active) VALUES
('Fundamentos da Gnose Luciferiana', 'Introdução aos conceitos fundamentais e práticas básicas da tradição luciferiana ancestral.', 'Iniciação', 1, 3, 197.00, 'Mestre do Templo', '4 semanas', true)
ON CONFLICT DO NOTHING;

-- Grimório inicial de exemplo
INSERT INTO grimoires (title, description, author, level, access_level, purchase_price_brl, total_chapters, cover_image, is_active) VALUES
('Liber Prohibitus', 'Manuscrito ancestral contendo os fundamentos da prática luciferiana e rituais de iniciação.', 'Anônimo', 'iniciante', 'premium', 97.00, 7, '/images/grimoires/liber-prohibitus.jpg', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para usuários
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_member_type ON users(member_type);

-- Índices para Voz da Pluma
CREATE INDEX IF NOT EXISTS idx_voz_pluma_posted_date ON voz_pluma_manifestations(posted_date);
CREATE INDEX IF NOT EXISTS idx_voz_pluma_time ON voz_pluma_manifestations(manifestation_time);
CREATE INDEX IF NOT EXISTS idx_voz_pluma_current ON voz_pluma_manifestations(is_current);

-- Índices para consultas oraculares
CREATE INDEX IF NOT EXISTS idx_oracle_user_id ON oracle_consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_oracle_created_at ON oracle_consultations(created_at);

-- Índices para transações T'KAZH
CREATE INDEX IF NOT EXISTS idx_tkazh_user_id ON tkazh_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_tkazh_created_at ON tkazh_transactions(created_at);

-- Índices para grimórios
CREATE INDEX IF NOT EXISTS idx_grimoires_active ON grimoires(is_active);
CREATE INDEX IF NOT EXISTS idx_grimoires_access_level ON grimoires(access_level);

-- Índices para cursos
CREATE INDEX IF NOT EXISTS idx_courses_active ON courses(is_active);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);

-- =====================================================
-- POLÍTICAS DE SEGURANÇA RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS nas tabelas principais
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE oracle_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tkazh_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_seals ENABLE ROW LEVEL SECURITY;

-- Política para usuários (podem ver apenas seus próprios dados)
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Política para consultas oraculares (usuários veem apenas suas consultas)
CREATE POLICY "Users can view own consultations" ON oracle_consultations FOR SELECT USING (user_id = auth.uid()::text);
CREATE POLICY "Users can insert own consultations" ON oracle_consultations FOR INSERT WITH CHECK (user_id = auth.uid()::text);

-- Política para transações T'KAZH
CREATE POLICY "Users can view own transactions" ON tkazh_transactions FOR SELECT USING (user_id::text = auth.uid()::text);

-- Política para mensagens de chat
CREATE POLICY "Users can view own messages" ON chat_messages FOR SELECT USING (user_id::text = auth.uid()::text);
CREATE POLICY "Users can insert own messages" ON chat_messages FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

-- Política para selos pessoais
CREATE POLICY "Users can view own seals" ON personal_seals FOR SELECT USING (user_id::text = auth.uid()::text);
CREATE POLICY "Users can insert own seals" ON personal_seals FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

-- =====================================================
-- FUNÇÃO PARA ATUALIZAR TIMESTAMPS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_site_config_updated_at BEFORE UPDATE ON site_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_sections_updated_at BEFORE UPDATE ON content_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grimoires_updated_at BEFORE UPDATE ON grimoires FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SETUP COMPLETO
-- =====================================================