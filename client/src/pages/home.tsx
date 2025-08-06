import { useState } from "react";
import { useTheme } from "@/components/ui/theme-provider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Moon, Sun, ShieldQuestion, Rocket, Users } from "lucide-react";
import RegistrationForm from "@/components/registration-form";
import Testimonials from "@/components/testimonials";
import FAQ from "@/components/faq";
import ContactSection from "@/components/contact-section";
import AdminAccessButton from "@/components/admin-access-button";
import EnhancedFeatures from "@/components/enhanced-features";
import LatestMembers from "@/components/latest-members";
import BrilliantFeatures from "@/components/brilliant-features";
import { useTranslation, type Language } from "@/lib/i18n";
import { useLocation } from "wouter";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState<Language>('fr');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [registeredName, setRegisteredName] = useState("");
  const [, setLocation] = useLocation();
  const t = useTranslation(language);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleRegistrationSuccess = (name: string) => {
    setRegisteredName(name);
    setShowSuccess(true);
  };

  const handleAdminLogin = async () => {
    if (!adminPassword.trim()) {
      return;
    }
    
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "admin",
          password: adminPassword,
          rememberMe: false
        })
      });

      if (response.ok) {
        setShowAdminLogin(false);
        setAdminPassword("");
        setLocation("/admin");
      } else {
        alert("Mot de passe incorrect");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      alert("Erreur de connexion");
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="bg-card shadow-lg sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                {t.title}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
                <SelectTrigger className="w-40" data-testid="select-language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">🇫🇷 Français</SelectItem>
                  <SelectItem value="en">🇬🇧 English</SelectItem>
                  <SelectItem value="es">🇪🇸 Español</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Dark Mode Toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
                data-testid="button-theme-toggle"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              

            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-blue-600 to-blue-700 py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {t.hero.title} <br />
            <span className="text-yellow-300">{t.hero.subtitle}</span> 🚀
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t.hero.description}
          </p>
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
            <Users className="h-5 w-5 text-yellow-300" />
            <span className="font-medium" data-testid="text-member-count">2,847</span>
            <span>{t.hero.activeMembers}</span>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      {!showSuccess ? (
        <section className="py-16 px-4 sm:px-6 lg:px-8" id="registration">
          <RegistrationForm 
            language={language}
            onSuccess={handleRegistrationSuccess}
          />
        </section>
      ) : (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-green-50 dark:bg-green-900/20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-card rounded-2xl shadow-xl p-8 border border-green-200 dark:border-green-700">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4" data-testid="text-success-title">
                {t.success.title}
              </h3>
              <p className="text-muted-foreground mb-6" data-testid="text-success-message">
                {t.success.message.replace("{name}", registeredName)}
              </p>
              <div className="space-y-4">
                <Button asChild className="w-full bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-4 h-auto">
                  <a 
                    href="https://chat.whatsapp.com/CsVWRycnwNHFhqVLEtFyZv?mode=ac_t"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="link-whatsapp-group"
                  >
                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    {t.success.whatsappButton}
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setShowSuccess(false);
                    setRegisteredName("");
                  }}
                  data-testid="button-back-to-form"
                >
                  Retour au formulaire
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest Members */}
      <LatestMembers language={language} />

      {/* Brilliant Features */}
      <BrilliantFeatures language={language} />

      {/* Enhanced Features */}
      <EnhancedFeatures language={language} />

      {/* Testimonials */}
      <Testimonials language={language} />

      {/* FAQ */}
      <FAQ language={language} />

      {/* Contact Section */}
      <ContactSection language={language} />

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">KERVENTZ STATUS</h3>
              </div>
              <p className="text-gray-400 mb-4">
                La plateforme de référence pour développer votre réseau professionnel en Haïti et dans la diaspora.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
              <ul className="space-y-2">
                <li><a href="#registration" className="text-gray-400 hover:text-white transition-colors">S'inscrire</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-2">
                <p className="text-gray-400">+1 (849) 584-9472</p>
                <p className="text-gray-400">contact.kerventzweb@gmail.com</p>
                <p className="text-gray-400">Haïti 🇭🇹</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 KERVENTZ STATUS. Tous droits réservés. 🚀🔥
            </p>
          </div>
        </div>
      </footer>

      {/* Admin Access Button */}
      <AdminAccessButton />

      {/* Admin Login Dialog */}
      <Dialog open={showAdminLogin} onOpenChange={setShowAdminLogin}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-admin-login">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldQuestion className="h-8 w-8 text-white" />
              </div>
              {t.admin.title}
            </DialogTitle>
            <DialogDescription className="text-center">
              {t.admin.description}
            </DialogDescription>
          </DialogHeader>
          
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleAdminLogin(); }}>
            <div>
              <label className="block text-sm font-medium mb-2">{t.admin.username}</label>
              <input 
                type="text"
                value="admin"
                readOnly
                className="w-full px-4 py-3 rounded-lg border bg-muted"
                data-testid="input-admin-username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">{t.admin.password}</label>
              <input 
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent"
                data-testid="input-admin-password"
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="remember" className="h-4 w-4" data-testid="checkbox-remember-me" />
              <label htmlFor="remember" className="text-sm">{t.admin.rememberMe}</label>
            </div>
            
            <div className="flex space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowAdminLogin(false)}
                data-testid="button-admin-cancel"
              >
                {t.admin.cancel}
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-primary to-blue-600"
                data-testid="button-admin-login"
              >
                {t.admin.login}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
