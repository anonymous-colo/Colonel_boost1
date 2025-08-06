import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Edit, Trash2 } from "lucide-react";
import type { Contact } from "@shared/schema";

interface ContactTableProps {
  contacts: Contact[];
  onRefresh: () => void;
}

export default function ContactTable({ contacts, onRefresh }: ContactTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    email: "",
    countryCode: "",
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/contacts/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Contact supprimé",
        description: "Le contact a été supprimé avec succès.",
      });
      onRefresh();
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le contact.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest("PUT", `/api/admin/contacts/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Contact mis à jour",
        description: "Le contact a été mis à jour avec succès.",
      });
      setEditingContact(null);
      onRefresh();
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le contact.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setEditForm({
      name: contact.name.replace(" K.B.S🚀🔥", ""),
      phone: contact.phone,
      email: contact.email || "",
      countryCode: contact.countryCode,
    });
  };

  const handleUpdate = () => {
    if (!editingContact) return;
    
    updateMutation.mutate({
      id: editingContact.id,
      data: editForm,
    });
  };

  const handleDelete = (contact: Contact) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${contact.name} ?`)) {
      deleteMutation.mutate(contact.id);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle data-testid="text-contact-table-title">Liste des contacts</CardTitle>
          <CardDescription>
            {contacts.length} contact(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date d'inscription</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-muted-foreground" data-testid="text-no-contacts">
                        Aucun contact trouvé
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  contacts.map((contact) => (
                    <TableRow key={contact.id} className="hover:bg-muted/50" data-testid={`row-contact-${contact.id}`}>
                      <TableCell className="font-medium" data-testid={`text-contact-name-${contact.id}`}>
                        {contact.name}
                      </TableCell>
                      <TableCell data-testid={`text-contact-phone-${contact.id}`}>
                        {contact.countryCode} {contact.phone}
                      </TableCell>
                      <TableCell data-testid={`text-contact-email-${contact.id}`}>
                        {contact.email || "-"}
                      </TableCell>
                      <TableCell data-testid={`text-contact-date-${contact.id}`}>
                        {new Date(contact.createdAt).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(contact)}
                            data-testid={`button-edit-${contact.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(contact)}
                            className="text-red-600 hover:text-red-800"
                            data-testid={`button-delete-${contact.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingContact} onOpenChange={() => setEditingContact(null)}>
        <DialogContent data-testid="dialog-edit-contact">
          <DialogHeader>
            <DialogTitle>Modifier le contact</DialogTitle>
            <DialogDescription>
              Modifiez les informations du contact ci-dessous.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nom</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                data-testid="input-edit-name"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-phone">Téléphone</Label>
              <Input
                id="edit-phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                data-testid="input-edit-phone"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                data-testid="input-edit-email"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setEditingContact(null)}
                className="flex-1"
                data-testid="button-edit-cancel"
              >
                Annuler
              </Button>
              <Button 
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                className="flex-1"
                data-testid="button-edit-save"
              >
                {updateMutation.isPending ? "Mise à jour..." : "Sauvegarder"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
