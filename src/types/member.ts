export interface BaseMember {
  id: string;
  name: string;
  status: string;
}

export interface MemberWithInvestments extends BaseMember {
  investment_count?: number;
}