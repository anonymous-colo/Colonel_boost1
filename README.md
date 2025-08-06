# KERVENTZ STATUS 🚀🔥

Plateforme professionnelle de collecte de contacts pour le networking de la diaspora haïtienne.

## 🌟 Fonctionnalités

### Site Public
- Interface multilingue (Français, Anglais, Espagnol)
- Formulaire d'inscription avec validation avancée
- Sélection d'indicatifs pour tous les pays
- Vérification anti-doublons automatique
- Mode sombre/clair automatique
- Design responsive (mobile, tablette, desktop)
- 10 témoignages authentiques
- Section FAQ complète
- Contacts WhatsApp et email intégrés

### Dashboard Administrateur
- Accès sécurisé avec sessions
- Gestion complète des contacts
- Recherche et filtres avancés
- Export VCF/CSV avec encodage UTF-8
- Statistiques en temps réel
- Affichage des 5 derniers inscrits
- Modification/suppression des contacts
- Interface responsive et moderne

## 🚀 Installation Rapide

1. **Extraire le projet**
   ```bash
   unzip kerventz-status-project.zip
   cd kerventz-status-project
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer la base de données**
   ```bash
   # Créer un fichier .env avec votre DATABASE_URL PostgreSQL
   echo "DATABASE_URL=your_postgresql_url" > .env
   npm run db:push
   ```

4. **Lancer l'application**
   ```bash
   npm run dev
   ```

L'application sera accessible sur `http://localhost:5000`

## 🔐 Accès Administrateur

**URL d'accès :** `/admin-kbs-access`
- **Nom d'utilisateur :** admin
- **Mot de passe :** kerventz2025
- **Sessions :** 24h (extensible à 30 jours avec "Se souvenir")

## 📱 Responsive Design

- **Mobile First :** Interface optimisée pour tous les écrans
- **Tablette :** Layout adaptatif avec navigation fluide
- **Desktop :** Expérience complète avec toutes les fonctionnalités

## 🛠 Technologies Utilisées

- **Frontend :** React, TypeScript, Tailwind CSS, Vite
- **Backend :** Node.js, Express, PostgreSQL
- **ORM :** Drizzle ORM
- **UI :** shadcn/ui, Radix UI
- **Validation :** Zod
- **Authentification :** Sessions Express + bcrypt

## 📦 Structure du Projet

```
├── client/                 # Application React
│   ├── src/
│   │   ├── components/     # Composants UI
│   │   ├── pages/         # Pages principales
│   │   ├── lib/           # Utilitaires
│   │   └── hooks/         # Hooks personnalisés
├── server/                # API Express
│   ├── db.ts             # Configuration base de données
│   ├── routes.ts         # Routes API
│   └── storage.ts        # Interface de stockage
├── shared/               # Types partagés
└── database.sql         # Schema SQL
```

## 🌍 Déploiement

### Vercel (Recommandé)
1. Connecter votre repository GitHub
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Variables d'environnement requises
```
DATABASE_URL=postgresql://...
SESSION_SECRET=votre_secret_session
NODE_ENV=production
```

## 📊 Fonctionnalités Avancées

### Exports
- **VCF :** Format vCard compatible tous appareils
- **CSV :** Données tabulaires avec encodage UTF-8
- **Emojis préservés :** Support complet Unicode

### Sécurité
- Sessions sécurisées avec expiration
- Validation côté client et serveur
- Protection contre les injections SQL
- Hachage des mots de passe avec bcrypt

### Intégrations
- **WhatsApp :** Lien direct vers le groupe
- **Email :** Support intégré
- **Multi-langues :** Traductions complètes

## 📞 Support

- **WhatsApp :** +1 (849) 584-9472
- **Email :** contact.kerventzweb@gmail.com

---

*Développé pour la communauté KERVENTZ STATUS 🚀🔥*