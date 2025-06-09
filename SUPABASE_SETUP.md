# Supabase Setup Guide - Templo do Abismo

## Overview
This project has been fully migrated from SQLite to Supabase, providing:
- User authentication with email/password
- Real-time database operations
- File storage capabilities
- Secure API endpoints
- Real-time subscriptions

## Required Environment Variables
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

## Database Schema Setup

Execute this SQL in your Supabase SQL Editor to create all required tables:

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  level INTEGER DEFAULT 1,
  price DECIMAL(10,2) DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grimoires table
CREATE TABLE grimoires (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  pdf_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  category_id INTEGER,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily poems table
CREATE TABLE daily_poems (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  date DATE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Oracle consultations table
CREATE TABLE oracle_consultations (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  question TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Grimoire rentals table
CREATE TABLE grimoire_rentals (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  grimoire_id INTEGER REFERENCES grimoires(id) ON DELETE CASCADE,
  rental_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rental_end TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Grimoire purchases table
CREATE TABLE grimoire_purchases (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  grimoire_id INTEGER REFERENCES grimoires(id) ON DELETE CASCADE,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published, published_at);
CREATE INDEX idx_daily_poems_date ON daily_poems(date);
CREATE INDEX idx_oracle_consultations_user_id ON oracle_consultations(user_id);
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_grimoire_rentals_user_id ON grimoire_rentals(user_id);
CREATE INDEX idx_grimoire_purchases_user_id ON grimoire_purchases(user_id);
```

## Storage Buckets Setup

Create these storage buckets in Supabase Dashboard:
1. `uploads` - For general file uploads
2. `grimoires` - For PDF files
3. `media` - For images and other media

## Row Level Security (RLS) Setup

Enable RLS and add policies for security:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE grimoires ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE oracle_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grimoire_rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE grimoire_purchases ENABLE ROW LEVEL SECURITY;

-- Basic policies (customize as needed)
CREATE POLICY "Public read access" ON courses FOR SELECT USING (is_published = true);
CREATE POLICY "Public read access" ON grimoires FOR SELECT USING (is_published = true);
CREATE POLICY "Public read access" ON blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Public read access" ON daily_poems FOR SELECT USING (true);

-- User-specific policies
CREATE POLICY "Users can read own data" ON oracle_consultations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own data" ON oracle_consultations FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Features Implemented

### 1. Authentication
- Email/password signup and login
- Session management
- Protected routes
- User profile updates

### 2. Database Operations
- CRUD operations for all entities
- Real-time subscriptions
- Optimistic updates
- Error handling

### 3. File Storage
- File upload with progress tracking
- Public and private file access
- Signed URLs for secure downloads
- File management (list, delete)

### 4. Real-time Features
- Live data updates
- Real-time notifications
- Connection status monitoring

## Usage Examples

### Authentication
```typescript
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

function MyComponent() {
  const { user, signIn, signUp, signOut } = useSupabaseAuth();
  
  const handleLogin = async () => {
    const { error } = await signIn('email@example.com', 'password');
    if (error) console.error(error);
  };
}
```

### Database Operations
```typescript
import { useSupabaseData } from '@/hooks/useSupabaseData';

function CoursesComponent() {
  const { useCourses } = useSupabaseData();
  const { courses, createCourse } = useCourses();
  
  const addCourse = async () => {
    await createCourse({
      title: 'New Course',
      description: 'Course description',
      level: 1,
      price: 99.99
    });
  };
}
```

### File Upload
```typescript
import { useSupabaseStorage } from '@/hooks/useSupabaseStorage';

function UploadComponent() {
  const { uploadFile, uploading, uploadProgress } = useSupabaseStorage();
  
  const handleUpload = async (file: File) => {
    const { publicUrl, error } = await uploadFile(file, 'uploads');
    if (!error) {
      console.log('File uploaded:', publicUrl);
    }
  };
}
```

## Testing the Setup

Access `/supabase-demo` route to test all Supabase features:
- User registration and login
- Creating courses and poems
- File uploads
- Real-time data updates
- Connection status monitoring

## Security Notes

1. Never expose your Supabase service key in client code
2. Use Row Level Security policies to protect sensitive data
3. Validate all inputs on both client and server
4. Use signed URLs for sensitive file access
5. Implement proper rate limiting for API endpoints

## Deployment Checklist

- [ ] Supabase project created
- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] Storage buckets created
- [ ] RLS policies implemented
- [ ] Authentication configured
- [ ] SSL/TLS enabled
- [ ] Backup strategy implemented