import { useBudgetStore } from './useBudgetStore';
import { Language } from './types';

type Translations = {
  [key in Language]: {
    [key: string]: any;
  };
};

export const translations: Translations = {
  en: {
    months: {
      jan: "January",
      feb: "February",
      mar: "March",
      apr: "April",
      may: "May",
      jun: "June",
      jul: "July",
      aug: "August",
      sep: "September",
      oct: "October",
      nov: "November",
      dec: "December"
    },
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
      noAssetsYet: "No assets added yet. Go to the Savings tab.",
      currentMonth: "Current Month",
      archive: "Archive",
      pastMonth: "Past",
      futureMonth: "Future",
      backToToday: "Back to today"
    },
    cashflow: {
      incomesTab: "INCOMES",
      expensesTab: "EXPENSES",
      isOneTime: "One-time income",
      isFixedIncome: "Fixed income",
      addIncome: "Add Income Source",
      addFixedExpense: "Add Fixed Expense",
      addLiability: "Add Credit / Installments",
      totalMonthlyIncome: "Total Monthly Income",
      monthlyIncomes: "Incomes (Monthly)",
      fixedIncome: "Fixed Income",
      noFixedIncomes: "No fixed income sources.",
      variableIncome: "Variable Income",
      noVariableIncomes: "No variable income sources.",
      last5Months: "Last 5 months",
      fixedExpenses: "Fixed Expenses (Monthly)",
      totalMonthlyExpenses: "Total Monthly Expenses",
      liabilities: "Credits & Installments (Monthly)",
      addExpense: "Add expense / subscription",
      fixed: "Fixed",
      subscription: "Subscription",
      credit: "Credit",
      installmentsInfo: "Number of installments/months (not amount):",
      totalMonths: "Total installments",
      monthsPaid: "Already paid",
      subsAndCredits: "Subscriptions & Credits",
      paidThisMonth: "Paid this month",
      noSubs: "No subscriptions.",
      monthlyFee: "Monthly fee",
      noFixedExpenses: "No fixed expenses.",
      editAmount: "Edit Amount",
      saveAmount: "Save override",
      resetToDefault: "Reset to default",
      calculatedAverage: "Calculated Average",
      paid: "PAID",
      of: "of",
      paidInstallments: "Paid",
      newIncome: "New Income Source",
      incomeName: "Income Name (e.g., Salary)",
      amount: "Amount",
      saveIncome: "Save Income",
      newExpense: "New Expense",
      expenseName: "Expense Name (e.g., Rent, Netflix)",
      monthlyAmount: "Monthly Amount",
      category: "Category",
      categoryOther: "Other",
      saveExpense: "Save Expense",
      newLiability: "New Credit / Installments",
      liabilityName: "Liability Name (e.g., Car Loan)",
      monthlyInstallment: "Monthly Installment",
      totalInstallments: "Total Installments",
      alreadyPaidInstallments: "Already Paid Installments",
      saveLiability: "Save Liability"
    },
    savings: {
      title: "Savings & Assets",
      assetsTab: "ASSETS",
      goalsTab: "GOALS",
      totalNetWorth: "Total Net Worth",
      addAsset: "Add New Asset / Account",
      newAsset: "New Asset",
      editAsset: "Edit Asset",
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
      monthlyToSave: "Monthly to save",
      selectDeadline: "Select Deadline"
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
      convert: "Convert",
      resetAppConfirm: "Are you sure? This will permanently delete all your data — accounts, incomes, expenses, goals and payment history.",
      delete: "Delete everything"
    }
  },
  pl: {
    months: {
      jan: "Styczeń",
      feb: "Luty",
      mar: "Marzec",
      apr: "Kwiecień",
      may: "Maj",
      jun: "Czerwiec",
      jul: "Lipiec",
      aug: "Sierpień",
      sep: "Wrzesień",
      oct: "Październik",
      nov: "Listopad",
      dec: "Grudzień"
    },
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
      noAssetsYet: "Nie dodano jeszcze żadnych aktywów. Przejdź do zakładki Oszczędności.",
      currentMonth: "Bieżący",
      archive: "Historia",
      pastMonth: "Ubiegły",
      futureMonth: "Przyszły",
      backToToday: "Wróć do dzisiaj"
    },
    cashflow: {
      incomesTab: "PRZYCHODY",
      expensesTab: "WYDATKI",
      isOneTime: "Jednorazowy przychód",
      isFixedIncome: "Stały przychód",
      addIncome: "Dodaj źródło przychodu",
      addFixedExpense: "Dodaj stały wydatek",
      addLiability: "Dodaj kredyt / raty",
      totalMonthlyIncome: "Całkowity Przychód",
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
      saveLiability: "Zapisz Zobowiązanie",
      fixedIncome: "Przychody Stałe",
      noFixedIncomes: "Brak stałych przychodów.",
      variableIncome: "Przychody Zmienne",
      noVariableIncomes: "Brak zmiennych przychodów.",
      last5Months: "Ostatnie 5 miesięcy",
      totalMonthlyExpenses: "Całkowite Wydatki",
      addExpense: "Dodaj wydatek / subskrypcję",
      fixed: "Stały",
      subscription: "Subskrypcja",
      credit: "Kredyt",
      installmentsInfo: "Ilość rat/miesięcy (nie kwota):",
      totalMonths: "Ilość rat",
      monthsPaid: "Rat spłaconych",
      subsAndCredits: "Subskrypcje i Kredyty",
      paidThisMonth: "Opłacone w tym miesiącu",
      noSubs: "Brak subskrypcji.",
      monthlyFee: "Opłata miesięczna",
      noFixedExpenses: "Brak stałych wydatków.",
      editAmount: "Edytuj Kwotę",
      saveAmount: "Zapisz nadpisanie",
      resetToDefault: "Przywróć domyślną",
      categoryOther: "Inne"
    },
    savings: {
      title: "Oszczędności i Aktywa",
      assetsTab: "AKTYWA",
      goalsTab: "CELE",
      totalNetWorth: "Całkowita Wartość Majątku",
      addAsset: "Dodaj nowe Aktywo / Konto",
      newAsset: "Nowe Aktywo",
      editAsset: "Edytuj Aktywo",
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
      monthlyToSave: "Odkładaj miesięcznie",
      selectDeadline: "Wybierz datę"
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
      convert: "Przelicz",
      resetAppConfirm: "Czy na pewno? Ta operacja trwale usunie wszystkie dane — konta, przychody, wydatki, cele i historię płatności.",
      delete: "Usuń wszystko"
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
