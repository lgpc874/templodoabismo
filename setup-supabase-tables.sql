-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100),
  magical_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  member_type VARCHAR(20) DEFAULT 'visitante' CHECK (member_type IN ('visitante', 'iniciado', 'vip', 'admin')),
  initiation_level INTEGER DEFAULT 1,
  personal_seal_generated BOOLEAN DEFAULT false,
  personal_seal_url TEXT,
  courses_completed TEXT[] DEFAULT '{}',
  achievements TEXT[] DEFAULT '{}',
  join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  subscription_type VARCHAR(50),
  subscription_expires_at TIMESTAMP WITH TIME ZONE
);

-- Create admin_sessions table for admin authentication
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  difficulty_level INTEGER DEFAULT 1,
  instructor VARCHAR(100),
  price_brl DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  featured_image TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create grimoires table
CREATE TABLE IF NOT EXISTS public.grimoires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  author VARCHAR(100),
  level VARCHAR(20) DEFAULT 'iniciante' CHECK (level IN ('iniciante', 'intermediario', 'avancado')),
  price_brl DECIMAL(10,2) DEFAULT 0,
  pdf_url TEXT,
  cover_image TEXT,
  is_active BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create oracle_consultations table
CREATE TABLE IF NOT EXISTS public.oracle_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  type VARCHAR(20) CHECK (type IN ('tarot', 'mirror', 'runes', 'fire', 'abyssal')),
  question TEXT NOT NULL,
  response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create voz_pluma_posts table
CREATE TABLE IF NOT EXISTS public.voz_pluma_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100),
  category VARCHAR(20) CHECK (category IN ('poem', 'article', 'ritual')),
  type VARCHAR(20) CHECK (type IN ('daily', 'special')),
  posted_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON public.admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON public.admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category);
CREATE INDEX IF NOT EXISTS idx_grimoires_level ON public.grimoires(level);
CREATE INDEX IF NOT EXISTS idx_oracle_consultations_user ON public.oracle_consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_oracle_consultations_type ON public.oracle_consultations(type);

-- Create default admin user
INSERT INTO public.users (
  email, 
  password_hash, 
  username, 
  magical_name, 
  role, 
  member_type, 
  initiation_level
) VALUES (
  'admin@templo.com',
  '$2b$10$8K1p/kNm5k5ZX.8K1p/kNm5k5ZX.8K1p/kNm5k5ZX.8K1p/kNm5k5ZX',
  'admin',
  'Guardião do Templo',
  'admin',
  'admin',
  10
) ON CONFLICT (email) DO NOTHING;