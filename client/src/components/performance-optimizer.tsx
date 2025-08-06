import { useEffect } from 'react';

// Optimiseur de performance pour le projet KERVENTZ STATUS
export default function PerformanceOptimizer() {
  useEffect(() => {
    // Préchargement des images critiques
    const preloadImages = () => {
      const criticalImages = [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      ];
      
      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Optimisation des fonts
    const optimizeFonts = () => {
      const fontLink = document.createElement('link');
      fontLink.rel = 'preconnect';
      fontLink.href = 'https://fonts.googleapis.com';
      document.head.appendChild(fontLink);
    };

    // Nettoyage des sessions expirées
    const cleanupSessions = () => {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes('session') || key.includes('temp')) {
          const item = localStorage.getItem(key);
          if (item) {
            try {
              const parsed = JSON.parse(item);
              if (parsed.expiry && Date.now() > parsed.expiry) {
                localStorage.removeItem(key);
              }
            } catch (e) {
              // Ignorer les erreurs de parsing
            }
          }
        }
      });
    };

    preloadImages();
    optimizeFonts();
    cleanupSessions();
  }, []);

  return null; // Composant sans rendu
}