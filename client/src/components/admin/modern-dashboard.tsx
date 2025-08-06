import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/ui/theme-provider";
import { 
  Moon, 
  Sun, 
  Download, 
  FileSpreadsheet, 
  Trash2, 
  Search, 
  LogOut,
  Users,
  TrendingUp,
  Calendar,
  Mail,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  RefreshCw
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DashboardProps {
  admin: {
    id: string;
    username: string;
    lastLogin?: string;
  };
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  countryCode: string;
  email?: string;
  createdAt: string;
}

export default function ModernDashboard({ admin }: DashboardProps) {
  const { theme, setTheme } = useTheme();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: contacts = [], refetch: refetchContacts, isLoading } = useQuery({
    queryKey: ["/api/admin/contacts", searchQuery, filter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filter !== 'all') params.append('filter', filter);
      
      const response = await fetch(`/api/admin/contacts?${params.toString()}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch contacts');
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ["/api/admin/stats"],
    refetchInterval: 30000,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      refetchContacts();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, filter, refetchContacts]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchContacts(), refetchStats()]);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/admin/logout");
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion.",
        variant: "destructive",
      });
    }
  };

  const handleExportVCF = async () => {
    try {
      const response = await fetch("/api/admin/export/vcf", {
        credentials: "include",
      });
      
      if (!response.ok) throw new Error("Erreur lors de l'export");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "kerventz-contacts.vcf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export réussi",
        description: "Le fichier VCF a été téléchargé.",
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les contacts.",
        variant: "destructive",
      });
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch("/api/admin/export/csv", {
        credentials: "include",
      });
      
      if (!response.ok) throw new Error("Erreur lors de l'export");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "kerventz-contacts.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export réussi",
        description: "Le fichier CSV a été téléchargé.",
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les contacts.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer tous les contacts ?")) return;
    
    try {
      await apiRequest("DELETE", "/api/admin/contacts");
      toast({
        title: "Suppression réussie",
        description: "Tous les contacts ont été supprimés.",
      });
      refetchContacts();
      refetchStats();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les contacts.",
        variant: "destructive",
      });
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, description }: any) => (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-2xl"></div>
      <CardHeader className="relative pb-3">
        <div className="flex items-center justify-between">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg">
            <Icon className="h-6 w-6 text-white" />
          </div>
          {trend && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              +{trend}%
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{value}</div>
        <div className="text-slate-600 dark:text-slate-400 font-medium">{title}</div>
        {description && (
          <div className="text-xs text-slate-500 dark:text-slate-500 mt-2">{description}</div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-75"></div>
                <Avatar className="relative h-14 w-14 ring-2 ring-white dark:ring-slate-800">
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-xl">
                    {admin.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Dashboard KERVENTZ STATUS
                </h1>
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  Bienvenue, {admin.username} • Panel d'Administration
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                className="rounded-full h-12 w-12 border-2 hover:scale-105 transition-all duration-200"
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full h-12 w-12 border-2 hover:scale-105 transition-all duration-200"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleLogout}
                className="rounded-full border-2 hover:scale-105 transition-all duration-200 px-6"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Contacts"
            value={stats?.totalContacts || 0}
            icon={Users}
            trend="12"
            description="Membres enregistrés"
          />
          <StatCard
            title="Aujourd'hui"
            value={stats?.todayContacts || 0}
            icon={TrendingUp}
            trend="5"
            description="Nouvelles inscriptions"
          />
          <StatCard
            title="Cette Semaine"
            value={stats?.weekContacts || 0}
            icon={Calendar}
            trend="23"
            description="Inscriptions récentes"
          />
          <StatCard
            title="Avec Email"
            value={stats?.withEmail || 0}
            icon={Mail}
            description="Contacts complets"
          />
        </div>

        {/* Controls */}
        <Card className="mb-8 border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="Rechercher un contact..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 w-full sm:w-80 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm"
                  />
                </div>
                
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full sm:w-56 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les contacts</SelectItem>
                    <SelectItem value="today">Aujourd'hui</SelectItem>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="with-email">Avec email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-3 w-full lg:w-auto">
                <Button
                  onClick={handleExportCSV}
                  variant="outline"
                  className="flex-1 lg:flex-none h-12 px-6 rounded-xl border-2 hover:scale-105 transition-all duration-200"
                >
                  <FileSpreadsheet className="h-5 w-5 mr-2" />
                  CSV
                </Button>
                
                <Button
                  onClick={handleExportVCF}
                  className="flex-1 lg:flex-none h-12 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <Download className="h-5 w-5 mr-2" />
                  VCF
                </Button>
                
                <Button
                  onClick={handleDeleteAll}
                  variant="destructive"
                  className="flex-1 lg:flex-none h-12 px-6 rounded-xl hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacts Table */}
        <Card className="border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Contacts Enregistrés</CardTitle>
            <CardDescription>
              {contacts.length} contact{contacts.length > 1 ? 's' : ''} au total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-purple-500" />
                <span className="ml-3 text-slate-600 dark:text-slate-400">Chargement...</span>
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Aucun contact trouvé
                </h3>
                <p className="text-slate-500 dark:text-slate-500">
                  {searchQuery ? "Aucun résultat pour votre recherche" : "Les nouveaux contacts apparaîtront ici"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-4 px-2 font-semibold text-slate-700 dark:text-slate-300">Contact</th>
                      <th className="text-left py-4 px-2 font-semibold text-slate-700 dark:text-slate-300">Téléphone</th>
                      <th className="text-left py-4 px-2 font-semibold text-slate-700 dark:text-slate-300">Email</th>
                      <th className="text-left py-4 px-2 font-semibold text-slate-700 dark:text-slate-300">Date</th>
                      <th className="text-left py-4 px-2 font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact: Contact) => (
                      <tr key={contact.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-4 px-2">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold">
                                {contact.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-white">{contact.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="font-mono text-slate-700 dark:text-slate-300">
                            {contact.countryCode} {contact.phone}
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          {contact.email ? (
                            <div className="text-slate-700 dark:text-slate-300">{contact.email}</div>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600">Non fourni</span>
                          )}
                        </td>
                        <td className="py-4 px-2">
                          <div className="text-slate-600 dark:text-slate-400">
                            {format(new Date(contact.createdAt), 'dd MMM yyyy à HH:mm', { locale: fr })}
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-full">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-full">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-full">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}