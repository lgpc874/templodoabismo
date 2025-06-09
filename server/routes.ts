import type { Express, Request, Response } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./supabase-storage";
import { temploAI } from "./ai-service";
import type { CreateUser } from "@shared/supabase";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'templo-do-abismo-secret-key';

// Auth middleware
async function requireAuth(req: any, res: Response, next: any) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Token required' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

async function requireAdmin(req: any, res: Response, next: any) {
  if (!req.user?.is_admin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // PayPal routes
  app.get("/setup", loadPaypalDefault);
  app.post("/order", createPaypalOrder);
  app.post("/order/:orderID/capture", capturePaypalOrder);

  // Basic API routes
  app.get('/api/courses', async (req: Request, res: Response) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ message: 'Failed to fetch courses' });
    }
  });

  app.get('/api/grimoires', async (req: Request, res: Response) => {
    try {
      const grimoires = await storage.getGrimoires();
      res.json(grimoires);
    } catch (error: any) {
      console.error('Error fetching grimoires:', error);
      res.status(500).json({ message: 'Failed to fetch grimoires' });
    }
  });

  // Auth routes
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create user
      const userData: CreateUser = {
        username,
        email,
        password_hash: password, // Will be hashed in storage
        is_admin: false
      };
      
      const user = await storage.createUser(userData);
      
      // Generate token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          is_admin: user.is_admin 
        } 
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          is_admin: user.is_admin 
        } 
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // Daily content routes
  app.get('/api/daily-quote', async (req: Request, res: Response) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      let poem = await storage.getDailyPoem(today);
      
      if (!poem) {
        // Generate new daily quote using AI
        const aiQuote = await temploAI.generateDailyQuote();
        poem = await storage.createDailyPoem({
          title: "Citação Diária",
          content: aiQuote.content,
          author: aiQuote.author,
          date: today
        });
      }
      
      res.json(poem);
    } catch (error: any) {
      console.error('Error fetching daily quote:', error);
      res.status(500).json({ message: 'Failed to fetch daily quote' });
    }
  });

  app.get('/api/daily-poem', async (req: Request, res: Response) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      let poem = await storage.getDailyPoem(today);
      
      if (!poem) {
        // Generate new daily poem using AI
        const aiPoem = await temploAI.generateDailyPoem();
        poem = await storage.createDailyPoem({
          title: aiPoem.title,
          content: aiPoem.content,
          author: aiPoem.author,
          date: today
        });
      }
      
      res.json(poem);
    } catch (error: any) {
      console.error('Error fetching daily poem:', error);
      res.status(500).json({ message: 'Failed to fetch daily poem' });
    }
  });

  app.get('/api/poems/recent', async (req: Request, res: Response) => {
    try {
      const poems = await storage.getDailyPoems();
      res.json(poems);
    } catch (error: any) {
      console.error('Error fetching recent poems:', error);
      res.status(500).json({ message: 'Failed to fetch recent poems' });
    }
  });

  // Blog routes
  app.get('/api/blog/posts', async (req: Request, res: Response) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error: any) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ message: 'Failed to fetch blog posts' });
    }
  });

  app.get('/api/blog/posts/:slug', async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      res.json(post);
    } catch (error: any) {
      console.error('Error fetching blog post:', error);
      res.status(500).json({ message: 'Failed to fetch blog post' });
    }
  });

  // Oracle routes
  app.post('/api/oracle/consult', requireAuth, async (req: any, res: Response) => {
    try {
      const { type, question } = req.body;
      const userId = req.user.id;
      
      let response;
      switch (type) {
        case 'tarot':
          response = await temploAI.generateTarotReading(question);
          break;
        case 'mirror':
          response = await temploAI.generateMirrorReading(question);
          break;
        case 'runes':
          response = await temploAI.generateRuneReading(question);
          break;
        case 'fire':
          response = await temploAI.generateFireReading(question);
          break;
        case 'abyssal':
          response = await temploAI.generateAbyssalVoice(question);
          break;
        default:
          return res.status(400).json({ message: 'Invalid consultation type' });
      }
      
      const consultation = await storage.createOracleConsultation({
        user_id: userId,
        type,
        question,
        response: JSON.stringify(response)
      });
      
      res.json({ consultation, response });
    } catch (error: any) {
      console.error('Oracle consultation error:', error);
      res.status(500).json({ message: 'Failed to process consultation' });
    }
  });

  app.get('/api/oracle/history', requireAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user.id;
      const history = await storage.getOracleConsultations(userId);
      res.json(history);
    } catch (error: any) {
      console.error('Error fetching oracle history:', error);
      res.status(500).json({ message: 'Failed to fetch oracle history' });
    }
  });

  // Course enrollment routes
  app.post('/api/courses/:id/enroll', requireAuth, async (req: any, res: Response) => {
    try {
      const courseId = parseInt(req.params.id);
      const userId = req.user.id;
      
      const enrollment = await storage.createEnrollment({
        user_id: userId,
        course_id: courseId
      });
      
      res.json(enrollment);
    } catch (error: any) {
      console.error('Enrollment error:', error);
      res.status(500).json({ message: 'Failed to enroll in course' });
    }
  });

  app.get('/api/user/progress', requireAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user.id;
      const enrollments = await storage.getUserEnrollments(userId);
      res.json(enrollments);
    } catch (error: any) {
      console.error('Error fetching user progress:', error);
      res.status(500).json({ message: 'Failed to fetch user progress' });
    }
  });

  // Error handling middleware
  app.use((err: any, req: Request, res: Response, next: any) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
  });

  const httpServer = createServer(app);
  return httpServer;
}