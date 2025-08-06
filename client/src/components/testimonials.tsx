import { Card, CardContent } from "@/components/ui/card";
import { useTranslation, type Language } from "@/lib/i18n";
import { Star } from "lucide-react";

interface TestimonialsProps {
  language: Language;
}

const testimonials = [
  {
    name: "Marie Dubois",
    role: "Entrepreneure",
    content: "Grâce à KERVENTZ STATUS, j'ai pu développer mon réseau professionnel de manière exponentielle. Les contacts sont de qualité !",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Jean Baptiste",
    role: "Consultant IT",
    content: "L'interface est intuitive et l'accès aux contacts est instantané. C'est exactement ce dont j'avais besoin pour mon business.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Sophie Laurent",
    role: "Marketing Manager",
    content: "Le système de validation est parfait. Fini les doublons et les erreurs. KERVENTZ STATUS, c'est la révolution !",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Pierre Michel",
    role: "Architecte",
    content: "Une plateforme exceptionnelle qui m'a permis de connecter avec des professionnels de qualité en Haïti et dans la diaspora.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Claudine Joseph",
    role: "Directrice RH",
    content: "L'export VCF est fantastique ! J'ai pu intégrer tous les contacts directement dans mon téléphone en un clic.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Robert Charles",
    role: "Ingénieur",
    content: "Enfin une solution complète pour gérer mon réseau professionnel. L'interface admin est particulièrement bien pensée.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Linda Francois",
    role: "Avocate",
    content: "La vérification anti-doublons m'a évité bien des problèmes. Une plateforme professionnelle et fiable.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Daniel Pierre",
    role: "Chef d'entreprise",
    content: "KERVENTZ STATUS a révolutionné ma façon de networker. Je recommande à tous les professionnels !",
    image: "https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Michelle Laporte",
    role: "Consultante",
    content: "Une communauté formidable avec des fonctionnalités modernes. L'intégration WhatsApp est géniale !",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Alexandre Morin",
    role: "Développeur",
    content: "Interface moderne, fonctionnalités avancées, et une communauté active. Tout ce qu'il faut pour réussir !",
    image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face"
  }
];

export default function Testimonials({ language }: TestimonialsProps) {
  const t = useTranslation(language);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-testimonials-title">
            {t.testimonials.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-testimonials-description">
            {t.testimonials.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md"
              data-testid={`card-testimonial-${index}`}
            >
              <CardContent className="p-6">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover border-4 border-primary"
                  data-testid={`img-testimonial-${index}`}
                />
                <h4 className="font-semibold text-foreground text-center mb-2" data-testid={`text-testimonial-name-${index}`}>
                  {testimonial.name} K.B.S🚀🔥
                </h4>
                <p className="text-muted-foreground text-center text-sm mb-4" data-testid={`text-testimonial-role-${index}`}>
                  {testimonial.role}
                </p>
                <p className="text-foreground text-center italic text-sm" data-testid={`text-testimonial-content-${index}`}>
                  "{testimonial.content}"
                </p>
                <div className="flex justify-center mt-4">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
