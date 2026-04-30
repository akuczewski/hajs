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

      addIncome: (income) => set((state) => ({ incomes: [...state.incomes, income] })),
      addFixedExpense: (expense) => set((state) => ({ fixedExpenses: [...state.fixedExpenses, expense] })),
      addSinkingFund: (fund) => set((state) => ({ sinkingFunds: [...state.sinkingFunds, fund] })),
      addLiability: (liability) => set((state) => ({ liabilities: [...state.liabilities, liability] })),
      addAccount: (account) => set((state) => ({ accounts: [...state.accounts, account] })),
      
      deleteIncome: (id) => set((state) => ({ incomes: state.incomes.filter(i => i.id !== id) })),
      deleteFixedExpense: (id) => set((state) => ({ fixedExpenses: state.fixedExpenses.filter(e => e.id !== id) })),
      deleteLiability: (id) => set((state) => ({ liabilities: state.liabilities.filter(l => l.id !== id) })),
      deleteAccount: (id) => set((state) => ({ accounts: state.accounts.filter(a => a.id !== id) })),
      
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
    }),
    {
      name: 'budget-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
