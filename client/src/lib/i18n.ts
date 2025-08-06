export const translations = {
  fr: {
    title: "KERVENTZ STATUS 🚀🔥",
    hero: {
      title: "Rejoignez le réseau",
      subtitle: "KERVENTZ STATUS",
      description: "Connectez-vous avec notre communauté exclusive et accédez à tous les contacts du réseau en un seul clic.",
      activeMembers: "membres actifs"
    },
    registration: {
      title: "Inscription au réseau",
      description: "Rejoignez notre communauté en quelques secondes",
      name: "Nom complet",
      phone: "Numéro de téléphone",
      email: "Adresse email",
      submit: "S'inscrire maintenant",
      nameHint: "Le suffixe \"K.B.S🚀🔥\" sera automatiquement ajouté",
      phoneHint: "Vérification anti-doublons activée"
    },
    success: {
      title: "Inscription réussie !",
      message: "MERCI {name} vous avez été enregistrée avec succès. Maintenant je vous prie de bien vouloir entrer dans le groupe WhatsApp là où tu trouveras le folder VCF qui aura tous les contacts enregistrés pour que tu puisses le télécharger. Merci !",
      whatsappButton: "Rejoindre le groupe WhatsApp"
    },
    testimonials: {
      title: "Ce que disent nos membres",
      description: "Découvrez comment KERVENTZ STATUS a transformé leur réseau professionnel"
    },
    faq: {
      title: "Questions fréquentes",
      description: "Tout ce que vous devez savoir sur KERVENTZ STATUS"
    },
    contact: {
      title: "Contactez-nous",
      whatsapp: "Support instantané",
      email: "Support professionnel"
    },
    admin: {
      title: "Accès Administrateur",
      description: "Connectez-vous pour accéder au dashboard",
      username: "Nom d'utilisateur",
      password: "Mot de passe",
      rememberMe: "Se souvenir de moi",
      login: "Se connecter",
      cancel: "Annuler"
    }
  },
  en: {
    title: "KERVENTZ STATUS 🚀🔥",
    hero: {
      title: "Join the network",
      subtitle: "KERVENTZ STATUS",
      description: "Connect with our exclusive community and access all network contacts with a single click.",
      activeMembers: "active members"
    },
    registration: {
      title: "Network Registration",
      description: "Join our community in seconds",
      name: "Full name",
      phone: "Phone number",
      email: "Email address",
      submit: "Register now",
      nameHint: "The suffix \"K.B.S🚀🔥\" will be automatically added",
      phoneHint: "Anti-duplicate verification enabled"
    },
    success: {
      title: "Registration successful!",
      message: "THANK YOU {name} you have been successfully registered. Now please join the WhatsApp group where you will find the VCF folder with all registered contacts for download. Thank you!",
      whatsappButton: "Join WhatsApp group"
    },
    testimonials: {
      title: "What our members say",
      description: "Discover how KERVENTZ STATUS transformed their professional network"
    },
    faq: {
      title: "Frequently Asked Questions",
      description: "Everything you need to know about KERVENTZ STATUS"
    },
    contact: {
      title: "Contact us",
      whatsapp: "Instant support",
      email: "Professional support"
    },
    admin: {
      title: "Administrator Access",
      description: "Login to access the dashboard",
      username: "Username",
      password: "Password",
      rememberMe: "Remember me",
      login: "Login",
      cancel: "Cancel"
    }
  },
  es: {
    title: "KERVENTZ STATUS 🚀🔥",
    hero: {
      title: "Únete a la red",
      subtitle: "KERVENTZ STATUS",
      description: "Conéctate con nuestra comunidad exclusiva y accede a todos los contactos de la red con un solo clic.",
      activeMembers: "miembros activos"
    },
    registration: {
      title: "Registro en la red",
      description: "Únete a nuestra comunidad en segundos",
      name: "Nombre completo",
      phone: "Número de teléfono",
      email: "Dirección de email",
      submit: "Registrarse ahora",
      nameHint: "El sufijo \"K.B.S🚀🔥\" se agregará automáticamente",
      phoneHint: "Verificación anti-duplicados activada"
    },
    success: {
      title: "¡Registro exitoso!",
      message: "GRACIAS {name} has sido registrado exitosamente. Ahora por favor únete al grupo de WhatsApp donde encontrarás la carpeta VCF con todos los contactos registrados para descargar. ¡Gracias!",
      whatsappButton: "Unirse al grupo de WhatsApp"
    },
    testimonials: {
      title: "Lo que dicen nuestros miembros",
      description: "Descubre cómo KERVENTZ STATUS transformó su red profesional"
    },
    faq: {
      title: "Preguntas Frecuentes",
      description: "Todo lo que necesitas saber sobre KERVENTZ STATUS"
    },
    contact: {
      title: "Contáctanos",
      whatsapp: "Soporte instantáneo",
      email: "Soporte profesional"
    },
    admin: {
      title: "Acceso de Administrador",
      description: "Inicia sesión para acceder al panel",
      username: "Nombre de usuario",
      password: "Contraseña",
      rememberMe: "Recordarme",
      login: "Iniciar sesión",
      cancel: "Cancelar"
    }
  }
};

export type Language = keyof typeof translations;

export function useTranslation(language: Language = 'fr') {
  return translations[language];
}
