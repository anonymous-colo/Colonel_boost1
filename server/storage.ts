import { contacts, admins, sessions, type Contact, type InsertContact, type Admin, type InsertAdmin, type Session } from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, and, gte, lte, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Contact operations
  getContact(id: string): Promise<Contact | undefined>;
  getContactByPhone(phone: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: string, contact: Partial<InsertContact>): Promise<Contact | undefined>;
  deleteContact(id: string): Promise<boolean>;
  getAllContacts(): Promise<Contact[]>;
  searchContacts(query: string): Promise<Contact[]>;
  getContactsWithEmail(): Promise<Contact[]>;
  getContactsByDateRange(startDate: Date, endDate: Date): Promise<Contact[]>;
  getTodayContacts(): Promise<Contact[]>;
  getWeekContacts(): Promise<Contact[]>;
  getContactsCount(): Promise<number>;
  deleteAllContacts(): Promise<boolean>;
  getLatestContacts(limit?: number): Promise<Contact[]>;
  
  // Admin operations
  getAdmin(id: string): Promise<Admin | undefined>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  updateAdminLastLogin(id: string): Promise<void>;
  
  // Session operations
  createSession(adminId: string, expiresAt: Date): Promise<Session>;
  getSession(sessionId: string): Promise<Session | undefined>;
  deleteSession(sessionId: string): Promise<boolean>;
  cleanExpiredSessions(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Contact operations
  async getContact(id: string): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact || undefined;
  }

  async getContactByPhone(phone: string): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.phone, phone));
    return contact || undefined;
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    // Add the K.B.S suffix if not already present
    const nameWithSuffix = contact.name.endsWith("K.B.S🚀🔥") 
      ? contact.name 
      : `${contact.name} K.B.S🚀🔥`;
    
    const [newContact] = await db
      .insert(contacts)
      .values({
        ...contact,
        name: nameWithSuffix,
      })
      .returning();
    return newContact;
  }

  async updateContact(id: string, contact: Partial<InsertContact>): Promise<Contact | undefined> {
    const [updatedContact] = await db
      .update(contacts)
      .set({ 
        ...contact, 
        updatedAt: new Date(),
      })
      .where(eq(contacts.id, id))
      .returning();
    return updatedContact || undefined;
  }

  async deleteContact(id: string): Promise<boolean> {
    const result = await db.delete(contacts).where(eq(contacts.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async searchContacts(query: string): Promise<Contact[]> {
    return await db.select().from(contacts).where(
      sql`${contacts.name} ILIKE ${'%' + query + '%'} OR ${contacts.phone} ILIKE ${'%' + query + '%'}`
    ).orderBy(desc(contacts.createdAt));
  }

  async getContactsWithEmail(): Promise<Contact[]> {
    return await db.select().from(contacts)
      .where(and(
        sql`${contacts.email} IS NOT NULL`,
        sql`${contacts.email} != ''`
      ))
      .orderBy(desc(contacts.createdAt));
  }

  async getContactsByDateRange(startDate: Date, endDate: Date): Promise<Contact[]> {
    return await db.select().from(contacts)
      .where(and(
        gte(contacts.createdAt, startDate),
        lte(contacts.createdAt, endDate)
      ))
      .orderBy(desc(contacts.createdAt));
  }

  async getTodayContacts(): Promise<Contact[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return await this.getContactsByDateRange(today, tomorrow);
  }

  async getWeekContacts(): Promise<Contact[]> {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return await this.getContactsByDateRange(weekAgo, today);
  }

  async getContactsCount(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(contacts);
    return result.count;
  }

  async deleteAllContacts(): Promise<boolean> {
    const result = await db.delete(contacts);
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Admin operations
  async getAdmin(id: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.id, id));
    return admin || undefined;
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin || undefined;
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const [newAdmin] = await db
      .insert(admins)
      .values(admin)
      .returning();
    return newAdmin;
  }

  async updateAdminLastLogin(id: string): Promise<void> {
    await db
      .update(admins)
      .set({ lastLogin: new Date() })
      .where(eq(admins.id, id));
  }

  // Session operations
  async createSession(adminId: string, expiresAt: Date): Promise<Session> {
    const sessionId = randomUUID();
    const [session] = await db
      .insert(sessions)
      .values({
        id: sessionId,
        adminId,
        expiresAt,
      })
      .returning();
    return session;
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, sessionId));
    return session || undefined;
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    const result = await db.delete(sessions).where(eq(sessions.id, sessionId));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async cleanExpiredSessions(): Promise<void> {
    await db.delete(sessions).where(lte(sessions.expiresAt, new Date()));
  }

  async getLatestContacts(limit: number = 5): Promise<Contact[]> {
    const latestContacts = await db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.createdAt))
      .limit(limit);
    return latestContacts;
  }
}

export const storage = new DatabaseStorage();
