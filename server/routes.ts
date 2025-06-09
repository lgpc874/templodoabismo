import type { Express, Request, Response } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { temploAI } from "./ai-service";
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
          is_active: true,
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

  // Courses routes
  app.get('/api/courses', async (req: Request, res: Response) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      console.error('Courses error:', error);
      res.status(500).json({ message: 'Failed to get courses' });
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