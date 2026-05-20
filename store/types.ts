export type AccountType = 'CASH' | 'BANK' | 'DEPOSIT' | 'BONDS' | 'STOCKS' | 'CRYPTO' | 'PRECIOUS_METAL' | 'REAL_ESTATE' | 'CAR';
export type LiabilityType = 'CREDIT' | 'SUBSCRIPTION';

export interface Income {
  id: string;
  name: string;
  amount: number;
  isFixed: boolean;
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
  totalRemaining?: number;
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
  netWorthHistory: Record<string, number>; // 'YYYY-MM' -> net worth value
  incomeOrder: string[];
  expenseOrder: string[];
  liabilityOrder: string[];

  // CRUD
  addIncome: (income: Income) => void;
  addFixedExpense: (expense: FixedExpense) => void;
  addSinkingFund: (fund: SinkingFund) => void;
  addLiability: (liability: Liability) => void;
  addAccount: (account: Account) => void;

  deleteIncome: (id: string) => void;
  deleteFixedExpense: (id: string) => void;
  deleteSinkingFund: (id: string) => void;
  deleteLiability: (id: string) => void;
  deleteAccount: (id: string) => void;

  updateIncome: (id: string, updates: Partial<Omit<Income, 'id' | 'createdAt'>>) => void;
  updateFixedExpense: (id: string, updates: Partial<Omit<FixedExpense, 'id' | 'createdAt'>>) => void;
  updateLiability: (id: string, updates: Partial<Omit<Liability, 'id' | 'createdAt'>>) => void;

  // Reorder
  reorderIncome: (fromIndex: number, toIndex: number) => void;
  reorderExpense: (fromIndex: number, toIndex: number) => void;
  reorderLiability: (fromIndex: number, toIndex: number) => void;

  // Payments & overrides
  toggleLiabilityPayment: (id: string, month: string) => void;
  toggleFixedExpensePayment: (id: string, month: string) => void;
  toggleSinkingFundPayment: (id: string, month: string) => void;
  setAmountOverride: (type: 'INCOME' | 'FIXED_EXPENSE' | 'LIABILITY', id: string, month: string, amount: number | null) => void;

  // Settings
  changeCurrency: (newCurrency: Currency) => void;
  setLanguage: (lang: Language) => void;
  setActiveMonth: (month: string) => void;

  // Accounts
  updateAccount: (id: string, updates: Partial<Account>) => void;
  updateSinkingFundBalance: (id: string, amount: number) => void;

  // Analytics
  recordNetWorthSnapshot: () => void;

  resetApp: () => void;
}
