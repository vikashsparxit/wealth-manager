export type FamilyMember = "Myself" | "My Wife" | "My Daughter" | "Family";

export type FamilyRelationship = "Primary User" | "Spouse" | "Son" | "Daughter" | "Mother" | "Father";

export type InvestmentType =
  | "Stocks"
  | "Mutual Funds"
  | "PPF"
  | "NPS"
  | "LIC"
  | "ULIP"
  | "Real Estate"
  | "Gold"
  | "Bonds"
  | "Sukanya Samridhi"
  | "Startups";

export type CurrencyType =
  | "INR"
  | "USD"
  | "EUR"
  | "GBP"
  | "JPY"
  | "AUD"
  | "CAD"
  | "CHF"
  | "CNY"
  | "HKD"
  | "NZD"
  | "SGD";

export interface Investment {
  id: string;
  type: InvestmentType;
  owner: FamilyMember;
  investedAmount: number;
  currentValue: number;
  dateOfInvestment: string;
  notes?: string;
}

export interface WealthSummary {
  totalInvested: number;
  currentValue: number;
  growth: number;
}

export interface LiquidAsset {
  id?: string;
  owner: FamilyMember;
  amount: number;
  created_at?: string;
  updated_at?: string;
}