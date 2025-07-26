import { contacts, adminSessions, type Contact, type InsertContact, type AdminSession, type InsertAdminSession } from "@shared/schema";
import { db } from "./db";
import { eq, desc, ilike, or, sql } from "drizzle-orm";

export interface IStorage {
  // Contact methods
  getContact(id: string): Promise<Contact | undefined>;
  getContactByWhatsApp(whatsappNumber: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: string, contact: Partial<InsertContact>): Promise<Contact | undefined>;
  deleteContact(id: string): Promise<boolean>;
  getAllContacts(): Promise<Contact[]>;
  getRecentContacts(limit: number): Promise<Contact[]>;
  searchContacts(query: string): Promise<Contact[]>;
  getContactsCount(): Promise<number>;
  deleteAllContacts(): Promise<number>;
  
  // Admin session methods
  createAdminSession(session: InsertAdminSession): Promise<AdminSession>;
  getActiveAdminSession(): Promise<AdminSession | undefined>;
  deactivateAdminSession(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getContact(id: string): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact || undefined;
  }

  async getContactByWhatsApp(whatsappNumber: string): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.whatsappNumber, whatsappNumber));
    return contact || undefined;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contacts)
      .values(insertContact)
      .returning();
    return contact;
  }

  async updateContact(id: string, updateData: Partial<InsertContact>): Promise<Contact | undefined> {
    const [contact] = await db
      .update(contacts)
      .set(updateData)
      .where(eq(contacts.id, id))
      .returning();
    return contact || undefined;
  }

  async deleteContact(id: string): Promise<boolean> {
    const result = await db.delete(contacts).where(eq(contacts.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async getRecentContacts(limit: number): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt)).limit(limit);
  }

  async searchContacts(query: string): Promise<Contact[]> {
    return await db
      .select()
      .from(contacts)
      .where(
        or(
          ilike(contacts.fullName, `%${query}%`),
          ilike(contacts.whatsappNumber, `%${query}%`),
          ilike(contacts.email, `%${query}%`)
        )
      )
      .orderBy(desc(contacts.createdAt));
  }

  async getContactsCount(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(contacts);
    return result.count;
  }

  async deleteAllContacts(): Promise<number> {
    const result = await db.delete(contacts);
    return result.rowCount || 0;
  }

  async createAdminSession(insertSession: InsertAdminSession): Promise<AdminSession> {
    // Deactivate any existing sessions first
    await db.update(adminSessions).set({ isActive: false });
    
    const [session] = await db
      .insert(adminSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getActiveAdminSession(): Promise<AdminSession | undefined> {
    const [session] = await db
      .select()
      .from(adminSessions)
      .where(eq(adminSessions.isActive, true));
    return session || undefined;
  }

  async deactivateAdminSession(id: string): Promise<boolean> {
    const result = await db
      .update(adminSessions)
      .set({ isActive: false })
      .where(eq(adminSessions.id, id));
    return (result.rowCount || 0) > 0;
  }
}

export const storage = new DatabaseStorage();
