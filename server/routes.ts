import type { Express, Request, Response } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { temploAI } from "./ai-service";
import { 
  courses, 
  grimoires, 
  users,
  susurriAbyssos,
  blogPosts,
  blogCategories,
  pages,
  scriptures,
  mediaLibrary
} from "@shared/schema";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

const upload = multer({ dest: 'uploads/' });

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
    return res.status(401).json({ message: 'Invalid token' });
  }
}

async function requireAdmin(req: any, res: Response, next: any) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication routes
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
      
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        role: 'user',
      });
      
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      
      res.json({ user: { ...user, password: undefined }, token });
    } catch (error) {
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
      
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      
      res.json({ user: { ...user, password: undefined }, token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // Daily quote route
  app.get('/api/daily-quote', async (req: Request, res: Response) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Check if we already have a quote for today
      let quote = await storage.getDailyQuote(today);
      
      if (!quote) {
        // Generate new quote with AI
        const generatedQuote = await temploAI.generateDailyQuote();
        quote = await storage.createDailyQuote({
          content: generatedQuote.content,
          author: generatedQuote.author,
          date: today,
          is_active: true,
        });
      }
      
      res.json(quote);
    } catch (error) {
      console.error('Daily quote error:', error);
      res.status(500).json({ message: 'Failed to get daily quote' });
    }
  });

  // Daily poem route for Voz da Pluma
  app.get('/api/daily-poem', async (req: Request, res: Response) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Check if we already have a poem for today
      let poem = await storage.getDailyPoem(today);
      
      if (!poem) {
        // Generate new poem with AI
        const generatedPoem = await temploAI.generateDailyPoem();
        poem = await storage.createDailyPoem({
          title: generatedPoem.title,
          content: generatedPoem.content,
          author: generatedPoem.author,
          date: today,
          is_ai_generated: true,
          published: true,
        });
      }
      
      res.json(poem);
    } catch (error) {
      console.error('Daily poem error:', error);
      res.status(500).json({ message: 'Failed to get daily poem' });
    }
  });

  // Recent poems for archive
  app.get('/api/poems/recent', async (req: Request, res: Response) => {
    try {
      const poems = await storage.getRecentPoems(30); // Last 30 days
      res.json(poems);
    } catch (error) {
      console.error('Recent poems error:', error);
      res.status(500).json({ message: 'Failed to get recent poems' });
    }
  });

  // Test database connection
  app.get('/api/test-db', async (req: Request, res: Response) => {
    try {
      const result = await storage.getCourses();
      res.json({ success: true, count: result.length, courses: result });
    } catch (error: any) {
      console.error('Database test error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Courses routes
  app.get('/api/courses', async (req: Request, res: Response) => {
    try {
      console.log('API: Attempting to fetch courses...');
      const coursesData = await storage.getCourses();
      console.log('API: Courses fetched successfully:', coursesData.length);
      res.json(coursesData);
    } catch (error: any) {
      console.error('API: Courses error details:', error);
      res.status(500).json({ message: 'Failed to get courses', error: error.message });
    }
  });

  app.post('/api/courses/:id/enroll', requireAuth, async (req: any, res: Response) => {
    try {
      const courseId = parseInt(req.params.id);
      const { paymentId } = req.body;
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      if (!paymentId) {
        return res.status(400).json({ 
          message: 'Payment required for course enrollment', 
          price_brl: course.price_brl 
        });
      }
      
      // Verify payment was successful (implement with your payment processor)
      // For now, we'll assume payment was verified if paymentId is provided
      
      await storage.createCourseProgress({
        user_id: req.user.id,
        course_id: courseId,
        module_index: 0,
        completed: false,
      });
      
      res.json({ message: 'Enrolled successfully' });
    } catch (error) {
      console.error('Course enrollment error:', error);
      res.status(500).json({ message: 'Enrollment failed' });
    }
  });

  app.get('/api/user/progress', requireAuth, async (req: any, res: Response) => {
    try {
      const progress = await storage.getUserCourseProgress(req.user.id);
      res.json(progress);
    } catch (error) {
      console.error('User progress error:', error);
      res.status(500).json({ message: 'Failed to get progress' });
    }
  });

  // Grimoires routes
  app.get('/api/grimoires', async (req: Request, res: Response) => {
    try {
      const grimoires = await storage.getGrimoires();
      res.json(grimoires);
    } catch (error) {
      console.error('Grimoires error:', error);
      res.status(500).json({ message: 'Failed to get grimoires' });
    }
  });

  app.post('/api/grimoires/:id/rent', requireAuth, async (req: any, res: Response) => {
    try {
      const grimoireId = parseInt(req.params.id);
      const { paymentId } = req.body;
      const grimoire = await storage.getGrimoire(grimoireId);
      
      if (!grimoire) {
        return res.status(404).json({ message: 'Grimoire not found' });
      }
      
      if (!paymentId) {
        return res.status(400).json({ 
          message: 'Payment required for grimoire rental', 
          price_brl: grimoire.rental_price_brl 
        });
      }
      
      // Verify payment was successful (implement with your payment processor)
      // For now, we'll assume payment was verified if paymentId is provided
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (grimoire.rental_days || 7));
      
      await storage.createGrimoireRental({
        user_id: req.user.id,
        grimoire_id: grimoireId,
        expires_at: expiresAt,
      });
      
      res.json({ message: 'Grimoire rented successfully' });
    } catch (error) {
      console.error('Grimoire rental error:', error);
      res.status(500).json({ message: 'Rental failed' });
    }
  });

  app.post('/api/grimoires/:id/purchase', requireAuth, async (req: any, res: Response) => {
    try {
      const grimoireId = parseInt(req.params.id);
      const { paymentId } = req.body;
      const grimoire = await storage.getGrimoire(grimoireId);
      
      if (!grimoire) {
        return res.status(404).json({ message: 'Grimoire not found' });
      }
      
      if (!paymentId) {
        return res.status(400).json({ 
          message: 'Payment required for grimoire purchase', 
          price_brl: grimoire.price_brl 
        });
      }
      
      // Verify payment was successful (implement with your payment processor)
      // For now, we'll assume payment was verified if paymentId is provided
      
      await storage.createGrimoirePurchase({
        user_id: req.user.id,
        grimoire_id: grimoireId,
      });
      
      res.json({ message: 'Grimoire purchased successfully' });
    } catch (error) {
      console.error('Grimoire purchase error:', error);
      res.status(500).json({ message: 'Purchase failed' });
    }
  });

  app.get('/api/user/rentals', requireAuth, async (req: any, res: Response) => {
    try {
      const rentals = await storage.getUserGrimoireRentals(req.user.id);
      res.json(rentals);
    } catch (error) {
      console.error('User rentals error:', error);
      res.status(500).json({ message: 'Failed to get rentals' });
    }
  });

  app.get('/api/user/purchases', requireAuth, async (req: any, res: Response) => {
    try {
      const purchases = await storage.getUserGrimoirePurchases(req.user.id);
      res.json(purchases);
    } catch (error) {
      console.error('User purchases error:', error);
      res.status(500).json({ message: 'Failed to get purchases' });
    }
  });

  // New Grimoire API Routes for 3 Monetization Systems
  app.get('/api/grimoires/:id/chapters', async (req: Request, res: Response) => {
    try {
      const grimoireId = parseInt(req.params.id);
      const chapters = await storage.getGrimoireChapters(grimoireId);
      res.json(chapters);
    } catch (error) {
      console.error('Error fetching grimoire chapters:', error);
      res.status(500).json({ message: 'Failed to fetch chapters' });
    }
  });

  app.get('/api/user/grimoire-access', requireAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user.id;
      const access = await storage.getUserGrimoireAccess(userId);
      res.json(access);
    } catch (error) {
      console.error('Error fetching user grimoire access:', error);
      res.status(500).json({ message: 'Failed to fetch access' });
    }
  });

  app.post('/api/grimoires/purchase', requireAuth, async (req: any, res: Response) => {
    try {
      const { grimoireId, type, chapterId } = req.body;
      const userId = req.user.id;

      // Get grimoire details
      const grimoire = await storage.getGrimoire(grimoireId);
      if (!grimoire) {
        return res.status(404).json({ message: 'Grimoire not found' });
      }

      // Calculate price and create access record
      let pricePaid = 0;
      let expiresAt = null;
      let downloadsRemaining = 0;

      switch (type) {
        case 'rental':
          if (!grimoire.enable_rental) {
            return res.status(400).json({ message: 'Rental not available for this grimoire' });
          }
          pricePaid = grimoire.rental_price_brl;
          expiresAt = new Date(Date.now() + (grimoire.rental_days * 24 * 60 * 60 * 1000));
          break;

        case 'purchase':
          if (!grimoire.enable_purchase) {
            return res.status(400).json({ message: 'Purchase not available for this grimoire' });
          }
          pricePaid = grimoire.purchase_price_brl;
          downloadsRemaining = 5;
          break;

        case 'chapter':
          if (!grimoire.enable_chapter_purchase) {
            return res.status(400).json({ message: 'Chapter purchase not available for this grimoire' });
          }
          pricePaid = grimoire.chapter_price_brl;
          break;

        default:
          return res.status(400).json({ message: 'Invalid purchase type' });
      }

      // Create access record
      const accessData = {
        user_id: userId,
        grimoire_id: grimoireId,
        access_type: type,
        chapter_id: chapterId || null,
        expires_at: expiresAt,
        downloads_remaining: downloadsRemaining,
        price_paid_brl: pricePaid,
        payment_id: `payment_${Date.now()}_${userId}`, // Simplified payment ID
      };

      const access = await storage.createGrimoireAccess(accessData);

      res.json({
        success: true,
        access,
        message: 'Purchase completed successfully'
      });
    } catch (error) {
      console.error('Error processing grimoire purchase:', error);
      res.status(500).json({ message: 'Failed to process purchase' });
    }
  });

  // Oracle consultation routes
  app.post('/api/oracle/consult', requireAuth, async (req: any, res: Response) => {
    try {
      const { type, question, paymentId } = req.body;
      
      // Define oracle costs in Brazilian Real (centavos)
      const costs = {
        fire: 300,    // R$ 3.00
        runes: 500,   // R$ 5.00
        mirror: 500,  // R$ 5.00
        tarot: 700,   // R$ 7.00
        abyssal: 1000, // R$ 10.00
      };
      
      const cost = costs[type as keyof typeof costs] || 300;
      
      // Here you would verify the payment with your payment processor
      // For now, we'll assume payment was successful if paymentId is provided
      if (!paymentId) {
        return res.status(400).json({ message: 'Payment required for oracle consultation', cost_brl: cost });
      }
      
      // Generate reading with AI
      let result;
      switch (type) {
        case 'tarot':
          result = await temploAI.generateTarotReading(question);
          break;
        case 'mirror':
          result = await temploAI.generateMirrorReading(question);
          break;
        case 'runes':
          result = await temploAI.generateRuneReading(question);
          break;
        case 'fire':
          result = await temploAI.generateFireReading(question);
          break;
        case 'abyssal':
          result = await temploAI.generateAbyssalVoice(question);
          break;
        default:
          return res.status(400).json({ message: 'Invalid oracle type' });
      }
      
      // Save oracle session
      const session = await storage.createOracleSession({
        user_id: req.user.id,
        oracle_type: type,
        question,
        result,
        cost_brl: cost,
      });
      
      res.json({
        type,
        question,
        result,
        cost_brl: cost,
        payment_id: paymentId,
      });
    } catch (error) {
      console.error('Oracle consultation error:', error);
      res.status(500).json({ message: 'Consultation failed' });
    }
  });

  app.get('/api/oracle/history', requireAuth, async (req: any, res: Response) => {
    try {
      const history = await storage.getUserOracleHistory(req.user.id);
      res.json(history);
    } catch (error) {
      console.error('Oracle history error:', error);
      res.status(500).json({ message: 'Failed to get oracle history' });
    }
  });

  // PayPal payment routes
  app.get("/api/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/api/paypal/order", async (req, res) => {
    await createPaypalOrder(req, res);
  });

  app.post("/api/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  // Payment completion (removed T'KAZH credit system)
  app.post('/api/payment/complete', requireAuth, async (req: any, res: Response) => {
    try {
      const { service_type, service_id, amount_brl, payment_id } = req.body;
      
      // Log successful payment for audit purposes
      await storage.createActivityLog({
        userId: req.user.id,
        action: 'payment_completed',
        target: `${service_type}:${service_id}`,
        metadata: { amount_brl, payment_id }
      });
      
      res.json({ message: 'Payment completed successfully' });
    } catch (error) {
      console.error('Payment completion error:', error);
      res.status(500).json({ message: 'Payment completion failed' });
    }
  });

  // Admin stats route
  app.get('/api/admin/stats', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Admin stats error:', error);
      res.status(500).json({ message: 'Failed to get stats' });
    }
  });

  // Admin users route
  app.get('/api/admin/users', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Admin users error:', error);
      res.status(500).json({ message: 'Failed to get users' });
    }
  });

  // Admin routes
  app.get('/api/admin/courses', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      console.error('Admin courses error:', error);
      res.status(500).json({ message: 'Failed to get courses' });
    }
  });

  app.post('/api/admin/courses', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const course = await storage.createCourse(req.body);
      res.json(course);
    } catch (error) {
      console.error('Admin create course error:', error);
      res.status(500).json({ message: 'Failed to create course' });
    }
  });

  app.put('/api/admin/courses/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const course = await storage.updateCourse(parseInt(req.params.id), req.body);
      res.json(course);
    } catch (error) {
      console.error('Admin update course error:', error);
      res.status(500).json({ message: 'Failed to update course' });
    }
  });

  app.delete('/api/admin/courses/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      await storage.deleteCourse(parseInt(req.params.id));
      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error('Admin delete course error:', error);
      res.status(500).json({ message: 'Failed to delete course' });
    }
  });

  // Similar admin routes for grimoires
  app.get('/api/admin/grimoires', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const grimoires = await storage.getAllGrimoires();
      res.json(grimoires);
    } catch (error) {
      console.error('Admin grimoires error:', error);
      res.status(500).json({ message: 'Failed to get grimoires' });
    }
  });

  app.post('/api/admin/grimoires', requireAuth, requireAdmin, upload.single('pdf'), async (req: Request, res: Response) => {
    try {
      const grimoireData = {
        ...req.body,
        chapters: JSON.parse(req.body.chapters || '[]'),
        pdf_url: req.file ? `/uploads/${req.file.filename}` : null,
      };
      
      const grimoire = await storage.createGrimoire(grimoireData);
      res.json(grimoire);
    } catch (error) {
      console.error('Admin create grimoire error:', error);
      res.status(500).json({ message: 'Failed to create grimoire' });
    }
  });

  // Blog routes (public)
  app.get('/api/blog/posts', async (req: Request, res: Response) => {
    try {
      const posts = await storage.getBlogPosts(true); // Only published posts
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get('/api/blog/posts/:slug', async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post || !post.published) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.get('/api/blog/categories', async (req: Request, res: Response) => {
    try {
      const categories = await storage.getBlogCategories();
      res.json(categories.map(cat => cat.name));
    } catch (error) {
      console.error("Error fetching blog categories:", error);
      res.status(500).json({ message: "Failed to fetch blog categories" });
    }
  });

  app.get('/api/blog/tags', async (req: Request, res: Response) => {
    try {
      const tags = await storage.getBlogTags();
      res.json(tags);
    } catch (error) {
      console.error("Error fetching blog tags:", error);
      res.status(500).json({ message: "Failed to fetch blog tags" });
    }
  });

  app.post('/api/newsletter/subscribe', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: "Email válido é obrigatório" });
      }

      const subscriber = await storage.subscribeNewsletter({ email });
      res.json({ message: "Inscrição realizada com sucesso!" });
    } catch (error: any) {
      if (error.message?.includes('duplicate key')) {
        return res.status(400).json({ message: "Este email já está inscrito" });
      }
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ message: "Erro ao processar inscrição" });
    }
  });

  // Admin blog routes (protected)
  app.get('/api/admin/blog/posts', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const posts = await storage.getBlogPosts(); // All posts
      res.json(posts);
    } catch (error) {
      console.error("Error fetching admin blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.post('/api/admin/blog/posts', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const postData = req.body;
      const post = await storage.createBlogPost(postData);
      res.json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.put('/api/admin/blog/posts/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const post = await storage.updateBlogPost(id, updates);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete('/api/admin/blog/posts/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBlogPost(id);
      
      if (!success) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // CMS Routes - Pages Management
  app.get('/api/admin/pages', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const pages = await storage.getPages();
      res.json(pages);
    } catch (error) {
      console.error('Error fetching pages:', error);
      res.status(500).json({ message: 'Failed to fetch pages' });
    }
  });

  app.get('/api/admin/pages/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const page = await storage.getPageById(parseInt(req.params.id));
      if (!page) {
        return res.status(404).json({ message: 'Page not found' });
      }
      res.json(page);
    } catch (error) {
      console.error('Error fetching page:', error);
      res.status(500).json({ message: 'Failed to fetch page' });
    }
  });

  app.post('/api/admin/pages', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const pageData = req.body;
      pageData.authorId = req.user?.id;
      const page = await storage.createPage(pageData);
      res.status(201).json(page);
    } catch (error) {
      console.error('Error creating page:', error);
      res.status(500).json({ message: 'Failed to create page' });
    }
  });

  app.put('/api/admin/pages/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const page = await storage.updatePage(parseInt(req.params.id), req.body);
      if (!page) {
        return res.status(404).json({ message: 'Page not found' });
      }
      res.json(page);
    } catch (error) {
      console.error('Error updating page:', error);
      res.status(500).json({ message: 'Failed to update page' });
    }
  });

  app.delete('/api/admin/pages/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const success = await storage.deletePage(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: 'Page not found' });
      }
      res.json({ message: 'Page deleted successfully' });
    } catch (error) {
      console.error('Error deleting page:', error);
      res.status(500).json({ message: 'Failed to delete page' });
    }
  });

  app.post('/api/admin/pages/:id/publish', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const page = await storage.publishPage(parseInt(req.params.id));
      if (!page) {
        return res.status(404).json({ message: 'Page not found' });
      }
      res.json(page);
    } catch (error) {
      console.error('Error publishing page:', error);
      res.status(500).json({ message: 'Failed to publish page' });
    }
  });

  // CMS Routes - Scriptures Management
  app.get('/api/admin/scriptures', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const scriptures = await storage.getScriptures();
      res.json(scriptures);
    } catch (error) {
      console.error('Error fetching scriptures:', error);
      res.status(500).json({ message: 'Failed to fetch scriptures' });
    }
  });

  app.post('/api/admin/scriptures', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const scriptureData = req.body;
      scriptureData.authorId = req.user?.id;
      const scripture = await storage.createScripture(scriptureData);
      res.status(201).json(scripture);
    } catch (error) {
      console.error('Error creating scripture:', error);
      res.status(500).json({ message: 'Failed to create scripture' });
    }
  });

  app.put('/api/admin/scriptures/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const scripture = await storage.updateScripture(parseInt(req.params.id), req.body);
      if (!scripture) {
        return res.status(404).json({ message: 'Scripture not found' });
      }
      res.json(scripture);
    } catch (error) {
      console.error('Error updating scripture:', error);
      res.status(500).json({ message: 'Failed to update scripture' });
    }
  });

  app.delete('/api/admin/scriptures/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteScripture(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: 'Scripture not found' });
      }
      res.json({ message: 'Scripture deleted successfully' });
    } catch (error) {
      console.error('Error deleting scripture:', error);
      res.status(500).json({ message: 'Failed to delete scripture' });
    }
  });

  app.post('/api/admin/scriptures/:id/publish', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const scripture = await storage.publishScripture(parseInt(req.params.id));
      if (!scripture) {
        return res.status(404).json({ message: 'Scripture not found' });
      }
      res.json(scripture);
    } catch (error) {
      console.error('Error publishing scripture:', error);
      res.status(500).json({ message: 'Failed to publish scripture' });
    }
  });

  // CMS Routes - Media Library
  app.get('/api/admin/media', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const media = await storage.getMediaFiles();
      res.json(media);
    } catch (error) {
      console.error('Error fetching media:', error);
      res.status(500).json({ message: 'Failed to fetch media files' });
    }
  });

  app.post('/api/admin/media/upload', requireAuth, requireAdmin, upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const mediaData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
        url: `/uploads/${req.file.filename}`,
        uploadedBy: req.user?.id,
      };

      const media = await storage.uploadMedia(mediaData);
      res.status(201).json(media);
    } catch (error) {
      console.error('Error uploading media:', error);
      res.status(500).json({ message: 'Failed to upload media' });
    }
  });

  app.delete('/api/admin/media/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteMedia(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: 'Media file not found' });
      }
      res.json({ message: 'Media file deleted successfully' });
    } catch (error) {
      console.error('Error deleting media:', error);
      res.status(500).json({ message: 'Failed to delete media file' });
    }
  });

  // Enhanced Course Management Routes
  app.put('/api/admin/courses/:id/pricing', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { price, currency, discountPrice, discountValidUntil } = req.body;
      const course = await storage.updateCourse(parseInt(req.params.id), {
        price,
        currency,
        discountPrice,
        discountValidUntil,
      });
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.json(course);
    } catch (error) {
      console.error('Error updating course pricing:', error);
      res.status(500).json({ message: 'Failed to update course pricing' });
    }
  });

  app.post('/api/admin/courses/:id/publish', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const course = await storage.updateCourse(parseInt(req.params.id), {
        isPublished: true,
        publishedAt: new Date(),
      });
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.json(course);
    } catch (error) {
      console.error('Error publishing course:', error);
      res.status(500).json({ message: 'Failed to publish course' });
    }
  });

  app.post('/api/admin/courses/:id/unpublish', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const course = await storage.updateCourse(parseInt(req.params.id), {
        isPublished: false,
      });
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.json(course);
    } catch (error) {
      console.error('Error unpublishing course:', error);
      res.status(500).json({ message: 'Failed to unpublish course' });
    }
  });

  // User Profile Routes
  app.get('/api/user/profile', requireAuth, async (req: any, res: Response) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Calculate user stats
      const enrolledCourses = await storage.getUserCourses(req.user.id);
      const completedCourses = enrolledCourses.filter(course => course.completedAt);
      
      const userProfile = {
        ...user,
        totalCoursesCompleted: completedCourses.length,
        totalHoursStudied: completedCourses.reduce((total, course) => total + (course.estimatedDuration || 0), 0),
        level: Math.floor(completedCourses.length / 3) + 1, // Level up every 3 courses
        experience: completedCourses.length * 100, // 100 XP per completed course
      };

      res.json(userProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Failed to fetch user profile' });
    }
  });

  app.get('/api/grimoires/:id/download', requireAuth, async (req: any, res: Response) => {
    try {
      const grimoireId = parseInt(req.params.id);
      
      // Check if user has purchased this grimoire
      const rental = await storage.getGrimoireRental(req.user.id, grimoireId);
      if (!rental) {
        return res.status(403).json({ message: 'Grimoire not purchased' });
      }

      // Check download limits
      if (rental.downloads >= (rental.maxDownloads || 5)) {
        return res.status(403).json({ message: 'Download limit exceeded' });
      }

      const grimoire = await storage.getGrimoire(grimoireId);
      if (!grimoire || !grimoire.pdf_url) {
        return res.status(404).json({ message: 'Grimoire file not found' });
      }

      // Increment download count
      await storage.updateGrimoireRental(rental.id, {
        downloads: rental.downloads + 1,
        lastDownloadedAt: new Date(),
      });

      res.json({
        downloadUrl: grimoire.pdf_url,
        filename: `${grimoire.title}.pdf`,
      });
    } catch (error) {
      console.error('Error downloading grimoire:', error);
      res.status(500).json({ message: 'Failed to download grimoire' });
    }
  });

  app.post('/api/courses/:id/modules/:moduleId/continue', requireAuth, async (req: any, res: Response) => {
    try {
      const courseId = parseInt(req.params.id);
      const moduleId = parseInt(req.params.moduleId);

      // Check if user is enrolled in this course
      const enrollment = await storage.getCourseProgress(req.user.id, courseId);
      if (!enrollment) {
        return res.status(403).json({ message: 'Not enrolled in this course' });
      }

      // Update progress
      const updatedProgress = await storage.updateCourseProgress(req.user.id, courseId, {
        currentModule: moduleId,
        lastAccessedAt: new Date(),
      });

      res.json(updatedProgress);
    } catch (error) {
      console.error('Error continuing course module:', error);
      res.status(500).json({ message: 'Failed to continue course' });
    }
  });

  // Public routes for published content
  app.get('/api/pages/:slug', async (req: Request, res: Response) => {
    try {
      const page = await storage.getPageBySlug(req.params.slug);
      if (!page || page.status !== 'published') {
        return res.status(404).json({ message: 'Page not found' });
      }
      res.json(page);
    } catch (error) {
      console.error('Error fetching page:', error);
      res.status(500).json({ message: 'Failed to fetch page' });
    }
  });

  app.get('/api/scriptures/:slug', async (req: Request, res: Response) => {
    try {
      const scripture = await storage.getScriptureBySlug(req.params.slug);
      if (!scripture || !scripture.isPublic) {
        return res.status(404).json({ message: 'Scripture not found' });
      }
      res.json(scripture);
    } catch (error) {
      console.error('Error fetching scripture:', error);
      res.status(500).json({ message: 'Failed to fetch scripture' });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));

  // Error handling middleware
  app.use((err: any, req: Request, res: Response, next: any) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  });

  const httpServer = createServer(app);
  return httpServer;
}