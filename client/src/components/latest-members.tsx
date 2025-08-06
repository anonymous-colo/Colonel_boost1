import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Clock, Phone, MapPin } from "lucide-react";
import { format } from "date-fns";
import { fr, enUS, es } from "date-fns/locale";

interface Contact {
  id: number;
  name: string;
  phone: string;
  countryCode: string;
  createdAt: string;
}

interface LatestMembersProps {
  language: 'fr' | 'en' | 'es';
}

export default function LatestMembers({ language }: LatestMembersProps) {
  const { data: contacts = [], isLoading } = useQuery<Contact[]>({
    queryKey: ['/api/contacts/latest'],
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
  });

  const getLocale = () => {
    switch (language) {
      case 'fr': return fr;
      case 'es': return es;
      default: return enUS;
    }
  };

  const t = {
    fr: {
      title: "Derniers Membres Rejoints",
      subtitle: "Les 5 professionnels qui ont récemment rejoint notre réseau",
      joinedOn: "Rejoint le",
      noMembers: "Aucun membre récent",
      loading: "Chargement des derniers membres...",
      viewAll: "Voir tous les membres",
      total: "membres au total"
    },
    en: {
      title: "Latest Members Joined",
      subtitle: "The 5 professionals who recently joined our network",
      joinedOn: "Joined on",
      noMembers: "No recent members",
      loading: "Loading latest members...",
      viewAll: "View all members",
      total: "total members"
    },
    es: {
      title: "Últimos Miembros Unidos",
      subtitle: "Los 5 profesionales que recientemente se unieron a nuestra red",
      joinedOn: "Se unió el",
      noMembers: "No hay miembros recientes",
      loading: "Cargando últimos miembros...",
      viewAll: "Ver todos los miembros",
      total: "miembros en total"
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Users className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t[language].loading}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-12 w-12 bg-muted rounded-full mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t[language].title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t[language].subtitle}
          </p>
        </div>

        {contacts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg">{t[language].noMembers}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {contacts.map((contact, index) => {
                const initials = contact.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase();

                const joinDate = new Date(contact.createdAt);
                const formattedDate = format(joinDate, 'dd MMM', { locale: getLocale() });
                
                return (
                  <Card key={contact.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/60 backdrop-blur-sm hover:bg-card">
                    <CardContent className="p-6 text-center">
                      <div className="relative mb-4">
                        <Avatar className="w-16 h-16 mx-auto ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white font-bold text-lg">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <Badge className="absolute -top-2 -right-2 bg-green-100 text-green-800 border-green-200">
                          #{index + 1}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-foreground mb-2 truncate" title={contact.name}>
                        {contact.name}
                      </h3>
                      
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center justify-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span className="truncate">{contact.countryCode} {contact.phone}</span>
                        </div>
                        
                        <div className="flex items-center justify-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{t[language].joinedOn} {formattedDate}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Stats Summary */}
            <div className="text-center">
              <div className="inline-flex items-center space-x-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-8 py-4 border shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-foreground">
                    {contacts.length > 0 ? `${contacts.length}+ nouveaux cette semaine` : ''}
                  </span>
                </div>
                <div className="w-px h-6 bg-border"></div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Haïti & Diaspora</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}