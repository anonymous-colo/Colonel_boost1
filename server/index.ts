import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as schema from "./schema";
import { writeFileSync } from "fs";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// --- DB
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

// --- Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24h
  })
);

// --- API

// Ajouter un contact
app.post("/api/contacts", async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "Nom et téléphone requis" });
    }

    // Vérifie doublon
    const existing = await db.query.contacts.findFirst({
      where: (contacts, { eq }) => eq(contacts.phone, phone)
    });
    if (existing) {
      return res.status(400).json({ error: "Ce numéro est déjà enregistré." });
    }

    // Ajoute avec suffixe BOOST.1🚀🔥
    await db.insert(schema.contacts).values({
      name: `${name} BOOST.1🚀🔥`,
      phone,
      email: email || null
    });

    res.json({ success: true, message: "Contact ajouté avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Export VCF
app.get("/api/export-vcf", async (req, res) => {
  try {
    const allContacts = await db.query.contacts.findMany();

    let vcfContent = "";
    allContacts.forEach((c) => {
      vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN;CHARSET=UTF-8:${c.name}\nTEL;CHARSET=UTF-8:${c.phone}\nEND:VCARD\n`;
    });

    const filePath = "/tmp/contacts.vcf";
    writeFileSync(filePath, vcfContent, "utf8");

    res.download(filePath, "contacts.vcf");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur export VCF" });
  }
});

// --- Lancer serveur
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`✅ API en écoute sur http://localhost:${port}`);
  });
}

export default app;
