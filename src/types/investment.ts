export type FamilyMember = "Myself" | "My Wife" | "My Daughter";

export type FamilyRelationship = "Primary User" | "Spouse" | "Son" | "Daughter" | "Mother" | "Father";

export type InvestmentType =
  | "Physical Gold"
  | "Digital Gold"
  | "Sovereign Gold Bonds (SGB)"
  | "Silver"
  | "Stocks"
  | "US Stocks"
  | "Pre-IPO Investments"
  | "Startup Equity"
  | "ETFs"
  | "Mutual Funds"
  | "PPF"
  | "EPF"
  | "NPS"
  | "Fixed Deposite"
  | "Govt Bonds"
  | "Corporate Bonds"
  | "Treasury Bills"
  | "Tax-Free Bonds"
  | "Sukanya Samriddhi Yojana (SSY)"
  | "Debentures"
  | "LIC"
  | "ULIP"
  | "Residential Property"
  | "Commercial Property"
  | "REITs"
  | "Land"
  | "Cryptocurrency"
  | "NFT"
  | "Recurring Deposits";

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