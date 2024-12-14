export type FamilyMember = "Myself" | "My Wife" | "My Daughter";

export type InvestmentType =
  | "Real Estate"
  | "Gold"
  | "Bonds"
  | "LIC"
  | "ULIP"
  | "Sukanya Samridhi"
  | "Mutual Funds"
  | "Stocks"
  | "NPS"
  | "PPF"
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
