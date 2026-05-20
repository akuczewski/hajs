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

export const calculateMonthlyRequired = (fund: SinkingFund) => {
  const targetYear = parseInt(fund.deadline.split('-')[0]) || new Date().getFullYear();
  const targetMonth = parseInt(fund.deadline.split('-')[1]) || new Date().getMonth() + 1;
  const createdYear = parseInt(fund.createdAt.split('-')[0]) || new Date().getFullYear();
  const createdMonth = parseInt(fund.createdAt.split('-')[1]) || new Date().getMonth() + 1;
  const totalMonths = (targetYear - createdYear) * 12 + (targetMonth - createdMonth);
  return fund.targetAmount / Math.max(1, totalMonths);
};

export const getIncomeAmount = (income: Income, month: string) => {
  return income.overrides?.[month] !== undefined ? income.overrides[month] : income.amount;
};

export const getExpenseAmount = (expense: FixedExpense, month: string) => {
  return expense.overrides?.[month] !== undefined ? expense.overrides[month] : expense.amount;
};

export const getLiabilityAmount = (liability: Liability, month: string) => {
  return liability.overrides?.[month] !== undefined ? liability.overrides[month] : liability.monthlyPayment;
};

export const isMaxFutureMonthReached = (activeMonth: string, currentMonth: string, limit: number = 3) => {
  const [activeYear, activeM] = activeMonth.split('-').map(Number);
  const [currentYear, currentM] = currentMonth.split('-').map(Number);
  
  const activeTotalMonths = activeYear * 12 + activeM;
  const currentTotalMonths = currentYear * 12 + currentM;
  
  return (activeTotalMonths - currentTotalMonths) >= limit;
};

export const useBudgetStore = create<AppState>()(
  persist(
    (set, get) => ({
      incomes: [
        { id: '1', name: 'Wypłata UoP', amount: 8000, isFixed: true, history: [], createdAt: new Date().toISOString() }
      ],
      fixedExpenses: [
        { id: '1', name: 'Czynsz', amount: 2500, category: 'Mieszkanie', paymentHistory: [], createdAt: new Date().toISOString() }
      ],
      sinkingFunds: [],
      liabilities: [],
      accounts: [
        { id: '1', name: 'Konto Główne', type: 'BANK', balance: 12500.50, currency: 'PLN', createdAt: new Date().toISOString() },
        { id: '2', name: 'Gotówka', type: 'CASH', balance: 500, currency: 'PLN', createdAt: new Date().toISOString() }
      ],
      currency: 'PLN',
      language: 'en',
      activeMonth: new Date().toISOString().slice(0, 7),

      addIncome: (income) => set((state) => ({ incomes: [...state.incomes, income] })),
      deleteIncome: (id) => set((state) => ({ incomes: state.incomes.filter(i => i.id !== id) })),
      
      addFixedExpense: (expense) => set((state) => ({ fixedExpenses: [...state.fixedExpenses, expense] })),
      deleteFixedExpense: (id) => set((state) => ({ fixedExpenses: state.fixedExpenses.filter(e => e.id !== id) })),
      
      addSinkingFund: (fund) => set((state) => ({ sinkingFunds: [...state.sinkingFunds, fund] })),
      
      addLiability: (liability) => set((state) => ({ liabilities: [...state.liabilities, liability] })),
      deleteLiability: (id) => set((state) => ({ liabilities: state.liabilities.filter(l => l.id !== id) })),
      
      addAccount: (account) => set((state) => ({ accounts: [...state.accounts, account] })),
      deleteAccount: (id) => set((state) => ({ accounts: state.accounts.filter(a => a.id !== id) })),

      setAmountOverride: (type, id, month, amount) => set((state) => {
        const updateOverrides = (overrides: Record<string, number> | undefined) => {
          const newOverrides = { ...overrides };
          if (amount === null) {
            delete newOverrides[month];
          } else {
            newOverrides[month] = amount;
          }
          return newOverrides;
        };

        if (type === 'INCOME') {
          return { incomes: state.incomes.map(i => i.id === id ? { ...i, overrides: updateOverrides(i.overrides) } : i) };
        }
        if (type === 'FIXED_EXPENSE') {
          return { fixedExpenses: state.fixedExpenses.map(e => e.id === id ? { ...e, overrides: updateOverrides(e.overrides) } : e) };
        }
        if (type === 'LIABILITY') {
          return { liabilities: state.liabilities.map(l => l.id === id ? { ...l, overrides: updateOverrides(l.overrides) } : l) };
        }
        return state;
      }),

      setLanguage: (lang) => set(() => ({ language: lang })),
      setActiveMonth: (month) => set(() => ({ activeMonth: month })),
      
      toggleLiabilityPayment: (id, month) => set((state) => ({
        liabilities: state.liabilities.map(lib => {
          if (lib.id === id) {
            const hasPaid = lib.paymentHistory?.includes(month) || false;
            return {
              ...lib,
              paymentHistory: hasPaid ? lib.paymentHistory.filter(m => m !== month) : [...(lib.paymentHistory || []), month],
              paidInstallments: lib.paidInstallments !== undefined ? (hasPaid ? Math.max(0, lib.paidInstallments - 1) : lib.paidInstallments + 1) : undefined
            };
          }
          return lib;
        })
      })),
      
      toggleFixedExpensePayment: (id, month) => set((state) => ({
        fixedExpenses: state.fixedExpenses.map(exp => {
          if (exp.id === id) {
            const hasPaid = exp.paymentHistory?.includes(month) || false;
            return {
              ...exp,
              paymentHistory: hasPaid ? exp.paymentHistory.filter(m => m !== month) : [...(exp.paymentHistory || []), month]
            };
          }
          return exp;
        })
      })),

      toggleSinkingFundPayment: (id, month) => set((state) => ({
        sinkingFunds: state.sinkingFunds.map(fund => {
          if (fund.id === id) {
            const history = fund.paymentHistory || [];
            const isPaid = history.includes(month);
            const newHistory = isPaid
              ? history.filter(m => m !== month)
              : [...history, month];
            
            const monthlyContr = calculateMonthlyRequired(fund); 
            const adjustment = isPaid ? -monthlyContr : monthlyContr;
            
            return { 
              ...fund, 
              paymentHistory: newHistory,
              savedAmount: Math.max(0, fund.savedAmount + adjustment)
            };
          }
          return fund;
        })
      })),

      changeCurrency: (newCurrency) => set((state) => {
        const oldCurrency = state.currency || 'PLN';
        if (oldCurrency === newCurrency) return state;

        const multiplier = EXCHANGE_RATES[oldCurrency] / EXCHANGE_RATES[newCurrency];

        return {
          currency: newCurrency,
          incomes: state.incomes.map(i => ({ ...i, amount: i.amount * multiplier })),
          fixedExpenses: state.fixedExpenses.map(e => ({ ...e, amount: e.amount * multiplier })),
          sinkingFunds: state.sinkingFunds.map(s => ({ ...s, targetAmount: s.targetAmount * multiplier, savedAmount: s.savedAmount * multiplier })),
          liabilities: state.liabilities.map(l => ({ ...l, monthlyPayment: l.monthlyPayment * multiplier, totalRemaining: l.totalRemaining ? l.totalRemaining * multiplier : undefined })),
          accounts: state.accounts.map(a => ({ ...a, balance: a.balance * multiplier }))
        };
      }),

      updateAccount: (id, updates) => set((state) => ({
        accounts: state.accounts.map(a => a.id === id ? { ...a, ...updates } : a)
      })),

      updateSinkingFundBalance: (id, amount) => set((state) => ({
        sinkingFunds: state.sinkingFunds.map(s => s.id === id ? { ...s, savedAmount: s.savedAmount + amount } : s)
      }))
    }),
    {
      name: 'budget-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
