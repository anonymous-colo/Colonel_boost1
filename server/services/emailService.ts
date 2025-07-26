import nodemailer from 'nodemailer';

interface EmailConfig {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'contact.kerventzweb@gmail.com',
        pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD,
      },
    });
  }

  async sendConfirmationEmail(email: string, name: string): Promise<boolean> {
    try {
      const emailConfig: EmailConfig = {
        to: email,
        subject: '🚀 Bienvenue dans COLONEL BOOST - Confirmation d\'inscription',
        text: `Bonjour ${name},\n\nVotre inscription à COLONEL BOOST a été confirmée avec succès!\n\nRejoignez notre groupe WhatsApp pour télécharger le fichier VCF et booster votre visibilité:\nhttps://chat.whatsapp.com/JB6ibyPpXp2FEggADoJwK3\n\nMerci de nous faire confiance!\n\nL'équipe COLONEL BOOST 🚀🔥🇭🇹`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563EB; margin: 0;">COLONEL BOOST 🚀</h1>
              <p style="color: #059669; font-size: 18px; margin: 10px 0;">Confirmation d'inscription</p>
            </div>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h2 style="color: #1f2937;">Bonjour ${name},</h2>
              <p style="color: #4b5563; line-height: 1.6;">
                Votre inscription à <strong>COLONEL BOOST</strong> a été confirmée avec succès! 🎉
              </p>
              <p style="color: #4b5563; line-height: 1.6;">
                Vous faites maintenant partie de notre communauté qui booste la visibilité sur WhatsApp.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://chat.whatsapp.com/JB6ibyPpXp2FEggADoJwK3" 
                 style="background: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                📱 Rejoindre le groupe WhatsApp
              </a>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #92400e; margin: 0; text-align: center;">
                <strong>Prochaine étape:</strong> Rejoignez le groupe pour télécharger le fichier VCF et faire exploser votre visibilité! 🚀🔥
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">
                Merci de nous faire confiance!<br>
                L'équipe COLONEL BOOST 🇭🇹
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin-top: 10px;">
                Contact: contact.kerventzweb@gmail.com | +1 (849) 584-9472
              </p>
            </div>
          </div>
        `,
      };

      await this.transporter.sendMail({
        from: `"COLONEL BOOST 🚀" <${process.env.EMAIL_USER || 'contact.kerventzweb@gmail.com'}>`,
        ...emailConfig,
      });

      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
