import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { COUNTRIES } from "@/lib/constants";
import { 
  Shield, 
  Search, 
  Edit, 
  Trash2, 
  Download, 
  FileText, 
  Users, 
  LogOut, 
  AlertTriangle,
  Calendar
} from "lucide-react";

interface Contact {
  id: string;
  fullName: string;
  whatsappNumber: string;
  countryCode: string;
  email?: string;
  createdAt: string;
}

export default function Admin() {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editForm, setEditForm] = useState({
    fullName: "",
    whatsappNumber: "",
    countryCode: "",
    email: "",
  });
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check authentication on component mount
  useEffect(() => {
    const sessionId = localStorage.getItem("adminSession");
    const sessionExpiry = localStorage.getItem("sessionExpiry");
    
    if (!sessionId || !sessionExpiry) {
      setLocation("/admin/login");
      return;
    }
    
    if (new Date() > new Date(sessionExpiry)) {
      localStorage.removeItem("adminSession");
      localStorage.removeItem("sessionExpiry");
      toast({
        title: "Session expirée",
        description: "Veuillez vous reconnecter",
        variant: "destructive",
      });
      setLocation("/admin/login");
      return;
    }
  }, [setLocation, toast]);

  // Fetch contacts with search
  const { data: contacts = [], isLoading } = useQuery<Contact[]>({
    queryKey: ["/api/admin/contacts", searchQuery],
    queryFn: async () => {
      const sessionId = localStorage.getItem("adminSession");
      const url = searchQuery 
        ? `/api/admin/contacts?search=${encodeURIComponent(searchQuery)}`
        : "/api/admin/contacts";
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${sessionId}` },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("adminSession");
          localStorage.removeItem("sessionExpiry");
          setLocation("/admin/login");
          throw new Error("Session expirée");
        }
        throw new Error("Erreur lors du chargement");
      }
      
      return response.json();
    },
    enabled: !!localStorage.getItem("adminSession"),
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const sessionId = localStorage.getItem("adminSession");
      await apiRequest("POST", "/api/admin/logout", {}, {
        Authorization: `Bearer ${sessionId}`,
      });
    },
    onSuccess: () => {
      localStorage.removeItem("adminSession");
      localStorage.removeItem("sessionExpiry");
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      setLocation("/admin/login");
    },
  });

  // Update contact mutation
  const updateContactMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const sessionId = localStorage.getItem("adminSession");
      const response = await apiRequest("PUT", `/api/admin/contacts/${id}`, data, {
        Authorization: `Bearer ${sessionId}`,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
      setEditingContact(null);
      toast({
        title: "Contact modifié",
        description: "Les modifications ont été sauvegardées",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la modification",
        variant: "destructive",
      });
    },
  });

  // Delete contact mutation
  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      const sessionId = localStorage.getItem("adminSession");
      await apiRequest("DELETE", `/api/admin/contacts/${id}`, undefined, {
        Authorization: `Bearer ${sessionId}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
      toast({
        title: "Contact supprimé",
        description: "Le contact a été supprimé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression",
        variant: "destructive",
      });
    },
  });

  // Delete all contacts mutation
  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      const sessionId = localStorage.getItem("adminSession");
      const response = await apiRequest("DELETE", "/api/admin/contacts", undefined, {
        Authorization: `Bearer ${sessionId}`,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
      toast({
        title: "Tous les contacts supprimés",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setEditForm({
      fullName: contact.fullName,
      whatsappNumber: contact.whatsappNumber,
      countryCode: contact.countryCode,
      email: contact.email || "",
    });
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContact) return;
    
    updateContactMutation.mutate({
      id: editingContact.id,
      data: editForm,
    });
  };

  const handleDownload = async (type: 'vcf' | 'csv') => {
    try {
      const sessionId = localStorage.getItem("adminSession");
      const response = await fetch(`/api/admin/export/${type}`, {
        headers: { Authorization: `Bearer ${sessionId}` },
      });
      
      if (!response.ok) throw new Error("Erreur lors du téléchargement");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `colonel-boost-contacts.${type}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Téléchargement réussi",
        description: `Le fichier ${type.toUpperCase()} a été téléchargé`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCountryFlag = (countryCode: string) => {
    const country = COUNTRIES.find(c => c.code === countryCode);
    return country?.flag || '🌍';
  };

  if (!localStorage.getItem("adminSession")) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                COLONEL BOOST 🚀 ADMIN
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button
                variant="outline"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold">{contacts.length}</div>
                  <div className="text-muted-foreground">Total Contacts</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold">
                    {contacts.filter(c => 
                      new Date(c.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                    ).length}
                  </div>
                  <div className="text-muted-foreground">Aujourd'hui</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold">
                    {contacts.filter(c => c.email).length}
                  </div>
                  <div className="text-muted-foreground">Avec Email</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou numéro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => handleDownload('vcf')}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              VCF
            </Button>
            
            <Button
              onClick={() => handleDownload('csv')}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Tout Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
                    Supprimer tous les contacts
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Tous les contacts seront définitivement supprimés.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteAllMutation.mutate()}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Supprimer tout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Contacts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Chargement...</div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "Aucun contact trouvé" : "Aucun contact enregistré"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>WhatsApp</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">
                          {contact.fullName}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{getCountryFlag(contact.countryCode)}</span>
                            <span>{contact.countryCode}{contact.whatsappNumber}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {contact.email || (
                            <span className="text-muted-foreground">Non fourni</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(contact.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(contact)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer le contact</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer le contact de {contact.fullName} ?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteContactMutation.mutate(contact.id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Contact Dialog */}
        <Dialog open={!!editingContact} onOpenChange={() => setEditingContact(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le contact</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editFullName">Nom complet</Label>
                <Input
                  id="editFullName"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editWhatsappNumber">Numéro WhatsApp</Label>
                <Input
                  id="editWhatsappNumber"
                  value={editForm.whatsappNumber}
                  onChange={(e) => setEditForm(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingContact(null)}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={updateContactMutation.isPending}
                >
                  {updateContactMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
