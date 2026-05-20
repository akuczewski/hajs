# CLAUDE.md — Hajs (Personal Finance App)

## Project Overview

React Native / Expo personal finance app. Zero-based budgeting philosophy — every złoty has a job. Target: replace day-to-day budget tracking AND serve as a full Microsoft Money-style personal finance tool.

**Version:** 1.1.0 | **Platform:** iOS primary, Android secondary  
**Bundle ID:** `com.hajs.app` | **EAS ProjectID:** `e990254d-7ef9-4177-82e0-87bf510642c5`

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Expo 54 / React Native 0.81.5 |
| Language | TypeScript 5.9.2 (strict) |
| State | Zustand 5.0.12 + AsyncStorage (persist) |
| Styling | NativeWind 4.2.3 + Tailwind CSS 3.4.19 |
| Routing | Expo Router 6 (file-based, `app/(tabs)/`) |
| Icons | Lucide React Native 1.14.0 |
| Animations | React Native Reanimated 4.1.1 |
| Persistence | AsyncStorage — key: `budget-storage` |
| Build | EAS Build / TestFlight (AppStore ID: 6765533392) |

---

## Project Structure

```
app/
  _layout.tsx          # Root stack navigator
  (tabs)/
    _layout.tsx        # 4 tabs: Dashboard, Cashflow, Savings, Settings
    index.tsx          # Dashboard — Net Worth, Pay Yourself First, Monthly Checklist
    cashflow.tsx       # Incomes (fixed + variable), Fixed Expenses, Liabilities
    savings.tsx        # Assets/Accounts, Sinking Funds (Goals)
    settings.tsx       # Language, Currency, Reset

store/
  types.ts             # All TypeScript interfaces (Income, FixedExpense, SinkingFund, Liability, Account, AppState)
  useBudgetStore.ts    # Zustand store + helper functions exported separately
  i18n.ts              # Translations (en, pl) + useTranslation hook

components/
  EditAmountModal.tsx  # Monthly override editor (amount | null to reset)
  MonthPickerModal.tsx # Grid month/year picker for Sinking Fund deadlines
  ui/                  # icon-symbol, collapsible

constants/
  theme.ts             # Colors, fonts
```

---

## Core Data Model

```typescript
Income        { id, name, amount, isFixed, overrides?: Record<'YYYY-MM', number>, createdAt }
FixedExpense  { id, name, amount, category, paymentHistory?: string[], overrides?, createdAt }
SinkingFund   { id, name, targetAmount, deadline:'YYYY-MM', savedAmount, paymentHistory, createdAt }
Liability     { id, name, type:'CREDIT'|'SUBSCRIPTION', monthlyPayment, totalInstallments?,
                paidInstallments?, paymentHistory, overrides?, createdAt }
Account       { id, name, type: AccountType, balance, currency, createdAt }
```

**AccountType:** `CASH | BANK | DEPOSIT | BONDS | STOCKS | CRYPTO | PRECIOUS_METAL`

**Key computed values (all in `useBudgetStore.ts`):**
- `getIncomeAmount(income, month)` — returns override or base amount
- `getExpenseAmount(expense, month)` — same pattern
- `getLiabilityAmount(liability, month)` — same pattern
- `calculateMonthlyRequired(fund)` — targetAmount / monthsUntilDeadline
- `isMaxFutureMonthReached(active, current, limit=3)` — prevents planning > 3 months ahead

**Formulas:**
- Net Worth = Σ accounts[].balance
- Total Income = Σ getIncomeAmount(i, activeMonth)
- Total Obligations = Σ fixedExpenses + liabilities + sinkingFunds monthly required
- Free Funds = max(0, Total Income − Total Obligations)

---

## i18n System

- File: `store/i18n.ts`
- Languages: `en`, `pl` (switched live, stored in Zustand)
- Hook: `const { t, language } = useTranslation()`
- Usage: `t('dashboard.netWorth')` or `t('settings.changeCurrencyConfirm', { old: 'PLN', new: 'USD' })`
- Fallback: returns the key path string if key not found (silently)

**⚠ Known gap:** EN translation is missing ~20 keys present in PL (all added in v1.1.0 cashflow work). Fix before any EN-facing release.

---

## Monthly Override System

Items (income, fixedExpense, liability) can have per-month overrides:
- `setAmountOverride(type, id, month, amount)` — sets override
- `setAmountOverride(type, id, month, null)` — removes override (resets to default)
- UI: `EditAmountModal` — shows "Reset to Default" only when override exists

---

## Time Machine (Month Navigation)

- `activeMonth: string` in store (format: `'YYYY-MM'`)
- Both Dashboard and Cashflow screens sync to same `activeMonth`
- Navigation: `handlePrevMonth` / `handleNextMonth` / `handleToday` + swipe (PanResponder)
- Limit: max 3 months in the future (`isMaxFutureMonthReached`)
- ⚠ Navigation logic is duplicated in both `index.tsx` and `cashflow.tsx` — candidate for extraction to a shared hook

---

## Currency System

Supported: `PLN | USD | EUR | GBP`  
Exchange rates: **static** in `EXCHANGE_RATES` object in `useBudgetStore.ts` — V2 will fetch from API.  
`changeCurrency(newCurrency)` converts all monetary values in the store using `oldRate / newRate` multiplier.

---

## Known Issues / Tech Debt

| # | Issue | Location | Priority |
|---|---|---|---|
| 1 | EN translation missing ~20 keys | `store/i18n.ts` | High |
| 2 | Hardcoded PL strings in Dashboard | `app/(tabs)/index.tsx:203,262` | High |
| 3 | Month navigation logic duplicated | `index.tsx` + `cashflow.tsx` | Medium |
| 4 | `getMonthName()` duplicated | both tab screens | Medium |
| 5 | `Income.history` legacy field still in types | `store/types.ts:9` | Low |
| 6 | `Account.currency` field unused in calculations | `store/types.ts` | Low |
| 7 | No `deleteSinkingFund` action in store/types | `store/` | Medium |
| 8 | Duplicate empty-state check in Dashboard checklist | `index.tsx:193-204` | Low |
| 9 | Reset App button has no implementation | `settings.tsx` | Medium |
| 10 | Static exchange rates | `useBudgetStore.ts:6-11` | V2 |

---

## V2 Backlog (Documented in `/docs/backlog.md`)

- Live exchange rates from API
- Google Drive / iCloud backup (migrate AsyncStorage → expo-sqlite)
- Push notifications (payment reminders)
- Google OAuth + Gmail integration (auto-detect subscriptions)

---

## Development Commands

```bash
npm start          # Expo dev server
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run lint       # ESLint
```

---

## Coding Conventions

- NativeWind (Tailwind) classes for all styling — no StyleSheet
- Colors: `#34D399` (green/income), `#EAB308` (yellow/spend), `#3B82F6` (blue/assets), `#8B5CF6` (purple/past), `#EF4444` (red/danger)
- Background: `#111315` (root), `#1C1F22` (cards), `#262A2E` (inputs/unpaid)
- All monetary amounts stored in base currency units (floats)
- IDs generated with `Date.now().toString()` at creation time
- Month format always `'YYYY-MM'` (ISO slice)
