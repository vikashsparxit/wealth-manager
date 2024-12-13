import { Investment, WealthSummary } from "@/types/investment";

const STORAGE_KEY = "investments";

export const investmentService = {
  getAll: (): Investment[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  add: (investment: Omit<Investment, "id">) => {
    const investments = investmentService.getAll();
    const newInvestment = {
      ...investment,
      id: crypto.randomUUID(),
    };
    investments.push(newInvestment);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(investments));
    return newInvestment;
  },

  update: (investment: Investment) => {
    const investments = investmentService.getAll();
    const index = investments.findIndex((i) => i.id === investment.id);
    if (index !== -1) {
      investments[index] = investment;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(investments));
    }
    return investment;
  },

  delete: (id: string) => {
    const investments = investmentService.getAll();
    const filtered = investments.filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  calculateSummary: (investments: Investment[]): WealthSummary => {
    const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
    const currentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const growth = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : 0;

    return {
      totalInvested,
      currentValue,
      growth,
    };
  },
};