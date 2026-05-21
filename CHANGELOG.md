# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.2] - 2026-05-20

### Fixed
- Re-release of v1.2.1 — no code changes, previous build failed due to Expo API outage.

---

## [1.2.1] - 2026-05-20

### Fixed
- **Cashflow income/expense lists blank despite non-zero totals**: When user data pre-dated the ordering feature, the `incomeOrder` / `expenseOrder` / `liabilityOrder` arrays contained stale seed IDs that didn't match any real item IDs. The ordered-list mapping returned all `undefined`, so `.filter(Boolean)` produced an empty array — items were invisible even though totals computed correctly. Fix: items whose IDs are absent from the order array are now appended at the end of the list instead of being silently dropped. Applies to all three arrays (income, expense, liability).

---

## [1.2.0] - 2026-05-20

### Added
- **Analytics tab** (`app/(tabs)/analytics.tsx`): New dedicated screen with four sections — monthly surplus/cumulative summary cards, Net Worth history chart (last 12 months), Income vs Expenses grouped bar chart (last 12 months with averages), and a 12-month cashflow forecast with cumulative line chart.
- **SVG Charts** (`components/charts/LineChart.tsx`, `components/charts/BarChart.tsx`): Custom React Native SVG charts with cubic-bezier smoothed lines, gradient fills, month axis labels, and tooltip-style value dots. Zero external chart libraries.
- **Net Worth Timeline on Dashboard**: Live sparkline chart on Dashboard showing the last 7 months of net worth history pulled from `netWorthHistory` in the store.
- **Net Worth auto-snapshot**: Account balance changes (add, update, delete, currency switch) now automatically write a `netWorthHistory[YYYY-MM]` snapshot so the charts populate without manual action.
- **Analytics i18n keys** (`analytics.*`): Full EN + PL translations for all analytics screen strings.
- **Cashflow forecast helpers** (`getTrendData`, `getForecastData`, `getMonthRange`): New pure functions exported from `useBudgetStore.ts` that compute historical income/expense trend data and forward-looking cashflow projections.
- **Edit items in Cashflow** (`components/EditItemModal.tsx`): New bottom-sheet modal for fully editing income name/amount/type, expense name/amount/category, and liability name/amount/type without deleting and re-adding.
- **Reorder items in Cashflow**: Up/down chevron buttons on every income, expense, and liability row. Order persisted via `incomeOrder`, `expenseOrder`, `liabilityOrder` arrays in the store.
- **New asset types — Real Estate & Car**: Added `REAL_ESTATE` and `CAR` to `AccountType`. Dashboard and Savings screens display `Home` and `Car` icons respectively.
- **Sinking Fund break-even**: Each goal in the Savings tab now shows whether the user is on track, ahead, or behind — calculated by `getSinkingFundBreakEven()` and rendered under the progress bar.
- **Settings via gear icon**: Removed Settings from the tab bar. A gear icon (⚙) in the top-right of the Dashboard opens the Settings screen via `router.push('/settings')`.
- **Delete Sinking Fund**: Users can now delete savings goals via a trash icon in the Goals tab — previously there was no removal action.
- **Reset App**: Implemented the previously non-functional "Clear all data" button in Settings. Triggers a confirmation Alert and wipes all user data while preserving language and currency preferences.
- **`useMonthNavigation` hook** (`hooks/useMonthNavigation.ts`): Shared hook encapsulating all month navigation logic — `handlePrevMonth`, `handleNextMonth`, `handleToday`, `getMonthName`, and swipe `PanResponder`.
- **CLAUDE.md**: Project-level documentation for AI-assisted development — architecture, data model, colour system, known issues table, coding conventions.

### Fixed
- **English UI broken**: ~20 translation keys present in Polish (`cashflow.*`, `savings.*`, `settings.*`) were entirely missing from the English translations. The `t()` fallback was returning raw key paths (e.g. `cashflow.editAmount`) instead of text. All keys are now present in both languages.
- **Hardcoded Polish strings**: Two strings in Dashboard (`index.tsx`) bypassed the i18n system and were hardcoded in Polish regardless of the selected language — `"Brak rachunków w tym miesiącu!"` and `"Nie dodano jeszcze żadnych aktywów. Przejdź do zakładki Savings."`. Both now use `t()` keys.
- **Savings tab labels not translated**: The ASSETS / GOALS tab buttons in `savings.tsx` were hardcoded strings instead of `t('savings.assetsTab')` / `t('savings.goalsTab')`.
- **Edit Asset modal title**: The edit modal in the Savings screen showed "New Asset" (`savings.newAsset`) as its title. Now shows "Edit Asset" (`savings.editAsset`).
- **New account currency hardcoded**: When adding a new account, `currency` was hardcoded to `'PLN'` regardless of the active store currency. Now uses the current `currency` from the store.
- **Duplicate empty-state in Dashboard checklist**: Two consecutive `checklistItems.length === 0` checks rendered potentially conflicting empty states. Reduced to a single conditional render.
- **Seed data in Polish**: Initial demo data (`"Wypłata UoP"`, `"Czynsz"`, `"Konto Główne"`, `"Gotówka"`) was in Polish, confusing English-language users on first install. Replaced with neutral English names: `Salary`, `Rent`, `Main Account`, `Cash`.
- **Default expense category hardcoded**: When saving a Fixed Expense without a category, the fallback was hardcoded `'Inne'` (Polish). Now uses `t('cashflow.categoryOther')`.

### Removed
- **`Income.history` legacy field**: Removed the deprecated `history?: { month: string; amount: number }[]` field from the `Income` interface and all store seed data. The `overrides` map replaced this pattern in v1.1.0.
- **Dead `calculateMonthly` function**: Removed an unused local function in `savings.tsx` that duplicated (incorrectly) the logic of `calculateMonthlyRequired` from the store.

### Refactored
- `app/(tabs)/index.tsx` — uses `useMonthNavigation` hook; removed ~40 lines of duplicated navigation logic.
- `app/(tabs)/cashflow.tsx` — uses `useMonthNavigation` hook; removed ~40 lines of duplicated navigation logic; removed `history: []` from `addIncome` call.
- `app/(tabs)/savings.tsx` — full i18n pass; added `deleteSinkingFund`; fixed account currency; removed dead code.
- `store/types.ts` — removed `Income.history`; added `deleteSinkingFund` and `resetApp` to `AppState`.
- `store/useBudgetStore.ts` — added `deleteSinkingFund` and `resetApp` actions; neutralised seed data.

## [1.1.0] - 2026-05-20

### Added
- **Time Machine (Unified Timeline)**: You can now change the active month from the Dashboard and Cashflow screens. The timeline is synced globally.
- **Monthly Overrides**: Edit specific income or expense amounts for a single month without affecting the base value in other months.
- **Future Planning Limit**: Restricted forward navigation in the calendar to a maximum of 3 months ahead to keep budgeting focused and realistic.

### Fixed
- **iOS Layout Issue**: Fixed a bug where `ScrollView` content in the Cashflow tab would collapse to 0 height on iOS devices due to `SafeAreaView` interactions.
- **Translations**: Corrected the save button label in the Edit Asset modal from "Save Income" to "Save Asset".

## [1.0.0] - 2024-05-01

### Added
- **Global i18n support**: Fully localized UI in Polish and English with real-time language switching.
- **Dynamic Currency**: Support for PLN, USD, and EUR with automatic net worth conversion using real-time rates.
- **Savings Management**:
    - Manage Assets (Cash, Bank, Crypto, Gold, Bonds, Stocks).
    - Create and track Sinking Funds (Piggy Banks) with progress bars.
    - Added ability to "check off" monthly contributions to goals directly from the dashboard or savings tab.
- **Cashflow Module**: Track fixed incomes, variable incomes (with 5-month average), fixed expenses, and liabilities (credits/installments).
- **Dashboard v1**:
    - Real-time Net Worth calculation.
    - "Pay Yourself First" logic showing safe-to-spend funds.
    - Monthly interactive checklist for all obligations (bills, credits, and savings goals).
- **Settings Screen**: Control language, currency, and data management (Reset App).
- **Premium UI**: Dark mode, glassmorphism-inspired components, and smooth animations.
- **Deployment Ready**: Configured iOS Bundle ID (`com.hajs.app`) and `eas.json` for TestFlight.

### Fixed
- **iOS Rendering**: Replaced problematic Tailwind opacity classes with safe RGBA styles to prevent crashes on physical devices.
- **Navigation**: Fixed tab bar labels to support dynamic translation.
- **Store Persistence**: Resolved issues with state hydration in `AsyncStorage`.

## [0.1.0] - 2024-04-30

### Added
- Initial project setup with Expo Router and TypeScript.
- Core models for Income, Expense, Asset, and Liability.
- Basic navigation structure.
- Initial documentation (User Stories, Backlog).

---
*Created by Antigravity AI*
