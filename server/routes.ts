import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  loginSchema, 
  insertSiteConfigSchema, 
  insertContentSectionSchema, 
  insertMediaAssetSchema, 
  insertActivityLogSchema, 
  insertBackupSchema 
} from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "magus-secretum-jwt-secret";
const upload = multer({ dest: "uploads/" });

// Middleware for admin authentication
async function requireAdmin(req: any, res: any, next: any) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const session = await storage.getAdminSession(token);
    if (!session) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await storage.getUser(session.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.user = user;
    req.session = session;
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.role !== "admin") {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "24h" });
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      await storage.createAdminSession(user.id, token, expiresAt);
      await storage.createActivityLog({
        userId: user.id,
        action: "admin_login",
        target: "admin_panel",
        metadata: { ip: req.ip },
      });

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/admin/logout", requireAdmin, async (req: any, res) => {
    try {
      await storage.deleteAdminSession(req.session.token);
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // Site configuration routes
  app.get("/api/admin/config", requireAdmin, async (req: any, res) => {
    try {
      const config = await storage.getSiteConfig();
      res.json(config);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch configuration" });
    }
  });

  app.post("/api/admin/config", requireAdmin, async (req: any, res) => {
    try {
      const configData = insertSiteConfigSchema.parse(req.body);
      const config = await storage.setSiteConfig(configData);
      
      await storage.createActivityLog({
        userId: req.user.id,
        action: "config_updated",
        target: configData.key,
        metadata: { category: configData.category },
      });

      res.json(config);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update configuration" });
    }
  });

  app.delete("/api/admin/config/:key", requireAdmin, async (req: any, res) => {
    try {
      const { key } = req.params;
      const success = await storage.deleteSiteConfig(key);
      
      if (success) {
        await storage.createActivityLog({
          userId: req.user.id,
          action: "config_deleted",
          target: key,
        });
        res.json({ message: "Configuration deleted" });
      } else {
        res.status(404).json({ message: "Configuration not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete configuration" });
    }
  });

  // Content sections routes
  app.get("/api/admin/content/sections", requireAdmin, async (req: any, res) => {
    try {
      const { pageId } = req.query;
      const sections = await storage.getContentSections(pageId);
      res.json(sections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content sections" });
    }
  });

  app.post("/api/admin/content/sections", requireAdmin, async (req: any, res) => {
    try {
      const sectionData = insertContentSectionSchema.parse(req.body);
      const section = await storage.createContentSection(sectionData);
      
      await storage.createActivityLog({
        userId: req.user.id,
        action: "section_created",
        target: `${sectionData.pageId}/${sectionData.sectionType}`,
        metadata: { title: sectionData.title },
      });

      res.json(section);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create content section" });
    }
  });

  app.put("/api/admin/content/sections/:id", requireAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = insertContentSectionSchema.partial().parse(req.body);
      const section = await storage.updateContentSection(parseInt(id), updates);
      
      if (section) {
        await storage.createActivityLog({
          userId: req.user.id,
          action: "section_updated",
          target: `${section.pageId}/${section.sectionType}`,
          metadata: { sectionId: section.id },
        });
        res.json(section);
      } else {
        res.status(404).json({ message: "Content section not found" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update content section" });
    }
  });

  app.delete("/api/admin/content/sections/:id", requireAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const section = await storage.getContentSection(parseInt(id));
      const success = await storage.deleteContentSection(parseInt(id));
      
      if (success && section) {
        await storage.createActivityLog({
          userId: req.user.id,
          action: "section_deleted",
          target: `${section.pageId}/${section.sectionType}`,
          metadata: { sectionId: section.id },
        });
        res.json({ message: "Content section deleted" });
      } else {
        res.status(404).json({ message: "Content section not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete content section" });
    }
  });

  app.post("/api/admin/content/sections/reorder", requireAdmin, async (req: any, res) => {
    try {
      const { pageId, sectionIds } = req.body;
      const success = await storage.reorderContentSections(pageId, sectionIds);
      
      if (success) {
        await storage.createActivityLog({
          userId: req.user.id,
          action: "sections_reordered",
          target: pageId,
          metadata: { sectionIds },
        });
        res.json({ message: "Sections reordered" });
      } else {
        res.status(400).json({ message: "Failed to reorder sections" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to reorder sections" });
    }
  });

  // Media assets routes
  app.get("/api/admin/media", requireAdmin, async (req: any, res) => {
    try {
      const assets = await storage.getMediaAssets();
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch media assets" });
    }
  });

  app.post("/api/admin/media/upload", requireAdmin, upload.array("files"), async (req: any, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const assets = [];

      for (const file of files) {
        const filename = `${Date.now()}-${file.originalname}`;
        const url = `/uploads/${filename}`;
        
        // Move file to permanent location
        await fs.rename(file.path, path.join("uploads", filename));

        const assetData = {
          filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          url,
          alt: req.body.alt || "",
          tags: req.body.tags ? req.body.tags.split(",") : [],
        };

        const asset = await storage.createMediaAsset(assetData);
        assets.push(asset);
      }

      await storage.createActivityLog({
        userId: req.user.id,
        action: "media_uploaded",
        target: "media_library",
        metadata: { count: assets.length },
      });

      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Failed to upload media" });
    }
  });

  app.put("/api/admin/media/:id", requireAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = insertMediaAssetSchema.partial().parse(req.body);
      const asset = await storage.updateMediaAsset(parseInt(id), updates);
      
      if (asset) {
        await storage.createActivityLog({
          userId: req.user.id,
          action: "media_updated",
          target: asset.filename,
          metadata: { assetId: asset.id },
        });
        res.json(asset);
      } else {
        res.status(404).json({ message: "Media asset not found" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update media asset" });
    }
  });

  app.delete("/api/admin/media/:id", requireAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const asset = await storage.getMediaAsset(parseInt(id));
      const success = await storage.deleteMediaAsset(parseInt(id));
      
      if (success && asset) {
        // Delete file from filesystem
        try {
          await fs.unlink(path.join("uploads", asset.filename));
        } catch (error) {
          console.warn("Failed to delete file:", asset.filename);
        }

        await storage.createActivityLog({
          userId: req.user.id,
          action: "media_deleted",
          target: asset.filename,
          metadata: { assetId: asset.id },
        });
        res.json({ message: "Media asset deleted" });
      } else {
        res.status(404).json({ message: "Media asset not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete media asset" });
    }
  });

  // Activity logs routes
  app.get("/api/admin/activity", requireAdmin, async (req: any, res) => {
    try {
      const { limit } = req.query;
      const logs = await storage.getActivityLogs(limit ? parseInt(limit) : 50);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });

  // Backup routes
  app.get("/api/admin/backups", requireAdmin, async (req: any, res) => {
    try {
      const backups = await storage.getBackups();
      res.json(backups);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch backups" });
    }
  });

  app.post("/api/admin/backups", requireAdmin, async (req: any, res) => {
    try {
      const { name, type } = req.body;
      
      // Create backup data
      const backupData = {
        config: await storage.getSiteConfig(),
        sections: await storage.getContentSections(),
        assets: await storage.getMediaAssets(),
      };

      const backupJson = JSON.stringify(backupData, null, 2);
      const filename = `backup-${Date.now()}.json`;
      const filePath = path.join("backups", filename);
      
      // Ensure backups directory exists
      await fs.mkdir("backups", { recursive: true });
      await fs.writeFile(filePath, backupJson);

      const backup = await storage.createBackup({
        name: name || `Backup ${new Date().toLocaleDateString()}`,
        type: type || "manual",
        size: Buffer.byteLength(backupJson),
        path: filePath,
        createdBy: req.user.id,
      });

      await storage.createActivityLog({
        userId: req.user.id,
        action: "backup_created",
        target: backup.name,
        metadata: { backupId: backup.id, type: backup.type },
      });

      res.json(backup);
    } catch (error) {
      res.status(500).json({ message: "Failed to create backup" });
    }
  });

  app.delete("/api/admin/backups/:id", requireAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const backup = await storage.getBackup(parseInt(id));
      const success = await storage.deleteBackup(parseInt(id));
      
      if (success && backup) {
        // Delete backup file
        try {
          await fs.unlink(backup.path);
        } catch (error) {
          console.warn("Failed to delete backup file:", backup.path);
        }

        await storage.createActivityLog({
          userId: req.user.id,
          action: "backup_deleted",
          target: backup.name,
          metadata: { backupId: backup.id },
        });
        res.json({ message: "Backup deleted" });
      } else {
        res.status(404).json({ message: "Backup not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete backup" });
    }
  });

  // Stats route
  app.get("/api/admin/stats", requireAdmin, async (req: any, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Serve uploaded files
  app.use("/uploads", express.static("uploads"));

  const httpServer = createServer(app);
  return httpServer;
}
