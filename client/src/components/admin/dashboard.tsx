import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/components/ui/theme-provider";
import { Moon, Sun, Download, FileSpreadsheet, Trash2, Search, LogOut } from "lucide-react";
import StatsCards from "./stats-cards";
import ContactTable from "./contact-table";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  admin: {
    id: string;
    username: string;
    lastLogin?: string;
  };
}

export default function Dashboard({ admin }: DashboardProps) {
  const { theme, setTheme } = useTheme();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const { data: contacts = [], refetch: refetchContacts } = useQuery({
    queryKey: ["/api/admin/contacts"],
    queryFn: () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filter !== 'all') params.append('filter', filter);
      return fetch(`/api/admin/contacts?${params.toString()}`, {
        credentials: 'include'
      }).then(res => res.json());
    }
  });

  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

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

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="bg-card shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground" data-testid="text-dashboard-title">
                Dashboard Administrateur
              </h1>
              <p className="text-muted-foreground" data-testid="text-dashboard-subtitle">
                Gestion des contacts KERVENTZ STATUS
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
                data-testid="button-theme-toggle"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=40&h=40&fit=crop&crop=face" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground" data-testid="text-admin-name">{admin.username}</p>
                  <p className="text-xs text-muted-foreground">En ligne</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  data-testid="button-logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contrôles et recherche</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom ou numéro..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-contacts"
                  />
                </div>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full sm:w-48" data-testid="select-contact-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les contacts</SelectItem>
                    <SelectItem value="with-email">Avec email</SelectItem>
                    <SelectItem value="today">Aujourd'hui</SelectItem>
                    <SelectItem value="week">Cette semaine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={handleExportVCF}
                  className="bg-green-500 hover:bg-green-600 text-white"
                  data-testid="button-export-vcf"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export VCF
                </Button>
                <Button 
                  onClick={handleExportCSV}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  data-testid="button-export-csv"
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
                <Button 
                  onClick={handleDeleteAll}
                  variant="destructive"
                  data-testid="button-delete-all"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Tout supprimer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacts Table */}
        <ContactTable 
          contacts={contacts} 
          onRefresh={() => {
            refetchContacts();
            refetchStats();
          }}
        />
      </div>
    </div>
  );
}
