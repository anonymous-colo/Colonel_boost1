import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { countries, validatePhoneNumber, getPhoneValidationMessage } from "@/lib/countries";
import { useTranslation, type Language } from "@/lib/i18n";
import { UserPlus, Phone, Mail, User } from "lucide-react";

interface RegistrationFormProps {
  language: Language;
  onSuccess: (name: string) => void;
}

export default function RegistrationForm({ language, onSuccess }: RegistrationFormProps) {
  const t = useTranslation(language);
  const { toast } = useToast();
  
  const [selectedCountryCode, setSelectedCountryCode] = useState("+509");
  
  const enhancedSchema = insertContactSchema.extend({
    phone: insertContactSchema.shape.phone.refine((phone) => {
      return validatePhoneNumber(selectedCountryCode, phone);
    }, {
      message: getPhoneValidationMessage(selectedCountryCode, language),
    }),
  });
  
  const form = useForm<InsertContact>({
    resolver: zodResolver(enhancedSchema),
    defaultValues: {
      name: "",
      phone: "",
      countryCode: "+509",
      email: "",
    },
    mode: "onChange",
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      const response = await apiRequest("POST", "/api/contacts", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Inscription réussie !",
        description: "Vous avez été enregistré avec succès.",
      });
      onSuccess(data.contact.name);
    },
    onError: (error: any) => {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContact) => {
    registrationMutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold" data-testid="text-registration-title">
            {t.registration.title}
          </CardTitle>
          <CardDescription data-testid="text-registration-description">
            {t.registration.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <User className="h-4 w-4 text-primary mr-2" />
                      {t.registration.name}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Votre nom complet"
                        className="h-12"
                        data-testid="input-name"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      <span className="inline-block w-4 h-4 text-center">ℹ️</span>
                      {t.registration.nameHint}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Phone className="h-4 w-4 text-primary mr-2" />
                      {t.registration.phone}
                    </FormLabel>
                    <div className="flex space-x-2">
                      <FormField
                        control={form.control}
                        name="countryCode"
                        render={({ field: countryField }) => (
                          <FormItem>
                            <Select 
                              onValueChange={(value) => {
                                countryField.onChange(value);
                                setSelectedCountryCode(value);
                                form.trigger('phone');
                              }} 
                              defaultValue={countryField.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-32 h-12" data-testid="select-country-code">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem key={`${country.code}-${country.name}`} value={country.code}>
                                    {country.flag} {country.code}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormControl>
                        <Input 
                          {...field} 
                          type="tel"
                          placeholder="Votre numéro"
                          className="flex-1 h-12"
                          data-testid="input-phone"
                        />
                      </FormControl>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="inline-block w-4 h-4 text-center">🛡️</span>
                      {t.registration.phoneHint}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Mail className="h-4 w-4 text-primary mr-2" />
                      {t.registration.email}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="email"
                        placeholder="votre@email.com"
                        className="h-12"
                        data-testid="input-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                disabled={registrationMutation.isPending}
                data-testid="button-submit-registration"
              >
                {registrationMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Inscription en cours...
                  </div>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    {t.registration.submit}
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
