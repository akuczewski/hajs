import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Income, FixedExpense, SinkingFund, Liability, Account } from './types';

export const useBudgetStore = create<AppState>()(
  persist(
    (set) => ({
      incomes: [
        // Dummy data for mockup
        { id: '1', name: 'Wypłata UoP', amount: 8000, isFixed: true, history: [], createdAt: new Date().toISOString() }
      ],
      fixedExpenses: [
        // Dummy data for mockup
        { id: '1', name: 'Czynsz', amount: 2500, category: 'Mieszkanie', paymentHistory: [], createdAt: new Date().toISOString() }
      ],
      sinkingFunds: [],
      liabilities: [],
      accounts: [
        { id: '1', name: 'Konto Główne', type: 'BANK', balance: 12500.50, currency: 'PLN', createdAt: new Date().toISOString() },
        { id: '2', name: 'Gotówka', type: 'CASH', balance: 500, currency: 'PLN', createdAt: new Date().toISOString() }
      ],

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
            const hasPaid = lib.paymentHistory.includes(month);
            return {
              ...lib,
              paymentHistory: hasPaid 
                ? lib.paymentHistory.filter(m => m !== month)
                : [...lib.paymentHistory, month]
            };
          }
          return lib;
        })
      })),
      
      toggleFixedExpensePayment: (id, month) => set((state) => ({
        fixedExpenses: state.fixedExpenses.map(exp => {
          if (exp.id === id) {
            const history = exp.paymentHistory || [];
            const hasPaid = history.includes(month);
            return {
              ...exp,
              paymentHistory: hasPaid 
                ? history.filter(m => m !== month)
                : [...history, month]
            };
          }
          return exp;
        })
      })),
    }),
    {
      name: 'budget-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
