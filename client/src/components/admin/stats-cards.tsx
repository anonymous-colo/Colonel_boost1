import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, Mail, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  stats?: {
    totalContacts: number;
    todayContacts: number;
    weekContacts: number;
    withEmail: number;
    latestContacts: Array<{
      id: string;
      name: string;
      email: string | null;
      phone: string;
      createdAt: string | Date;
    }>;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Contacts",
      value: stats.totalContacts,
      icon: Users,
      bgColor: "bg-gradient-to-r from-blue-500 to-blue-600",
      testId: "stat-total-contacts"
    },
    {
      title: "Aujourd'hui",
      value: stats.todayContacts,
      icon: Calendar,
      bgColor: "bg-gradient-to-r from-green-500 to-green-600",
      testId: "stat-today-contacts"
    },
    {
      title: "Avec Email",
      value: stats.withEmail,
      icon: Mail,
      bgColor: "bg-gradient-to-r from-purple-500 to-purple-600",
      testId: "stat-with-email"
    },
    {
      title: "Cette semaine",
      value: stats.weekContacts,
      icon: TrendingUp,
      bgColor: "bg-gradient-to-r from-orange-500 to-orange-600",
      testId: "stat-week-contacts"
    }
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <Card key={index} className={`${card.bgColor} text-white border-0 shadow-lg`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">{card.title}</p>
                  <p className="text-3xl font-bold" data-testid={card.testId}>
                    {card.value.toLocaleString()}
                  </p>
                </div>
                <card.icon className="h-8 w-8 text-white/60" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Latest Contacts */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4" data-testid="text-latest-contacts-title">
            5 derniers inscrits
          </h3>
          <div className="space-y-3">
            {stats.latestContacts.map((contact, index) => (
              <div 
                key={contact.id} 
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                data-testid={`latest-contact-${index}`}
              >
                <div>
                  <p className="font-medium text-foreground" data-testid={`latest-contact-name-${index}`}>
                    {contact.name}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid={`latest-contact-phone-${index}`}>
                    {contact.phone}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {new Date(contact.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
