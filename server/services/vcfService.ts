import { Contact } from "@shared/schema";

class VCFService {
  generateVCF(contacts: Contact[]): string {
    let vcfContent = '';
    
    contacts.forEach(contact => {
      const nameWithSuffix = `${contact.fullName} BOOST.1🚀🔥🇭🇹`;
      const fullNumber = `${contact.countryCode}${contact.whatsappNumber}`;
      
      vcfContent += 'BEGIN:VCARD\n';
      vcfContent += 'VERSION:3.0\n';
      vcfContent += `FN:${nameWithSuffix}\n`;
      vcfContent += `N:${nameWithSuffix};;;;\n`;
      vcfContent += `TEL;TYPE=CELL:${fullNumber}\n`;
      
      if (contact.email) {
        vcfContent += `EMAIL:${contact.email}\n`;
      }
      
      vcfContent += 'END:VCARD\n';
    });
    
    return vcfContent;
  }

  generateCSV(contacts: Contact[]): string {
    const headers = ['Nom Complet', 'Numéro WhatsApp', 'Code Pays', 'Email', 'Date d\'inscription'];
    let csvContent = headers.join(',') + '\n';
    
    contacts.forEach(contact => {
      const nameWithSuffix = `${contact.fullName} BOOST.1🚀🔥🇭🇹`;
      const fullNumber = `${contact.countryCode}${contact.whatsappNumber}`;
      const row = [
        `"${nameWithSuffix}"`,
        `"${fullNumber}"`,
        `"${contact.countryCode}"`,
        `"${contact.email || ''}"`,
        `"${contact.createdAt.toISOString().split('T')[0]}"`
      ];
      csvContent += row.join(',') + '\n';
    });
    
    return csvContent;
  }
}

export const vcfService = new VCFService();
