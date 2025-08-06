import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Zap, 
  Shield, 
  TrendingUp,
  MessageSquare,
  FileText,
  Users,
  BarChart,
  Smartphone,
  Globe,
  Clock,
  Star,
  CheckCircle,
  ArrowRight
} from "lucide-react";

interface BrilliantFeaturesProps {
  language: 'fr' | 'en' | 'es';
}

export default function BrilliantFeatures({ language }: BrilliantFeaturesProps) {
  const features = [
    {
      icon: Brain,
      title: {
        fr: "Intelligence Artificielle",
        en: "Artificial Intelligence",
        es: "Inteligencia Artificial"
      },
      description: {
        fr: "Analyse automatique des profils et recommandations intelligentes de networking",
        en: "Automatic profile analysis and intelligent networking recommendations",
        es: "Análisis automático de perfiles y recomendaciones inteligentes de networking"
      },
      status: "NOUVEAU",
      color: "bg-purple-500",
      benefits: [
        {
          fr: "Matching automatique de profils compatibles",
          en: "Automatic matching of compatible profiles",
          es: "Coincidencia automática de perfiles compatibles"
        },
        {
          fr: "Suggestions de connexions stratégiques",
          en: "Strategic connection suggestions",
          es: "Sugerencias de conexiones estratégicas"
        }
      ]
    },
    {
      icon: TrendingUp,
      title: {
        fr: "Analytics Prédictifs",
        en: "Predictive Analytics",
        es: "Análisis Predictivos"
      },
      description: {
        fr: "Prédiction des tendances de croissance et opportunités d'affaires émergentes",
        en: "Prediction of growth trends and emerging business opportunities",
        es: "Predicción de tendencias de crecimiento y oportunidades comerciales emergentes"
      },
      status: "PREMIUM",
      color: "bg-blue-500",
      benefits: [
        {
          fr: "Identification d'opportunités d'investissement",
          en: "Investment opportunity identification",
          es: "Identificación de oportunidades de inversión"
        },
        {
          fr: "Prévisions de marché en temps réel",
          en: "Real-time market forecasts",
          es: "Pronósticos de mercado en tiempo real"
        }
      ]
    },
    {
      icon: MessageSquare,
      title: {
        fr: "Communication Unifiée",
        en: "Unified Communication",
        es: "Comunicación Unificada"
      },
      description: {
        fr: "Hub de communication intégré avec WhatsApp, Email et vidéoconférence",
        en: "Integrated communication hub with WhatsApp, Email and video conferencing",
        es: "Centro de comunicación integrado con WhatsApp, correo y videoconferencia"
      },
      status: "ACTIF",
      color: "bg-green-500",
      benefits: [
        {
          fr: "Messagerie directe intégrée",
          en: "Integrated direct messaging",
          es: "Mensajería directa integrada"
        },
        {
          fr: "Planification de réunions automatique",
          en: "Automatic meeting scheduling",
          es: "Programación automática de reuniones"
        }
      ]
    },
    {
      icon: FileText,
      title: {
        fr: "Documentation Intelligente",
        en: "Smart Documentation",
        es: "Documentación Inteligente"
      },
      description: {
        fr: "Génération automatique de rapports et contrats avec IA juridique",
        en: "Automatic report and contract generation with legal AI",
        es: "Generación automática de informes y contratos con IA legal"
      },
      status: "BÊTA",
      color: "bg-orange-500",
      benefits: [
        {
          fr: "Templates de contrats prêts à l'emploi",
          en: "Ready-to-use contract templates",
          es: "Plantillas de contratos listas para usar"
        },
        {
          fr: "Révision automatique de documents",
          en: "Automatic document review",
          es: "Revisión automática de documentos"
        }
      ]
    }
  ];

  const stats = [
    {
      value: "2,847+",
      label: {
        fr: "Professionnels Connectés",
        en: "Connected Professionals",
        es: "Profesionales Conectados"
      },
      icon: Users,
      trend: "+23%"
    },
    {
      value: "95%",
      label: {
        fr: "Taux de Satisfaction",
        en: "Satisfaction Rate",
        es: "Tasa de Satisfacción"
      },
      icon: Star,
      trend: "+5%"
    },
    {
      value: "147",
      label: {
        fr: "Partenariats Créés",
        en: "Partnerships Created",
        es: "Asociaciones Creadas"
      },
      icon: CheckCircle,
      trend: "+31%"
    },
    {
      value: "24/7",
      label: {
        fr: "Support Disponible",
        en: "Support Available",
        es: "Soporte Disponible"
      },
      icon: Clock,
      trend: "100%"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      "NOUVEAU": "bg-purple-100 text-purple-800 border-purple-200",
      "PREMIUM": "bg-blue-100 text-blue-800 border-blue-200",
      "ACTIF": "bg-green-100 text-green-800 border-green-200",
      "BÊTA": "bg-orange-100 text-orange-800 border-orange-200"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/20 dark:via-gray-950 dark:to-purple-950/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl mb-6">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            {language === 'fr' ? 'Fonctionnalités Révolutionnaires' : 
             language === 'en' ? 'Revolutionary Features' : 
             'Características Revolucionarias'}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {language === 'fr' ? 'Propulsez votre réseau professionnel vers l\'avenir avec nos technologies de pointe' :
             language === 'en' ? 'Propel your professional network into the future with our cutting-edge technologies' :
             'Impulsa tu red profesional hacia el futuro con nuestras tecnologías de vanguardia'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground mb-2">{stat.label[language]}</div>
                <div className="inline-flex items-center text-xs text-green-600 font-medium">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.trend}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="group relative overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className={`absolute inset-0 ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 ${feature.color} rounded-xl shadow-lg`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge className={getStatusBadge(feature.status)}>
                    {feature.status}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {feature.title[language]}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {feature.description[language]}
                </p>
                
                <div className="space-y-3 mb-6">
                  {feature.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{benefit[language]}</span>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                  {language === 'fr' ? 'En savoir plus' : 
                   language === 'en' ? 'Learn more' : 
                   'Saber más'}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">
            {language === 'fr' ? 'Prêt à Révolutionner Votre Réseau ?' : 
             language === 'en' ? 'Ready to Revolutionize Your Network?' : 
             '¿Listo para Revolucionar tu Red?'}
          </h3>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            {language === 'fr' ? 'Rejoignez plus de 2,800 professionnels qui font déjà confiance à KERVENTZ STATUS' :
             language === 'en' ? 'Join over 2,800 professionals who already trust KERVENTZ STATUS' :
             'Únete a más de 2,800 profesionales que ya confían en KERVENTZ STATUS'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4">
              <Users className="h-5 w-5 mr-2" />
              {language === 'fr' ? 'Rejoindre Maintenant' : 
               language === 'en' ? 'Join Now' : 
               'Únete Ahora'}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-4">
              <MessageSquare className="h-5 w-5 mr-2" />
              {language === 'fr' ? 'Démo Gratuite' : 
               language === 'en' ? 'Free Demo' : 
               'Demo Gratuita'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}