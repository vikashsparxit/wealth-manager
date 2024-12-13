export type FamilyMember = "Myself" | "My Wife" | "My Daughter" | "Family";

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