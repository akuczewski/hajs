import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Income, FixedExpense, SinkingFund, Liability, Account } from './types';

export const EXCHANGE_RATES: Record<string, number> = {
  PLN: 1.0,
  USD: 4.0,
  EUR: 4.3,
  GBP: 5.0
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  PLN: 'zł',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

export const fmtAmount = (value: number): string =>
  value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const calculateMonthlyRequired = (fund: SinkingFund) => {
  const targetYear = parseInt(fund.deadline.split('-')[0]) || new Date().getFullYear();
  const targetMonth = parseInt(fund.deadline.split('-')[1]) || new Date().getMonth() + 1;
  const createdYear = parseInt(fund.createdAt.split('-')[0]) || new Date().getFullYear();
  const createdMonth = parseInt(fund.createdAt.split('-')[1]) || new Date().getMonth() + 1;
  const totalMonths = (targetYear - createdYear) * 12 + (targetMonth - createdMonth);
  return fund.targetAmount / Math.max(1, totalMonths);
};

export const getIncomeAmount = (income: Income, month: string) =>
  income.overrides?.[month] !== undefined ? income.overrides[month] : income.amount;

export const getExpenseAmount = (expense: FixedExpense, month: string) =>
  expense.overrides?.[month] !== undefined ? expense.overrides[month] : expense.amount;

export const getLiabilityAmount = (liability: Liability, month: string) =>
  liability.overrides?.[month] !== undefined ? liability.overrides[month] : liability.monthlyPayment;

export const isMaxFutureMonthReached = (activeMonth: string, currentMonth: string, limit: number = 3) => {
  const [activeYear, activeM] = activeMonth.split('-').map(Number);
  const [currentYear, currentM] = currentMonth.split('-').map(Number);
  return (activeYear * 12 + activeM) - (currentYear * 12 + currentM) >= limit;
};

// Returns array of 'YYYY-MM' strings, from oldest to newest
export const getMonthRange = (fromMonth: string, count: number, direction: 'back' | 'forward' = 'back'): string[] => {
  const [y, m] = fromMonth.split('-').map(Number);
  return Array.from({ length: count }, (_, i) => {
    const offset = direction === 'back' ? -(count - 1 - i) : i + 1;
    const d = new Date(y, m - 1 + offset, 1);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  });
};

// For variable income: return 3-month average if 3+ months of override history exist,
// otherwise fall back to base amount. Used for forecasting only.
export const getVariableIncomeProjection = (income: Income, asOfMonth: string): number => {
  if (income.isFixed || !income.overrides) return income.amount;
  const [y, m] = asOfMonth.split('-').map(Number);
  const pastMonths = Array.from({ length: 3 }, (_, i) => {
    const d = new Date(y, m - 2 - i, 1);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  });
  const values = pastMonths.map(mo => income.overrides![mo]).filter((v): v is number => v !== undefined);
  if (values.length < 3) return income.amount;
  return values.reduce((a, b) => a + b, 0) / values.length;
};

// Income vs Expenses trend for last N months — computed from existing store data
export const getTrendData = (
  incomes: Income[],
  fixedExpenses: FixedExpense[],
  liabilities: Liability[],
  sinkingFunds: SinkingFund[],
  months: string[]
): { month: string; income: number; expenses: number }[] =>
  months.map(month => ({
    month,
    income: incomes.reduce((acc, i) => acc + getIncomeAmount(i, month), 0),
    expenses:
      fixedExpenses.reduce((acc, e) => acc + getExpenseAmount(e, month), 0) +
      liabilities.reduce((acc, l) => acc + getLiabilityAmount(l, month), 0) +
      sinkingFunds.reduce((acc, s) => acc + calculateMonthlyRequired(s), 0),
  }));

// Cashflow forecast for next N months — variable income uses 3-month average if available
export const getForecastData = (
  incomes: Income[],
  fixedExpenses: FixedExpense[],
  liabilities: Liability[],
  sinkingFunds: SinkingFund[],
  months: string[]
): { month: string; surplus: number; cumulative: number }[] => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  let cumulative = 0;
  return months.map(month => {
    const income = incomes.reduce((acc, i) =>
      acc + (i.isFixed ? getIncomeAmount(i, month) : getVariableIncomeProjection(i, currentMonth)), 0);
    const expenses =
      fixedExpenses.reduce((acc, e) => acc + getExpenseAmount(e, month), 0) +
      liabilities.reduce((acc, l) => acc + getLiabilityAmount(l, month), 0) +
      // Stop counting a sinking fund once its deadline has passed
      sinkingFunds.reduce((acc, s) => month <= s.deadline ? acc + calculateMonthlyRequired(s) : acc, 0);
    const surplus = income - expenses;
    cumulative += surplus;
    return { month, surplus, cumulative };
  });
};

export const getSinkingFundBreakEven = (fund: SinkingFund): {
  monthsNeeded: number;
  estimatedDate: string;
  isOnTime: boolean;
  monthsDelta: number;
} => {
  const monthlyRequired = calculateMonthlyRequired(fund);
  const remaining = Math.max(0, fund.targetAmount - fund.savedAmount);
  const monthsNeeded = remaining <= 0 ? 0 : Math.ceil(remaining / Math.max(1, monthlyRequired));
  const now = new Date();
  const est = new Date(now.getFullYear(), now.getMonth() + monthsNeeded, 1);
  const estimatedDate = `${est.getFullYear()}-${(est.getMonth() + 1).toString().padStart(2, '0')}`;
  const [dy, dm] = fund.deadline.split('-').map(Number);
  const [ey, em] = [est.getFullYear(), est.getMonth() + 1];
  const monthsDelta = (dy * 12 + dm) - (ey * 12 + em);
  return { monthsNeeded, estimatedDate, isOnTime: monthsDelta >= 0, monthsDelta };
};

const reorder = (arr: string[], from: number, to: number): string[] => {
  const result = [...arr];
  const [removed] = result.splice(from, 1);
  result.splice(to, 0, removed);
  return result;
};

const _snapshotNetWorth = (get: () => AppState, set: (fn: (s: AppState) => Partial<AppState>) => void) => {
  const month = new Date().toISOString().slice(0, 7);
  const total = get().accounts.reduce((acc, a) => acc + a.balance, 0);
  set(state => ({ netWorthHistory: { ...state.netWorthHistory, [month]: total } }));
};

export const useBudgetStore = create<AppState>()(
  persist(
    (set, get) => ({
      incomes: [
        { id: '1', name: 'Salary', amount: 8000, isFixed: true, createdAt: new Date().toISOString() }
      ],
      fixedExpenses: [
        { id: '1', name: 'Rent', amount: 2500, category: 'Housing', paymentHistory: [], createdAt: new Date().toISOString() }
      ],
      sinkingFunds: [],
      liabilities: [],
      accounts: [
        { id: '1', name: 'Main Account', type: 'BANK', balance: 12500.50, currency: 'PLN', createdAt: new Date().toISOString() },
        { id: '2', name: 'Cash', type: 'CASH', balance: 500, currency: 'PLN', createdAt: new Date().toISOString() }
      ],
      currency: 'PLN',
      language: 'en',
      activeMonth: new Date().toISOString().slice(0, 7),
      netWorthHistory: {},
      incomeOrder: ['1'],
      expenseOrder: ['1'],
      liabilityOrder: [],
      hasCompletedOnboarding: false,
      isPremium: false,

      addIncome: (income) => set((state) => ({
        incomes: [...state.incomes, income],
        incomeOrder: [...state.incomeOrder, income.id],
      })),
      deleteIncome: (id) => set((state) => ({
        incomes: state.incomes.filter(i => i.id !== id),
        incomeOrder: state.incomeOrder.filter(oid => oid !== id),
      })),
      updateIncome: (id, updates) => set((state) => ({
        incomes: state.incomes.map(i => i.id === id ? { ...i, ...updates } : i),
      })),

      addFixedExpense: (expense) => set((state) => ({
        fixedExpenses: [...state.fixedExpenses, expense],
        expenseOrder: [...state.expenseOrder, expense.id],
      })),
      deleteFixedExpense: (id) => set((state) => ({
        fixedExpenses: state.fixedExpenses.filter(e => e.id !== id),
        expenseOrder: state.expenseOrder.filter(oid => oid !== id),
      })),
      updateFixedExpense: (id, updates) => set((state) => ({
        fixedExpenses: state.fixedExpenses.map(e => e.id === id ? { ...e, ...updates } : e),
      })),

      addSinkingFund: (fund) => set((state) => ({ sinkingFunds: [...state.sinkingFunds, fund] })),
      deleteSinkingFund: (id) => set((state) => ({ sinkingFunds: state.sinkingFunds.filter(s => s.id !== id) })),
      updateSinkingFund: (id, updates) => set((state) => ({
        sinkingFunds: state.sinkingFunds.map(s => s.id === id ? { ...s, ...updates } : s),
      })),

      addLiability: (liability) => set((state) => ({
        liabilities: [...state.liabilities, liability],
        liabilityOrder: [...state.liabilityOrder, liability.id],
      })),
      deleteLiability: (id) => set((state) => ({
        liabilities: state.liabilities.filter(l => l.id !== id),
        liabilityOrder: state.liabilityOrder.filter(oid => oid !== id),
      })),
      updateLiability: (id, updates) => set((state) => ({
        liabilities: state.liabilities.map(l => l.id === id ? { ...l, ...updates } : l),
      })),

      addAccount: (account) => {
        set((state) => ({ accounts: [...state.accounts, account] }));
        _snapshotNetWorth(get, set);
      },
      deleteAccount: (id) => {
        set((state) => ({ accounts: state.accounts.filter(a => a.id !== id) }));
        _snapshotNetWorth(get, set);
      },
      updateAccount: (id, updates) => {
        set((state) => ({ accounts: state.accounts.map(a => a.id === id ? { ...a, ...updates } : a) }));
        _snapshotNetWorth(get, set);
      },

      reorderIncome: (from, to) => set((state) => ({ incomeOrder: reorder(state.incomeOrder, from, to) })),
      reorderExpense: (from, to) => set((state) => ({ expenseOrder: reorder(state.expenseOrder, from, to) })),
      reorderLiability: (from, to) => set((state) => ({ liabilityOrder: reorder(state.liabilityOrder, from, to) })),

      setAmountOverride: (type, id, month, amount) => set((state) => {
        const updateOverrides = (overrides: Record<string, number> | undefined) => {
          const next = { ...overrides };
          if (amount === null) delete next[month];
          else next[month] = amount;
          return next;
        };
        if (type === 'INCOME')
          return { incomes: state.incomes.map(i => i.id === id ? { ...i, overrides: updateOverrides(i.overrides) } : i) };
        if (type === 'FIXED_EXPENSE')
          return { fixedExpenses: state.fixedExpenses.map(e => e.id === id ? { ...e, overrides: updateOverrides(e.overrides) } : e) };
        if (type === 'LIABILITY')
          return { liabilities: state.liabilities.map(l => l.id === id ? { ...l, overrides: updateOverrides(l.overrides) } : l) };
        return state;
      }),

      setLanguage: (lang) => set(() => ({ language: lang })),
      setActiveMonth: (month) => set(() => ({ activeMonth: month })),

      toggleLiabilityPayment: (id, month) => set((state) => ({
        liabilities: state.liabilities.map(lib => {
          if (lib.id !== id) return lib;
          const hasPaid = lib.paymentHistory?.includes(month) || false;
          return {
            ...lib,
            paymentHistory: hasPaid ? lib.paymentHistory.filter(m => m !== month) : [...(lib.paymentHistory || []), month],
            paidInstallments: lib.paidInstallments !== undefined
              ? (hasPaid ? Math.max(0, lib.paidInstallments - 1) : lib.paidInstallments + 1)
              : undefined
          };
        })
      })),

      toggleFixedExpensePayment: (id, month) => set((state) => ({
        fixedExpenses: state.fixedExpenses.map(exp => {
          if (exp.id !== id) return exp;
          const hasPaid = exp.paymentHistory?.includes(month) || false;
          return { ...exp, paymentHistory: hasPaid ? exp.paymentHistory.filter(m => m !== month) : [...(exp.paymentHistory || []), month] };
        })
      })),

      toggleSinkingFundPayment: (id, month) => set((state) => ({
        sinkingFunds: state.sinkingFunds.map(fund => {
          if (fund.id !== id) return fund;
          const history = fund.paymentHistory || [];
          const isPaid = history.includes(month);
          const monthlyContr = calculateMonthlyRequired(fund);
          return {
            ...fund,
            paymentHistory: isPaid ? history.filter(m => m !== month) : [...history, month],
            savedAmount: Math.max(0, fund.savedAmount + (isPaid ? -monthlyContr : monthlyContr)),
          };
        })
      })),

      changeCurrency: (newCurrency) => {
        set((state) => {
          const oldCurrency = state.currency || 'PLN';
          if (oldCurrency === newCurrency) return state;
          const m = EXCHANGE_RATES[oldCurrency] / EXCHANGE_RATES[newCurrency];
          return {
            currency: newCurrency,
            incomes: state.incomes.map(i => ({ ...i, amount: i.amount * m })),
            fixedExpenses: state.fixedExpenses.map(e => ({ ...e, amount: e.amount * m })),
            sinkingFunds: state.sinkingFunds.map(s => ({ ...s, targetAmount: s.targetAmount * m, savedAmount: s.savedAmount * m })),
            liabilities: state.liabilities.map(l => ({ ...l, monthlyPayment: l.monthlyPayment * m, totalRemaining: l.totalRemaining ? l.totalRemaining * m : undefined })),
            accounts: state.accounts.map(a => ({ ...a, balance: a.balance * m })),
          };
        });
        _snapshotNetWorth(get, set);
      },

      updateSinkingFundBalance: (id, amount) => set((state) => ({
        sinkingFunds: state.sinkingFunds.map(s => s.id === id ? { ...s, savedAmount: s.savedAmount + amount } : s)
      })),

      recordNetWorthSnapshot: () => _snapshotNetWorth(get, set),

      completeOnboarding: () => set(() => ({ hasCompletedOnboarding: true })),
      setIsPremium: (value) => set(() => ({ isPremium: value })),

      resetApp: () => set(() => ({
        incomes: [],
        fixedExpenses: [],
        sinkingFunds: [],
        liabilities: [],
        accounts: [],
        netWorthHistory: {},
        incomeOrder: [],
        expenseOrder: [],
        liabilityOrder: [],
        activeMonth: new Date().toISOString().slice(0, 7),
      })),
    }),
    {
      name: 'budget-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
