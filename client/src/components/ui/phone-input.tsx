import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { COUNTRIES } from "@/lib/constants";

interface PhoneInputProps {
  countryCode: string;
  phoneNumber: string;
  onCountryChange: (code: string) => void;
  onPhoneChange: (phone: string) => void;
  error?: string;
}

export function PhoneInput({
  countryCode,
  phoneNumber,
  onCountryChange,
  onPhoneChange,
  error
}: PhoneInputProps) {
  const selectedCountry = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];

  return (
    <div className="space-y-2">
      <div className="flex">
        <Select value={countryCode} onValueChange={onCountryChange}>
          <SelectTrigger className="w-32 rounded-r-none border-r-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map(country => (
              <SelectItem key={country.id} value={country.code}>
                {country.flag} {country.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="tel"
          placeholder={`Ex: ${"1".repeat(selectedCountry.digits)}`}
          value={phoneNumber}
          onChange={(e) => onPhoneChange(e.target.value)}
          className="flex-1 rounded-l-none border-l-0"
          maxLength={selectedCountry.digits}
        />
      </div>
      <div className="text-xs text-muted-foreground">
        Format: {selectedCountry.digits} chiffres pour {selectedCountry.name}
      </div>
      {error && (
        <div className="text-xs text-destructive">{error}</div>
      )}
    </div>
  );
}
