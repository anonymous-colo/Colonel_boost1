import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation, type Language } from "@/lib/i18n";
import { HelpCircle } from "lucide-react";

interface FAQProps {
  language: Language;
}

const faqItems = [
  {
    question: "Comment accéder aux contacts après inscription ?",
    answer: "Après votre inscription, vous recevrez un lien vers notre groupe WhatsApp où vous pourrez télécharger le fichier VCF contenant tous les contacts du réseau."
  },
  {
    question: "Le système détecte-t-il les doublons ?",
    answer: "Oui, notre système de validation avancée empêche l'inscription de numéros déjà enregistrés, garantissant ainsi l'unicité de chaque contact."
  },
  {
    question: "Puis-je modifier mes informations après inscription ?",
    answer: "Pour toute modification, contactez notre équipe via WhatsApp ou email. Nos administrateurs peuvent mettre à jour vos informations rapidement."
  },
  {
    question: "Le service est-il gratuit ?",
    answer: "Oui, l'inscription et l'accès aux contacts sont entièrement gratuits. Notre objectif est de faciliter le networking professionnel."
  },
  {
    question: "Combien de contacts puis-je obtenir ?",
    answer: "Vous aurez accès à tous les contacts enregistrés dans notre réseau, soit actuellement plus de 2,800 professionnels actifs."
  },
  {
    question: "Comment fonctionne l'export VCF ?",
    answer: "Le fichier VCF est disponible dans le groupe WhatsApp et peut être directement importé dans votre carnet d'adresses mobile ou ordinateur."
  }
];

export default function FAQ({ language }: FAQProps) {
  const t = useTranslation(language);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-faq-title">
            {t.faq.title}
          </h2>
          <p className="text-xl text-muted-foreground" data-testid="text-faq-description">
            {t.faq.description}
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-card rounded-lg border shadow-sm px-6"
              data-testid={`accordion-faq-item-${index}`}
            >
              <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-6">
                <div className="flex items-center">
                  <HelpCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <span data-testid={`text-faq-question-${index}`}>{item.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6 pl-8">
                <p data-testid={`text-faq-answer-${index}`}>{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
