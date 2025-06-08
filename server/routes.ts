
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import session from "express-session";

const JWT_SECRET = process.env.JWT_SECRET || "templo-do-abismo-secret-key";

// Middleware de autenticação
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize storage defaults
  await storage.initializeDefaults();

  // Session middleware
  app.use(session({
    secret: 'templo-abismo-session',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
  }));

  // Auth routes
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(400).json({ message: "Usuário já existe" });
      }

      const user = await storage.createUser(userData);
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
      
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          tkazh_credits: user.tkazh_credits,
          free_credits: user.free_credits 
        } 
      });
    } catch (error) {
      res.status(400).json({ message: "Erro ao criar usuário" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
      
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          tkazh_credits: user.tkazh_credits,
          free_credits: user.free_credits 
        } 
      });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Protected routes
  app.get("/api/profile", authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        tkazh_credits: user.tkazh_credits,
        free_credits: user.free_credits,
        initiation_level: user.initiation_level,
        personal_seal_generated: user.personal_seal_generated
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar perfil" });
    }
  });

  // Grimoires routes
  app.get("/api/grimoires", async (req, res) => {
    try {
      const grimoires = await storage.getGrimoires();
      res.json(grimoires);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar grimórios" });
    }
  });

  app.get("/api/grimoires/:id", async (req, res) => {
    try {
      const grimoire = await storage.getGrimoireById(parseInt(req.params.id));
      if (!grimoire) {
        return res.status(404).json({ message: "Grimório não encontrado" });
      }
      res.json(grimoire);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar grimório" });
    }
  });

  // Courses routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar cursos" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourseById(parseInt(req.params.id));
      if (!course) {
        return res.status(404).json({ message: "Curso não encontrado" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar curso" });
    }
  });

  // Oracles routes
  app.get("/api/oracles", async (req, res) => {
    try {
      const oracles = await storage.getOracles();
      res.json(oracles);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar oráculos" });
    }
  });

  app.post("/api/oracles/:id/consult", authenticateToken, async (req: any, res) => {
    try {
      const oracleId = parseInt(req.params.id);
      const { question } = req.body;
      
      const oracle = await storage.getOracles().then(oracles => 
        oracles.find(o => o.id === oracleId)
      );
      
      if (!oracle) {
        return res.status(404).json({ message: "Oráculo não encontrado" });
      }

      const user = await storage.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Check credits
      const totalCredits = user.tkazh_credits + user.free_credits;
      if (totalCredits < oracle.tkazh_cost) {
        return res.status(400).json({ message: "Créditos insuficientes" });
      }

      // Generate oracle response based on type
      let response = "";
      switch (oracle.oracle_type) {
        case "tarot":
          response = generateTarotResponse(question);
          break;
        case "mirror":
          response = generateMirrorResponse(question);
          break;
        case "runes":
          response = generateRunesResponse(question);
          break;
        case "flames":
          response = generateFlamesResponse(question);
          break;
        case "voice":
          response = generateVoiceResponse(question);
          break;
        default:
          response = "Os ventos do abismo sussurram mistérios...";
      }

      // Deduct credits
      let newTkazh = user.tkazh_credits;
      let newFree = user.free_credits;
      
      if (user.free_credits >= oracle.tkazh_cost) {
        newFree -= oracle.tkazh_cost;
      } else {
        const remaining = oracle.tkazh_cost - user.free_credits;
        newFree = 0;
        newTkazh -= remaining;
      }

      await storage.updateUserCredits(user.id, newTkazh, newFree);

      // Save session
      const session = await storage.createOracleSession({
        user_id: user.id,
        oracle_id: oracleId,
        question,
        response
      });

      res.json({ response, session });
    } catch (error) {
      res.status(500).json({ message: "Erro ao consultar oráculo" });
    }
  });

  // Plume posts
  app.get("/api/plume", async (req, res) => {
    try {
      const posts = await storage.getPlumeePosts(10);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar posts da Pluma" });
    }
  });

  // Site settings
  app.get("/api/settings", async (req, res) => {
    try {
      const logo = await storage.getSetting("site_logo");
      const background = await storage.getSetting("site_background");
      
      res.json({
        logo: logo || "https://i.postimg.cc/g20gqmdX/IMG-20250527-182235-1.png",
        background: background || "https://i.postimg.cc/qqX1Q7zn/Textura-envelhecida-e-marcada-pelo-tempo.png"
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar configurações" });
    }
  });

  // Liber Prohibitus access
  app.post("/api/liber-access", async (req, res) => {
    try {
      const { password } = req.body;
      const correctPassword = await storage.getSetting("liber_password");
      
      if (password === correctPassword) {
        res.json({ access: true });
      } else {
        res.status(401).json({ access: false, message: "Palavra de poder incorreta" });
      }
    } catch (error) {
      res.status(500).json({ message: "Erro interno" });
    }
  });

  // Admin routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const isValid = await storage.validateAdmin(username, password);
      
      if (isValid) {
        (req.session as any).isAdmin = true;
        res.json({ success: true });
      } else {
        res.status(401).json({ success: false });
      }
    } catch (error) {
      res.status(500).json({ message: "Erro interno" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Oracle response generators
function generateTarotResponse(question: string): string {
  const responses = [
    "As cartas revelam que as sombras do passado influenciam seu presente. O Diabo sussurra transformação através do caos.",
    "A Torre emerge invertida - mudanças inevitáveis se aproximam. Abraçar a destruição levará à renovação.",
    "A Morte dança em seu caminho, não como fim, mas como portal. O que morre em você permitirá que o novo nasça.",
    "O Enforcado mostra paciência nas trevas. Suspenda julgamentos e deixe que Lúcifer ilumine a verdade oculta."
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

function generateMirrorResponse(question: string): string {
  const responses = [
    "No espelho negro, vejo sua alma dividida entre luz e trevas. A dualidade é sua força, não sua fraqueza.",
    "Reflexos distorcidos mostram máscaras que você usa. Remova-as e encontre o verdadeiro poder interior.",
    "O espelho revela que você teme seu próprio potencial. As correntes são ilusórias - quebre-as.",
    "Vislumbro uma sombra que o segue - é sua natureza superior tentando emergir. Não a rejeite."
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

function generateRunesResponse(question: string): string {
  const responses = [
    "ᚦᚢᚱᛁᛊᚨᛉ - As runas falam de força através da adversidade. Thor empunha o martelo, mas você empuña sua vontade.",
    "ᚱᚨᛁᛞᚩ - A runa da jornada se apresenta. O caminho é árduo, mas cada passo é sagrado.",
    "ᚴᛖᚾᚨᛉ - A chama do conhecimento queima dentro de você. Deixe-a consumir a ignorância.",
    "ᚷᛖᛒᚩ - As runas cantam sobre dádivas. O que você busca já está sendo preparado pelo destino."
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

function generateFlamesResponse(question: string): string {
  const responses = [
    "As chamas negras dançam e sussurram: a purificação vem através do fogo interior. Queime o que não serve.",
    "Nas chamas vejo uma fênix de obsidiana - sua renascida forma aguarda nas cinzas do antigo eu.",
    "O fogo sagrado revela que você deve incendiar pontes do passado para construir portais do futuro.",
    "Chamas proféticas mostram uma encruzilhada flamejante. Escolha o caminho que queima mais intensamente."
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

function generateVoiceResponse(question: string): string {
  const responses = [
    "A Voz Abissal ecoa dos profundos: 'Sua pergunta carrega a resposta. Olhe além do véu da dúvida.'",
    "Das trevas primordiais surge a resposta: 'O poder que busca já reside em sua essência. Desperte-o.'",
    "A voz antiga sussurra: 'Três luas devem passar antes que a clareza emerja. Paciência é sabedoria.'",
    "Do abismo eterno ressoa: 'A mudança que teme é a porta que o libertará. Atravesse-a sem hesitar.'"
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}
