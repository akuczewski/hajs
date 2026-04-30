export type AccountType = 'BANK' | 'CASH' | 'VIRTUAL' | 'CRYPTO' | 'PRECIOUS_METAL';
export type LiabilityType = 'CREDIT' | 'SUBSCRIPTION';

export interface Income {
  id: string;
  name: string;
  amount: number;
  isFixed: boolean;
  history: { month: string; amount: number }[]; // 'YYYY-MM'
  createdAt: string;
}

export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
  createdAt: string;
}

export interface SinkingFund {
  id: string;
  name: string;
  targetAmount: number;
  deadline: string; // 'YYYY-MM'
  savedAmount: number;
  createdAt: string;
}

export interface Liability {
  id: string;
  name: string;
  type: LiabilityType;
  monthlyPayment: number;
  totalRemaining?: number; // for credits
  paymentHistory: string[]; // 'YYYY-MM'
  createdAt: string;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  createdAt: string;
}

export interface AppState {
  incomes: Income[];
  fixedExpenses: FixedExpense[];
  sinkingFunds: SinkingFund[];
  liabilities: Liability[];
  accounts: Account[];

  addIncome: (income: Income) => void;
  addFixedExpense: (expense: FixedExpense) => void;
  addSinkingFund: (fund: SinkingFund) => void;
  addLiability: (liability: Liability) => void;
  addAccount: (account: Account) => void;
  toggleLiabilityPayment: (id: string, month: string) => void;
}
