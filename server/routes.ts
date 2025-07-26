import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertAdminSessionSchema } from "@shared/schema";
import { emailService } from "./services/emailService";
import { vcfService } from "./services/vcfService";
import { z } from "zod";

const ADMIN_PASSWORD = "kerventz2000";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Contact registration
  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      
      // Check for duplicate WhatsApp number
      const existingContact = await storage.getContactByWhatsApp(validatedData.whatsappNumber);
      if (existingContact) {
        return res.status(409).json({ 
          message: `Le numéro ${validatedData.countryCode}${validatedData.whatsappNumber} est déjà inscrit` 
        });
      }
      
      // Create contact
      const contact = await storage.createContact(validatedData);
      
      // Send confirmation email if email provided
      if (validatedData.email) {
        const emailSent = await emailService.sendConfirmationEmail(
          validatedData.email, 
          validatedData.fullName
        );
        if (!emailSent) {
          console.error('Failed to send confirmation email');
        }
      }
      
      res.status(201).json({ 
        message: "Inscription réussie!",
        contact: {
          id: contact.id,
          fullName: contact.fullName,
          createdAt: contact.createdAt
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ message: "Erreur lors de l'inscription" });
    }
  });

  // Get recent contacts (public)
  app.get("/api/contacts/recent", async (req, res) => {
    try {
      const contacts = await storage.getRecentContacts(5);
      res.json(contacts.map(contact => ({
        id: contact.id,
        fullName: contact.fullName,
        createdAt: contact.createdAt
      })));
    } catch (error) {
      console.error('Error fetching recent contacts:', error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Get contacts count (public)
  app.get("/api/contacts/count", async (req, res) => {
    try {
      const count = await storage.getContactsCount();
      res.json({ count });
    } catch (error) {
      console.error('Error fetching contacts count:', error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      
      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }
      
      const expiresAt = new Date(Date.now() + SESSION_DURATION);
      const session = await storage.createAdminSession({
        isActive: true,
        expiresAt
      });
      
      res.json({ 
        message: "Connexion réussie",
        sessionId: session.id,
        expiresAt: session.expiresAt
      });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Check admin session
  app.get("/api/admin/session", async (req, res) => {
    try {
      const sessionId = req.headers.authorization?.replace('Bearer ', '');
      if (!sessionId) {
        return res.status(401).json({ message: "Session non trouvée" });
      }
      
      const session = await storage.getActiveAdminSession();
      if (!session || session.id !== sessionId) {
        return res.status(401).json({ message: "Session invalide" });
      }
      
      if (new Date() > session.expiresAt) {
        await storage.deactivateAdminSession(session.id);
        return res.status(401).json({ message: "Session expirée" });
      }
      
      res.json({ valid: true, expiresAt: session.expiresAt });
    } catch (error) {
      console.error('Session check error:', error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Admin logout
  app.post("/api/admin/logout", async (req, res) => {
    try {
      const sessionId = req.headers.authorization?.replace('Bearer ', '');
      if (sessionId) {
        await storage.deactivateAdminSession(sessionId);
      }
      res.json({ message: "Déconnexion réussie" });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Get all contacts (admin only)
  app.get("/api/admin/contacts", async (req, res) => {
    try {
      const sessionId = req.headers.authorization?.replace('Bearer ', '');
      const session = await storage.getActiveAdminSession();
      
      if (!session || session.id !== sessionId || new Date() > session.expiresAt) {
        return res.status(401).json({ message: "Non autorisé" });
      }
      
      const { search } = req.query;
      let contacts;
      
      if (search && typeof search === 'string') {
        contacts = await storage.searchContacts(search);
      } else {
        contacts = await storage.getAllContacts();
      }
      
      res.json(contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Update contact (admin only)
  app.put("/api/admin/contacts/:id", async (req, res) => {
    try {
      const sessionId = req.headers.authorization?.replace('Bearer ', '');
      const session = await storage.getActiveAdminSession();
      
      if (!session || session.id !== sessionId || new Date() > session.expiresAt) {
        return res.status(401).json({ message: "Non autorisé" });
      }
      
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedContact = await storage.updateContact(id, updateData);
      if (!updatedContact) {
        return res.status(404).json({ message: "Contact non trouvé" });
      }
      
      res.json(updatedContact);
    } catch (error) {
      console.error('Error updating contact:', error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Delete contact (admin only)
  app.delete("/api/admin/contacts/:id", async (req, res) => {
    try {
      const sessionId = req.headers.authorization?.replace('Bearer ', '');
      const session = await storage.getActiveAdminSession();
      
      if (!session || session.id !== sessionId || new Date() > session.expiresAt) {
        return res.status(401).json({ message: "Non autorisé" });
      }
      
      const { id } = req.params;
      const deleted = await storage.deleteContact(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Contact non trouvé" });
      }
      
      res.json({ message: "Contact supprimé" });
    } catch (error) {
      console.error('Error deleting contact:', error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Delete all contacts (admin only)
  app.delete("/api/admin/contacts", async (req, res) => {
    try {
      const sessionId = req.headers.authorization?.replace('Bearer ', '');
      const session = await storage.getActiveAdminSession();
      
      if (!session || session.id !== sessionId || new Date() > session.expiresAt) {
        return res.status(401).json({ message: "Non autorisé" });
      }
      
      const deletedCount = await storage.deleteAllContacts();
      res.json({ message: `${deletedCount} contacts supprimés` });
    } catch (error) {
      console.error('Error deleting all contacts:', error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Export VCF (admin only)
  app.get("/api/admin/export/vcf", async (req, res) => {
    try {
      const sessionId = req.headers.authorization?.replace('Bearer ', '');
      const session = await storage.getActiveAdminSession();
      
      if (!session || session.id !== sessionId || new Date() > session.expiresAt) {
        return res.status(401).json({ message: "Non autorisé" });
      }
      
      const contacts = await storage.getAllContacts();
      const vcfContent = vcfService.generateVCF(contacts);
      
      res.setHeader('Content-Type', 'text/vcard');
      res.setHeader('Content-Disposition', 'attachment; filename="colonel-boost-contacts.vcf"');
      res.send(vcfContent);
    } catch (error) {
      console.error('Error exporting VCF:', error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Export CSV (admin only)
  app.get("/api/admin/export/csv", async (req, res) => {
    try {
      const sessionId = req.headers.authorization?.replace('Bearer ', '');
      const session = await storage.getActiveAdminSession();
      
      if (!session || session.id !== sessionId || new Date() > session.expiresAt) {
        return res.status(401).json({ message: "Non autorisé" });
      }
      
      const contacts = await storage.getAllContacts();
      const csvContent = vcfService.generateCSV(contacts);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="colonel-boost-contacts.csv"');
      res.send(csvContent);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
