import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, loginSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import session from "express-session";

declare module 'express-session' {
  interface SessionData {
    adminId?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'kerventz-status-secret-2025',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
  }));

  // Initialize admin account if it doesn't exist
  const initializeAdmin = async () => {
    const existingAdmin = await storage.getAdminByUsername('admin');
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('kerventz2025', 10);
      await storage.createAdmin({
        username: 'admin',
        password: hashedPassword,
      });
    }
  };
  await initializeAdmin();

  // Authentication middleware
  const requireAuth = async (req: any, res: any, next: any) => {
    if (!req.session.adminId) {
      return res.status(401).json({ message: "Non autorisé" });
    }
    
    const admin = await storage.getAdmin(req.session.adminId);
    if (!admin) {
      return res.status(401).json({ message: "Session invalide" });
    }
    
    req.admin = admin;
    next();
  };

  // Public endpoint to get latest contacts (for homepage display)
  app.get("/api/contacts/latest", async (req, res) => {
    try {
      const latestContacts = await storage.getLatestContacts();
      res.json(latestContacts);
    } catch (error) {
      console.error("Error fetching latest contacts:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // Contact registration
  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      
      // Check for duplicate phone number
      const existingContact = await storage.getContactByPhone(validatedData.phone);
      if (existingContact) {
        return res.status(400).json({ 
          message: "Ce numéro est déjà enregistré dans notre système" 
        });
      }

      const contact = await storage.createContact(validatedData);
      res.status(201).json({ 
        message: "Inscription réussie",
        contact: contact
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Données invalides", 
          errors: error.errors 
        });
      }
      console.error("Erreur lors de l'inscription:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password, rememberMe } = loginSchema.parse(req.body);
      
      const admin = await storage.getAdminByUsername(username);
      if (!admin) {
        return res.status(401).json({ message: "Identifiants invalides" });
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Identifiants invalides" });
      }

      // Update last login
      await storage.updateAdminLastLogin(admin.id);
      
      // Set session
      req.session.adminId = admin.id;
      if (rememberMe) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
      }

      res.json({ 
        message: "Connexion réussie",
        admin: { id: admin.id, username: admin.username }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Données invalides", 
          errors: error.errors 
        });
      }
      console.error("Erreur lors de la connexion:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  // Admin logout
  app.post("/api/admin/logout", requireAuth, (req: any, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Erreur lors de la déconnexion" });
      }
      res.json({ message: "Déconnexion réussie" });
    });
  });

  // Get admin profile
  app.get("/api/admin/profile", requireAuth, (req: any, res) => {
    res.json({
      id: req.admin.id,
      username: req.admin.username,
      lastLogin: req.admin.lastLogin
    });
  });

  // Get all contacts (admin only)
  app.get("/api/admin/contacts", requireAuth, async (req, res) => {
    try {
      const { search, filter } = req.query;
      let contacts;

      if (search) {
        contacts = await storage.searchContacts(search as string);
      } else if (filter === 'with-email') {
        contacts = await storage.getContactsWithEmail();
      } else if (filter === 'today') {
        contacts = await storage.getTodayContacts();
      } else if (filter === 'week') {
        contacts = await storage.getWeekContacts();
      } else {
        contacts = await storage.getAllContacts();
      }

      res.json(contacts);
    } catch (error) {
      console.error("Erreur lors de la récupération des contacts:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  // Get contact statistics
  app.get("/api/admin/stats", requireAuth, async (req, res) => {
    try {
      const totalContacts = await storage.getContactsCount();
      const todayContacts = await storage.getTodayContacts();
      const weekContacts = await storage.getWeekContacts();
      const contactsWithEmail = await storage.getContactsWithEmail();
      const latestContacts = await storage.getLatestContacts(5);

      res.json({
        totalContacts,
        todayContacts: todayContacts.length,
        weekContacts: weekContacts.length,
        withEmail: contactsWithEmail.length,
        latestContacts,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  // Update contact
  app.put("/api/admin/contacts/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertContactSchema.partial().parse(req.body);
      
      const contact = await storage.updateContact(id, validatedData);
      if (!contact) {
        return res.status(404).json({ message: "Contact non trouvé" });
      }

      res.json({ message: "Contact mis à jour", contact });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Données invalides", 
          errors: error.errors 
        });
      }
      console.error("Erreur lors de la mise à jour:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  // Delete contact
  app.delete("/api/admin/contacts/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteContact(id);
      
      if (!success) {
        return res.status(404).json({ message: "Contact non trouvé" });
      }

      res.json({ message: "Contact supprimé" });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  // Delete all contacts
  app.delete("/api/admin/contacts", requireAuth, async (req, res) => {
    try {
      await storage.deleteAllContacts();
      res.json({ message: "Tous les contacts ont été supprimés" });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  // Export contacts as VCF
  app.get("/api/admin/export/vcf", requireAuth, async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      
      let vcfContent = '';
      contacts.forEach(contact => {
        vcfContent += 'BEGIN:VCARD\n';
        vcfContent += 'VERSION:3.0\n';
        vcfContent += `FN:${contact.name}\n`;
        vcfContent += `TEL:${contact.countryCode}${contact.phone}\n`;
        if (contact.email) {
          vcfContent += `EMAIL:${contact.email}\n`;
        }
        vcfContent += 'END:VCARD\n';
      });

      res.setHeader('Content-Type', 'text/vcard; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="kerventz-contacts.vcf"');
      res.send(vcfContent);
    } catch (error) {
      console.error("Erreur lors de l'export VCF:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  // Export contacts as CSV
  app.get("/api/admin/export/csv", requireAuth, async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      
      let csvContent = 'Nom,Téléphone,Email,Date d\'inscription\n';
      contacts.forEach(contact => {
        const email = contact.email || '';
        const date = contact.createdAt.toLocaleDateString('fr-FR');
        csvContent += `"${contact.name}","${contact.countryCode}${contact.phone}","${email}","${date}"\n`;
      });

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="kerventz-contacts.csv"');
      res.send('\ufeff' + csvContent); // BOM for UTF-8
    } catch (error) {
      console.error("Erreur lors de l'export CSV:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
