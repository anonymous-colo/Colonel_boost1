import { Card, CardContent } from "@/components/ui/card";
import { useTranslation, type Language } from "@/lib/i18n";
import { MessageCircle, Mail } from "lucide-react";

interface ContactSectionProps {
  language: Language;
}

export default function ContactSection({ language }: ContactSectionProps) {
  const t = useTranslation(language);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8" data-testid="text-contact-title">
          {t.contact.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2" data-testid="text-whatsapp-title">WhatsApp</h3>
              <p className="text-muted-foreground mb-4" data-testid="text-whatsapp-description">{t.contact.whatsapp}</p>
              <a 
                href="https://wa.me/18495849472" 
                className="text-green-500 hover:text-green-600 font-medium text-lg"
                data-testid="link-whatsapp-contact"
              >
                +1 (849) 584-9472
              </a>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2" data-testid="text-email-title">Email</h3>
              <p className="text-muted-foreground mb-4" data-testid="text-email-description">{t.contact.email}</p>
              <a 
                href="mailto:contact.kerventzweb@gmail.com" 
                className="text-primary hover:text-primary/80 font-medium text-lg"
                data-testid="link-email-contact"
              >
                contact.kerventzweb@gmail.com
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
