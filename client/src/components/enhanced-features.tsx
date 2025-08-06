import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Globe, 
  Smartphone, 
  Download, 
  Search, 
  BarChart3,
  Zap,
  Clock
} from "lucide-react";

interface EnhancedFeaturesProps {
  language: 'fr' | 'en' | 'es';
}

export default function EnhancedFeatures({ language }: EnhancedFeaturesProps) {
  const features = [
    {
      icon: Shield,
      title: {
        fr: "Sécurité Renforcée",
        en: "Enhanced Security", 
        es: "Seguridad Reforzada"
      },
      description: {
        fr: "Authentification sécurisée avec sessions cryptées et protection contre les intrusions",
        en: "Secure authentication with encrypted sessions and intrusion protection",
        es: "Autenticación segura con sesiones encriptadas y protección contra intrusiones"
      },
      badge: {
        fr: "Sécurisé",
        en: "Secure",
        es: "Seguro"
      }
    },
    {
      icon: Globe,
      title: {
        fr: "Support Multi-langues",
        en: "Multi-language Support",
        es: "Soporte Multi-idiomas"
      },
      description: {
        fr: "Interface disponible en français, anglais et espagnol avec traductions complètes",
        en: "Interface available in French, English and Spanish with complete translations",
        es: "Interfaz disponible en francés, inglés y español con traducciones completas"
      },
      badge: {
        fr: "3 Langues",
        en: "3 Languages",
        es: "3 Idiomas"
      }
    },
    {
      icon: Smartphone,
      title: {
        fr: "Mobile Responsif",
        en: "Mobile Responsive",
        es: "Móvil Responsivo"
      },
      description: {
        fr: "Design adaptatif optimisé pour tous les appareils : mobile, tablette et desktop",
        en: "Adaptive design optimized for all devices: mobile, tablet and desktop",
        es: "Diseño adaptativo optimizado para todos los dispositivos: móvil, tableta y escritorio"
      },
      badge: {
        fr: "100% Adaptatif",
        en: "100% Adaptive",
        es: "100% Adaptativo"
      }
    },
    {
      icon: Download,
      title: {
        fr: "Export Avancé",
        en: "Advanced Export",
        es: "Exportación Avanzada"
      },
      description: {
        fr: "Export des contacts en VCF et CSV avec support complet des emojis et caractères spéciaux",
        en: "Export contacts in VCF and CSV with full emoji and special character support",
        es: "Exportar contactos en VCF y CSV con soporte completo de emojis y caracteres especiales"
      },
      badge: {
        fr: "VCF/CSV",
        en: "VCF/CSV",
        es: "VCF/CSV"
      }
    },
    {
      icon: Search,
      title: {
        fr: "Recherche Intelligente",
        en: "Smart Search",
        es: "Búsqueda Inteligente"
      },
      description: {
        fr: "Système de recherche avancé avec filtres par nom, numéro et critères multiples",
        en: "Advanced search system with filters by name, number and multiple criteria",
        es: "Sistema de búsqueda avanzado con filtros por nombre, número y criterios múltiples"
      },
      badge: {
        fr: "IA Intégrée",
        en: "AI Integrated",
        es: "IA Integrada"
      }
    },
    {
      icon: BarChart3,
      title: {
        fr: "Analytics en Temps Réel",
        en: "Real-time Analytics",
        es: "Análisis en Tiempo Real"
      },
      description: {
        fr: "Tableaux de bord avec statistiques détaillées et suivi des inscriptions en direct",
        en: "Dashboards with detailed statistics and live registration tracking",
        es: "Paneles con estadísticas detalladas y seguimiento de registros en vivo"
      },
      badge: {
        fr: "Live Stats",
        en: "Live Stats",
        es: "Stats en Vivo"
      }
    },
    {
      icon: Zap,
      title: {
        fr: "Performance Optimisée",
        en: "Optimized Performance",
        es: "Rendimiento Optimizado"
      },
      description: {
        fr: "Chargement ultra-rapide avec cache intelligent et optimisation automatique",
        en: "Ultra-fast loading with smart cache and automatic optimization",
        es: "Carga ultra-rápida con caché inteligente y optimización automática"
      },
      badge: {
        fr: "&lt; 2s",
        en: "&lt; 2s",
        es: "&lt; 2s"
      }
    },
    {
      icon: Clock,
      title: {
        fr: "Historique Complet",
        en: "Complete History",
        es: "Historial Completo"
      },
      description: {
        fr: "Suivi chronologique des inscriptions avec horodatage et dernières activités",
        en: "Chronological tracking of registrations with timestamps and recent activities",
        es: "Seguimiento cronológico de registros con marcas de tiempo y actividades recientes"
      },
      badge: {
        fr: "Historique",
        en: "History",
        es: "Historial"
      }
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === 'fr' ? 'Fonctionnalités Avancées' : 
             language === 'en' ? 'Advanced Features' : 
             'Características Avanzadas'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'fr' ? 'Des outils professionnels conçus pour optimiser votre réseau de contacts' :
             language === 'en' ? 'Professional tools designed to optimize your contact network' :
             'Herramientas profesionales diseñadas para optimizar tu red de contactos'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="relative group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge[language]}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-semibold">
                  {feature.title[language]}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description[language]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 bg-card/50 backdrop-blur-sm rounded-xl border-0">
            <div className="text-2xl font-bold text-primary mb-2">2,847+</div>
            <div className="text-sm text-muted-foreground">
              {language === 'fr' ? 'Membres Actifs' : 
               language === 'en' ? 'Active Members' : 
               'Miembros Activos'}
            </div>
          </div>
          <div className="p-6 bg-card/50 backdrop-blur-sm rounded-xl border-0">
            <div className="text-2xl font-bold text-green-600 mb-2">99.9%</div>
            <div className="text-sm text-muted-foreground">
              {language === 'fr' ? 'Disponibilité' : 
               language === 'en' ? 'Uptime' : 
               'Disponibilidad'}
            </div>
          </div>
          <div className="p-6 bg-card/50 backdrop-blur-sm rounded-xl border-0">
            <div className="text-2xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">
              {language === 'fr' ? 'Support' : 
               language === 'en' ? 'Support' : 
               'Soporte'}
            </div>
          </div>
          <div className="p-6 bg-card/50 backdrop-blur-sm rounded-xl border-0">
            <div className="text-2xl font-bold text-purple-600 mb-2">&lt; 2s</div>
            <div className="text-sm text-muted-foreground">
              {language === 'fr' ? 'Chargement' : 
               language === 'en' ? 'Loading' : 
               'Carga'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}