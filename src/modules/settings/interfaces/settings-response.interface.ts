export interface SettingsResponse {
  cafeName: string;
  logo: string | null;
  openingTime: string;
  closingTime: string;
  taxPercent: number;
  servicePercent: number;
  updatedAt: Date;
}
