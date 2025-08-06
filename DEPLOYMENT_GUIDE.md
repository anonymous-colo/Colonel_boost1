# Guide de Déploiement KERVENTZ STATUS 🚀

## Déploiement sur Replit (Recommandé)

### 1. Préparation du Projet
```bash
# Le projet est déjà configuré pour Replit
# Tous les fichiers nécessaires sont inclus
```

### 2. Configuration de la Base de Données
- Assurez-vous que votre base de données PostgreSQL est configurée
- Les variables d'environnement doivent être définies dans Secrets
- Le schéma sera créé automatiquement avec `npm run db:push`

### 3. Déploiement Automatique
1. Ouvrir le projet dans Replit
2. Cliquer sur "Deploy" dans l'interface
3. Choisir "Autoscale deployment"
4. Définir les variables d'environnement requises
5. Déployer

## Déploiement sur Vercel

### 1. Configuration Vercel
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter à Vercel
vercel login

# Configurer le projet
vercel
```

### 2. Variables d'Environnement Requises
```
DATABASE_URL=postgresql://...
SESSION_SECRET=votre_secret_unique
NODE_ENV=production
```

### 3. Configuration Build
Le projet utilise Vite et est pré-configuré pour la production.

## Déploiement sur Heroku

### 1. Préparation Heroku
```bash
# Installer Heroku CLI
# Se connecter: heroku login
# Créer l'app: heroku create kerventz-status
```

### 2. Configuration PostgreSQL
```bash
# Ajouter PostgreSQL
heroku addons:create heroku-postgresql:mini
```

### 3. Variables d'Environnement
```bash
heroku config:set SESSION_SECRET=votre_secret_unique
heroku config:set NODE_ENV=production
```

## Déploiement sur VPS (Ubuntu/Debian)

### 1. Préparatifs Serveur
```bash
# Mettre à jour le serveur
sudo apt update && sudo apt upgrade -y

# Installer Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer PostgreSQL
sudo apt install postgresql postgresql-contrib
```

### 2. Configuration PostgreSQL
```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer la base de données et l'utilisateur
CREATE DATABASE kerventz_status;
CREATE USER kerventz_user WITH PASSWORD 'mot_de_passe_securise';
GRANT ALL PRIVILEGES ON DATABASE kerventz_status TO kerventz_user;
\q
```

### 3. Configuration Nginx (optionnel)
```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. Configuration PM2
```bash
# Installer PM2
npm install -g pm2

# Créer ecosystem.config.js
module.exports = {
  apps: [{
    name: 'kerventz-status',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      DATABASE_URL: 'postgresql://kerventz_user:mot_de_passe@localhost/kerventz_status',
      SESSION_SECRET: 'votre_secret_unique'
    }
  }]
};

# Démarrer l'application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Configuration SSL avec Let's Encrypt
```bash
# Installer Certbot
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot

# Obtenir le certificat
sudo certbot --nginx -d votre-domaine.com

# Auto-renouvellement
sudo crontab -e
# Ajouter: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Sauvegarde de la Base de Données
```bash
# Sauvegarde quotidienne
pg_dump -U kerventz_user -h localhost kerventz_status > backup_$(date +%Y%m%d).sql

# Script de sauvegarde automatique
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U kerventz_user -h localhost kerventz_status > $BACKUP_DIR/kerventz_backup_$DATE.sql
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
```

## Monitoring et Logs
```bash
# Voir les logs PM2
pm2 logs

# Monitoring système
pm2 monit

# Logs Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Sécurité Supplémentaire
```bash
# Configurer le firewall
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable

# Fail2ban pour protection SSH
sudo apt install fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Tests Post-Déploiement
1. ✅ Accès au site principal
2. ✅ Formulaire d'inscription fonctionnel
3. ✅ Accès dashboard admin (/admin-kbs-access)
4. ✅ Export VCF/CSV
5. ✅ Responsive design (mobile/desktop)
6. ✅ Performance (< 2s de chargement)

## URLs de Production
- **Site Public**: https://votre-domaine.com
- **Dashboard Admin**: https://votre-domaine.com/admin-kbs-access
- **API Health**: https://votre-domaine.com/api/health

## Support Technique
Pour toute assistance technique :
- Email: contact.kerventzweb@gmail.com  
- WhatsApp: +1 (849) 584-9472
- Documentation complète dans README.md