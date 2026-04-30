import { useBudgetStore } from './useBudgetStore';
import { Language } from './types';

type Translations = {
  [key in Language]: {
    [key: string]: any;
  };
};

export const translations: Translations = {
  en: {
    tabs: {
      dashboard: "Dashboard",
      cashflow: "Cashflow",
      savings: "Savings",
      settings: "Settings"
    },
    dashboard: {
      netWorth: "Your Total Net Worth",
      payYourselfFirst: "Pay Yourself First 👑",
      payYourselfDesc: "After paying all fixed bills, this is the amount left that you can safely transfer to your Sinking Funds.",
      freeFunds: "Free Funds:",
      toPayThisMonth: "To pay this month",
      markAsPaid: "Mark items once paid.",
      noBills: "No bills to pay this month!",
      yourAssets: "Your Assets",
      more: "More",
      noAssetsYet: "No assets added yet. Go to the Savings tab."
    },
    cashflow: {
      incomesTab: "INCOMES",
      expensesTab: "EXPENSES",
      addIncome: "Add Income Source",
      addFixedExpense: "Add Fixed Expense",
      addLiability: "Add Credit / Installments",
      monthlyIncomes: "Incomes (Monthly)",
      fixedExpenses: "Fixed Expenses (Monthly)",
      liabilities: "Credits & Installments (Monthly)",
      calculatedAverage: "Calculated Average",
      paid: "PAID",
      of: "of",
      paidInstallments: "Paid",
      newIncome: "New Income Source",
      incomeName: "Income Name (e.g., Salary)",
      amount: "Amount",
      saveIncome: "Save Income",
      newExpense: "New Fixed Expense",
      expenseName: "Expense Name (e.g., Rent, Netflix)",
      monthlyAmount: "Monthly Amount",
      category: "Category",
      saveExpense: "Save Expense",
      newLiability: "New Credit / Installments",
      liabilityName: "Liability Name (e.g., Car Loan)",
      monthlyInstallment: "Monthly Installment",
      totalInstallments: "Total Installments",
      alreadyPaidInstallments: "Already Paid Installments",
      saveLiability: "Save Liability"
    },
    savings: {
      assetsTab: "ASSETS",
      goalsTab: "GOALS",
      totalNetWorth: "Total Net Worth",
      addAsset: "Add New Asset / Account",
      newAsset: "New Asset",
      assetName: "Name (e.g., mBank, BTC Wallet, 5% Deposit)",
      currentValue: "Current Value",
      saveAsset: "Save Asset",
      yourAssets: "Your Assets",
      noAssets: "No assets added.",
      totalSavingsGoals: "Total Savings Goals",
      goal: "Goal",
      addGoal: "Create New Goal (Sinking Fund)",
      newGoal: "New Goal",
      goalName: "Goal Name (e.g., Car Insurance, Holidays)",
      targetAmount: "Target Amount",
      deadline: "Deadline (e.g. 2024-12)",
      saveGoal: "Save Goal",
      noGoals: "No yearly goals. Click + to add a new piggy bank.",
      inProgress: "In progress",
      of: "of",
      monthlyToSave: "Monthly to save"
    },
    settings: {
      settings: "Settings",
      currencyRegion: "Currency & Region",
      currencyDesc: "Choose the main currency for your budget. Changing the currency will automatically convert your entire net worth.",
      language: "Language",
      languageDesc: "Choose your preferred language for the application.",
      dangerZone: "Danger Zone",
      dangerDesc: "Deleting data will result in irreversible loss of transaction history and all accounts.",
      resetApp: "Clear all data (Reset)",
      changeCurrency: "Change currency",
      changeCurrencyConfirm: "Are you sure you want to change the currency from {old} to {new}? All your funds will be converted according to the exchange rate.",
      cancel: "Cancel",
      convert: "Convert"
    }
  },
  pl: {
    tabs: {
      dashboard: "Pulpit",
      cashflow: "Przepływy",
      savings: "Oszczędności",
      settings: "Ustawienia"
    },
    dashboard: {
      netWorth: "Twoje Całkowite Net Worth",
      payYourselfFirst: "Zapłać sobie najpierw 👑",
      payYourselfDesc: "Po opłaceniu wszystkich stałych rachunków, do dyspozycji pozostaje Ci kwota, którą możesz przelać na Sinking Funds.",
      freeFunds: "Wolne środki:",
      toPayThisMonth: "Do opłacenia w tym miesiącu",
      markAsPaid: "Zaznacz opłacone pozycje.",
      noBills: "Brak rachunków w tym miesiącu!",
      yourAssets: "Twoje Aktywa",
      more: "Więcej",
      noAssetsYet: "Nie dodano jeszcze żadnych aktywów. Przejdź do zakładki Oszczędności."
    },
    cashflow: {
      incomesTab: "PRZYCHODY",
      expensesTab: "WYDATKI",
      addIncome: "Dodaj źródło przychodu",
      addFixedExpense: "Dodaj stały wydatek",
      addLiability: "Dodaj kredyt / raty",
      monthlyIncomes: "Przychody (Miesięcznie)",
      fixedExpenses: "Wydatki stałe (Miesięcznie)",
      liabilities: "Kredyty i Raty (Miesięcznie)",
      calculatedAverage: "Obliczona średnia",
      paid: "OPŁACONE",
      of: "z",
      paidInstallments: "Spłacono",
      newIncome: "Nowe Źródło Przychodu",
      incomeName: "Nazwa (np. Wypłata)",
      amount: "Kwota",
      saveIncome: "Zapisz Przychód",
      newExpense: "Nowy Wydatek Stały",
      expenseName: "Nazwa (np. Czynsz, Netflix)",
      monthlyAmount: "Kwota Miesięczna",
      category: "Kategoria",
      saveExpense: "Zapisz Wydatek",
      newLiability: "Nowy Kredyt / Raty",
      liabilityName: "Nazwa (np. Rata za Auto)",
      monthlyInstallment: "Rata miesięczna",
      totalInstallments: "Ilość rat łącznie",
      alreadyPaidInstallments: "Ilość opłaconych rat",
      saveLiability: "Zapisz Zobowiązanie"
    },
    savings: {
      assetsTab: "AKTYWA",
      goalsTab: "CELE",
      totalNetWorth: "Całkowita Wartość Majątku",
      addAsset: "Dodaj nowe Aktywo / Konto",
      newAsset: "Nowe Aktywo",
      assetName: "Nazwa (np. mBank, Portfel BTC, Lokata)",
      currentValue: "Aktualna wartość",
      saveAsset: "Zapisz Aktywo",
      yourAssets: "Twoje Aktywa",
      noAssets: "Brak dodanych aktywów.",
      totalSavingsGoals: "Suma Celów",
      goal: "Cel",
      addGoal: "Utwórz nowy Cel (Skarbonka)",
      newGoal: "Nowy Cel",
      goalName: "Nazwa Celu (np. Wakacje, Ubezpieczenie)",
      targetAmount: "Kwota Docelowa",
      deadline: "Data końcowa (np. 2024-12)",
      saveGoal: "Zapisz Cel",
      noGoals: "Brak celów rocznych. Kliknij + aby dodać nową skarbonkę.",
      inProgress: "W trakcie",
      of: "z",
      monthlyToSave: "Odkładaj miesięcznie"
    },
    settings: {
      settings: "Ustawienia",
      currencyRegion: "Waluta i Region",
      currencyDesc: "Wybierz główną walutę, w której chcesz prowadzić budżet. Zmiana waluty spowoduje automatyczne przeliczenie całego majątku.",
      language: "Język (Language)",
      languageDesc: "Wybierz preferowany język aplikacji.",
      dangerZone: "Niebezpieczna Strefa",
      dangerDesc: "Usunięcie danych spowoduje nieodwracalną utratę historii transakcji i wszystkich kont.",
      resetApp: "Wyczyść wszystkie dane (Reset)",
      changeCurrency: "Zmień walutę",
      changeCurrencyConfirm: "Czy na pewno chcesz zmienić walutę z {old} na {new}? Wszystkie Twoje środki zostaną przeliczone po kursie.",
      cancel: "Anuluj",
      convert: "Przelicz"
    }
  }
};

export const useTranslation = () => {
  const language = useBudgetStore((state) => state.language || 'en');

  const t = (path: string, params?: Record<string, string>): string => {
    const keys = path.split('.');
    let result = translations[language];

    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        return path; // Fallback to path if not found
      }
    }

    let text = result as unknown as string;
    
    // Replace params like {old} or {new}
    if (params && typeof text === 'string') {
      Object.keys(params).forEach(key => {
        text = text.replace(`{${key}}`, params[key]);
      });
    }

    return text;
  };

  return { t, language };
};
