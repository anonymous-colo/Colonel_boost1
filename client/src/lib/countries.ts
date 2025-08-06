export const countries = [
  { code: '+509', name: 'Haiti', flag: '🇭🇹', minLength: 8, maxLength: 8 },
  { code: '+1', name: 'United States', flag: '🇺🇸', minLength: 10, maxLength: 10 },
  { code: '+1-CA', name: 'Canada', flag: '🇨🇦', minLength: 10, maxLength: 10 },
  { code: '+33', name: 'France', flag: '🇫🇷', minLength: 9, maxLength: 9 },
  { code: '+34', name: 'Spain', flag: '🇪🇸', minLength: 9, maxLength: 9 },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧', minLength: 10, maxLength: 11 },
  { code: '+49', name: 'Germany', flag: '🇩🇪', minLength: 10, maxLength: 12 },
  { code: '+39', name: 'Italy', flag: '🇮🇹', minLength: 9, maxLength: 11 },
  { code: '+351', name: 'Portugal', flag: '🇵🇹', minLength: 9, maxLength: 9 },
  { code: '+54', name: 'Argentina', flag: '🇦🇷', minLength: 10, maxLength: 11 },
  { code: '+55', name: 'Brazil', flag: '🇧🇷', minLength: 10, maxLength: 11 },
  { code: '+52', name: 'Mexico', flag: '🇲🇽', minLength: 10, maxLength: 10 },
  { code: '+57', name: 'Colombia', flag: '🇨🇴', minLength: 10, maxLength: 10 },
  { code: '+58', name: 'Venezuela', flag: '🇻🇪', minLength: 10, maxLength: 10 },
  { code: '+506', name: 'Costa Rica', flag: '🇨🇷', minLength: 8, maxLength: 8 },
  { code: '+507', name: 'Panama', flag: '🇵🇦', minLength: 8, maxLength: 8 },
  { code: '+593', name: 'Ecuador', flag: '🇪🇨', minLength: 9, maxLength: 9 },
  { code: '+51', name: 'Peru', flag: '🇵🇪', minLength: 9, maxLength: 9 },
  { code: '+56', name: 'Chile', flag: '🇨🇱', minLength: 9, maxLength: 9 },
  { code: '+598', name: 'Uruguay', flag: '🇺🇾', minLength: 8, maxLength: 8 },
  { code: '+595', name: 'Paraguay', flag: '🇵🇾', minLength: 9, maxLength: 9 },
  { code: '+591', name: 'Bolivia', flag: '🇧🇴', minLength: 8, maxLength: 8 },
  { code: '+86', name: 'China', flag: '🇨🇳', minLength: 11, maxLength: 11 },
  { code: '+81', name: 'Japan', flag: '🇯🇵', minLength: 10, maxLength: 11 },
  { code: '+82', name: 'South Korea', flag: '🇰🇷', minLength: 10, maxLength: 11 },
  { code: '+91', name: 'India', flag: '🇮🇳', minLength: 10, maxLength: 10 },
  { code: '+7', name: 'Russia', flag: '🇷🇺', minLength: 10, maxLength: 10 },
  { code: '+90', name: 'Turkey', flag: '🇹🇷', minLength: 10, maxLength: 10 },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦', minLength: 9, maxLength: 9 },
  { code: '+971', name: 'UAE', flag: '🇦🇪', minLength: 9, maxLength: 9 },
  { code: '+234', name: 'Nigeria', flag: '🇳🇬', minLength: 10, maxLength: 10 },
  { code: '+27', name: 'South Africa', flag: '🇿🇦', minLength: 9, maxLength: 9 },
  { code: '+212', name: 'Morocco', flag: '🇲🇦', minLength: 9, maxLength: 9 },
  { code: '+216', name: 'Tunisia', flag: '🇹🇳', minLength: 8, maxLength: 8 },
  { code: '+213', name: 'Algeria', flag: '🇩🇿', minLength: 9, maxLength: 9 },
  { code: '+20', name: 'Egypt', flag: '🇪🇬', minLength: 10, maxLength: 11 },
  { code: '+61', name: 'Australia', flag: '🇦🇺', minLength: 9, maxLength: 9 },
  { code: '+64', name: 'New Zealand', flag: '🇳🇿', minLength: 8, maxLength: 9 },
];

// Fonction pour valider un numéro selon son indicatif
export function validatePhoneNumber(countryCode: string, phoneNumber: string): boolean {
  // Nettoyer le numéro de téléphone (enlever espaces, tirets, etc.)
  const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
  
  const country = countries.find(c => c.code === countryCode);
  if (!country) return false;
  
  // Vérifier que le numéro ne contient que des chiffres
  if (!/^\d+$/.test(cleanNumber)) return false;
  
  // Vérifier la longueur
  return cleanNumber.length >= country.minLength && cleanNumber.length <= country.maxLength;
}

// Fonction pour obtenir le message d'erreur
export function getPhoneValidationMessage(countryCode: string, language: 'fr' | 'en' | 'es' = 'fr'): string {
  const country = countries.find(c => c.code === countryCode);
  if (!country) return '';
  
  const messages = {
    fr: `Le numéro doit contenir entre ${country.minLength} et ${country.maxLength} chiffres`,
    en: `Number must contain between ${country.minLength} and ${country.maxLength} digits`,
    es: `El número debe contener entre ${country.minLength} y ${country.maxLength} dígitos`
  };
  
  return messages[language];
}
