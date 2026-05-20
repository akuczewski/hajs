export type AccountType = 'CASH' | 'BANK' | 'DEPOSIT' | 'BONDS' | 'STOCKS' | 'CRYPTO' | 'PRECIOUS_METAL';
export type LiabilityType = 'CREDIT' | 'SUBSCRIPTION';

export interface Income {
  id: string;
  name: string;
  amount: number;
  isFixed: boolean;
  history?: { month: string; amount: number }[]; // Legacy
  overrides?: Record<string, number>; // 'YYYY-MM': amount
  createdAt: string;
}

export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
  paymentHistory?: string[]; // 'YYYY-MM'
  overrides?: Record<string, number>;
  createdAt: string;
}

export interface SinkingFund {
  id: string;
  name: string;
  targetAmount: number;
  deadline: string; // 'YYYY-MM'
  savedAmount: number;
  paymentHistory: string[]; // 'YYYY-MM'
  createdAt: string;
}

export interface Liability {
  id: string;
  name: string;
  type: LiabilityType;
  monthlyPayment: number;
  totalRemaining?: number; // for credits
  totalInstallments?: number;
  paidInstallments?: number;
  paymentHistory: string[]; // 'YYYY-MM'
  overrides?: Record<string, number>;
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

export type Currency = 'PLN' | 'USD' | 'EUR' | 'GBP';
export type Language = 'en' | 'pl';

export interface AppState {
  incomes: Income[];
  fixedExpenses: FixedExpense[];
  sinkingFunds: SinkingFund[];
  liabilities: Liability[];
  accounts: Account[];
  currency: Currency;
  language: Language;
  activeMonth: string;

  addIncome: (income: Income) => void;
  addFixedExpense: (expense: FixedExpense) => void;
  addSinkingFund: (fund: SinkingFund) => void;
  addLiability: (liability: Liability) => void;
  addAccount: (account: Account) => void;
  
  deleteIncome: (id: string) => void;
  deleteFixedExpense: (id: string) => void;
  deleteLiability: (id: string) => void;
  deleteAccount: (id: string) => void;

  toggleLiabilityPayment: (id: string, month: string) => void;
  toggleFixedExpensePayment: (id: string, month: string) => void;
  toggleSinkingFundPayment: (id: string, month: string) => void;
  setAmountOverride: (type: 'INCOME' | 'FIXED_EXPENSE' | 'LIABILITY', id: string, month: string, amount: number | null) => void;
  changeCurrency: (newCurrency: Currency) => void;
  setLanguage: (lang: Language) => void;
  setActiveMonth: (month: string) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  updateSinkingFundBalance: (id: string, amount: number) => void;
}
