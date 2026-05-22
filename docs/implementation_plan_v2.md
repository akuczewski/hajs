# Plan implementacji V2

> Branch roboczy: `monetization`  
> Ostatnia aktualizacja: 2026-05-22  
> Powiązane dokumenty: [roadmap_v2.md](roadmap_v2.md) | [backlog.md](backlog.md)

---

## Status Fazy 1 — ZAIMPLEMENTOWANE ✅

| Element | Status | Commit |
|---|---|---|
| `updateSinkingFund` + edit UI w savings | ✅ Done | `583e8c3` |
| `hasCompletedOnboarding` + `isPremium` w store | ✅ Done | `583e8c3` |
| `react-native-purchases` zainstalowany | ✅ Done | `583e8c3` |
| `constants/revenueCat.ts` (klucze, product IDs) | ✅ Done | `dd36478` |
| `store/useSubscriptionStore.ts` | ✅ Done | `583e8c3` |
| `app/onboarding.tsx` (4 slajdy) | ✅ Done | `583e8c3` |
| `app/paywall.tsx` (monthly/yearly/lifetime) | ✅ Done | `dd36478` |
| OnboardingGuard w `_layout.tsx` | ✅ Done | `583e8c3` |
| Guard dla istniejących userów (auto-complete) | ✅ Done | `HEAD` |
| Sekcja Premium w `settings.tsx` | ✅ Done | `583e8c3` |
| i18n klucze EN + PL (onboarding, paywall) | ✅ Done | `583e8c3` |

## Manualne kroki przed buildem produkcyjnym

### 🔴 Wymagane (bez tego zakupy nie działają)

1. **App Store Connect — produkty IAP**
   - Zaloguj do [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
   - Twoja apka → In-App Purchases → "+"
   - Utwórz: `monthly` (Auto-Renewable, ~11 PLN), `yearly` (Auto-Renewable, ~99 PLN), `lifetime` (Non-Consumable, ~199 PLN)
   - Każdy produkt wymaga: nazwa, opis, zrzut ekranu do review, cena

2. **RevenueCat ↔ App Store Connect API**
   - RevenueCat dashboard → Project Settings → App Store Connect API
   - Wgraj klucz API z App Store Connect (Users & Access → Keys → App Store Connect API)
   - Bez tego RevenueCat nie może walidować zakupów

3. **RevenueCat — Entitlement + Offering**
   - Entitlements → utwórz `premium` → przypisz `monthly`, `yearly`, `lifetime`
   - Offerings → `default` → dodaj packages z tymi produktami

4. **Privacy Policy URL**
   - App Store wymaga polityki prywatności przy IAP
   - Możesz użyć generatora (np. termly.io) lub napisać własną

### 🟡 Przed oddaniem do review

5. **Sandbox test purchase**
   - EAS dev build na urządzeniu
   - App Store Connect → Users & Access → Sandbox Testers → utwórz konto
   - Przetestuj pełny flow: paywall → zakup → weryfikacja Premium → restore

6. **App Review Notes**
   - Podaj dane sandbox testera do recenzenta App Store

---

## Zasady pracy

- Wszystkie zmiany V2 na branchu `monetization`, merge do `main` przez PR po ukończeniu fazy
- Każda funkcja = osobny commit z prefixem `feat:` / `fix:` / `refactor:`
- Przed każdym merge do `main` — build TestFlight (EAS Build)
- RevenueCat integracja musi być gotowa **przed** jakimkolwiek paywallem w UI

---

## Faza 1 — Fundament monetyzacji

### 1.1 Edycja pozycji

**Co:** Możliwość edycji nazwy, kwoty, kategorii, typu dla Income / FixedExpense / Liability / SinkingFund / Account bez usuwania i ponownego tworzenia.

**Zakres zmian:**
- `store/useBudgetStore.ts` — dodać akcje `updateIncome`, `updateFixedExpense`, `updateLiability`, `updateSinkingFund`, `updateAccount`
- `store/types.ts` — sprawdzić czy wszystkie pola są mutowalne
- `app/(tabs)/cashflow.tsx` — przycisk edycji przy każdej pozycji → modal
- `app/(tabs)/savings.tsx` — j.w.
- `components/EditItemModal.tsx` — nowy komponent (formularz edycji, reużywalny)
- `store/i18n.ts` — klucze dla akcji edycji

**Szacunek:** ~1 dzień pracy

---

### 1.2 RevenueCat integracja

**Co:** SDK do zarządzania subskrypcjami. Obsługuje App Store + Google Play, webhooks, analytics.

**Zakres zmian:**
```bash
npx expo install react-native-purchases
```

- `store/useBudgetStore.ts` — dodać pole `isPremium: boolean` do state
- `store/subscriptionStore.ts` — nowy store: inicjalizacja RC, fetch entitlements, metody `purchasePremium()`, `restorePurchases()`
- `app/_layout.tsx` — inicjalizacja RevenueCat przy starcie apki
- `constants/revenueCat.ts` — API keys (dev / prod), entitlement IDs, offering IDs
- Konfiguracja w App Store Connect i RevenueCat dashboard (poza kodem)

**Uwagi:**
- RevenueCat API key różny dla iOS i Android — trzymać w `constants/`, nie w store
- W trybie dev używać sandbox purchases
- Entitlement: `"premium"`, Offering: `"default"`, Package: `"annual"` + `"lifetime"`

**Szacunek:** ~1 dzień pracy

---

### 1.3 iCloud / Google Drive backup

**Co:** Eksport i import całego stanu Zustand do iCloud Drive (iOS) / Google Drive (Android). Automatyczny backup przy każdym zamknięciu apki + ręczny trigger w Settings.

**Zakres zmian:**
```bash
npx expo install expo-file-system expo-sharing
# iOS iCloud: expo-document-picker + iCloud Entitlement w eas.json
```

- `store/backupService.ts` — nowy serwis: `exportToJSON()`, `importFromJSON()`, `scheduleAutoBackup()`
- `app/(tabs)/settings.tsx` — sekcja "Kopia zapasowa": przyciski Eksportuj / Importuj / Ostatni backup: [data]
- `app.json` — iOS entitlement `com.apple.developer.ubiquity-kvstore-identifier`
- `eas.json` — dodać iCloud capability do profilu production
- Paywall gate: funkcja dostępna tylko dla `isPremium === true`

**Format pliku backup:** `hajs-backup-YYYY-MM-DD.json` zawierający pełny serialized Zustand state.

**Uwagi:**
- AsyncStorage → JSON export nie wymaga migracji na SQLite dla samego backupu
- SQLite migracja potrzebna dopiero przy historii transakcji (V3)
- Auto-backup: przy `AppState` change `background` → zapisz plik lokalnie; user manualnie pushuje do chmury

**Szacunek:** ~2-3 dni pracy

---

### 1.4 Ekran onboardingu + paywall UI

**Co:** Ekran powitalny dla nowych użytkowników (pierwsze uruchomienie) + ekran paywall z prezentacją tierów.

**Zakres zmian:**
- `app/onboarding.tsx` — nowy ekran: 3-4 slajdy z key features, przycisk "Zacznij za darmo"
- `app/paywall.tsx` — ekran paywall: lista funkcji Premium, przyciski Annual / Lifetime / Restore
- `store/useBudgetStore.ts` — pole `hasCompletedOnboarding: boolean`
- `app/_layout.tsx` — redirect do `/onboarding` jeśli `!hasCompletedOnboarding`
- `store/i18n.ts` — klucze onboarding / paywall

**Trigger paywallu:** przy próbie użycia Premium feature → push do `/paywall` z parametrem `feature` (żeby pokazać konkretny benefit).

**Szacunek:** ~1-2 dni pracy

---

## Faza 2 — Konwersja i retencja

### 2.1 Push notifications

**Co:** Przypomnienia o niezapłaconych zobowiązaniach i subskrypcjach. Wysyłane 2 dni przed terminem płatności.

**Zakres zmian:**
```bash
npx expo install expo-notifications
```

- `store/notificationService.ts` — schedulowanie lokalnych notyfikacji per Liability/FixedExpense
- `app/(tabs)/settings.tsx` — toggle "Powiadomienia o płatnościach" (Premium gate)
- Logika: przy oznaczeniu miesiąca jako "paid" → cancel scheduled notification

**Uwagi:** Lokalne notifikacje (expo-notifications) — nie wymagają backendu. Wystarczające dla V2.

**Szacunek:** ~1 dzień pracy

---

### 2.2 Budżet kategoriowy (envelope budgeting)

**Co:** Limit wydatków per kategoria w miesiącu. Wizualizacja postępu (pasek progresu) + alert przy przekroczeniu.

**Zakres zmian:**
- `store/types.ts` — nowy typ `CategoryBudget { id, category, monthlyLimit, month }`
- `store/useBudgetStore.ts` — `categoryBudgets[]`, akcje CRUD, `getCategorySpending(category, month)`
- `app/(tabs)/cashflow.tsx` — sekcja "Budżet kategorii" z paskami progresu
- `store/i18n.ts` — klucze envelope budgeting
- Premium gate

**Uwagi:** Kategorie mapują się na istniejące `FixedExpense.category`. Spending = suma `getExpenseAmount` dla danej kategorii w miesiącu.

**Szacunek:** ~2 dni pracy

---

### 2.3 iOS Widgets

**Co:** Widget ekranu głównego pokazujący Net Worth i Free Funds.

**Zakres zmian:**
```bash
# Wymaga Expo 54+ z expo-widgets lub natywnego modułu
npx expo install @bacons/apple-targets  # lub expo-widget-kit gdy dostępne
```

- `targets/widget/` — natywny widget (SwiftUI) czytający dane przez App Groups / UserDefaults
- `store/widgetBridge.ts` — sync kluczowych wartości (netWorth, freeFunds) do shared UserDefaults przy każdej zmianie store
- `app.json` — App Group entitlement

**Uwagi:** W Expo 54 widgety wymagają custom native build (EAS Build). Nie działa w Expo Go. Priorytet niższy jeśli skomplikuje CI/CD.

**Szacunek:** ~3-4 dni pracy (nativewind + SwiftUI)

---

### 2.4 Biometria

**Co:** FaceID / TouchID do odblokowania apki. Ekran lock przy powrocie z tła.

**Zakres zmian:**
```bash
npx expo install expo-local-authentication
```

- `store/useBudgetStore.ts` — pole `biometricEnabled: boolean`
- `app/_layout.tsx` — przy `AppState` change `active` → jeśli `biometricEnabled` → show lock screen
- `app/lock.tsx` — ekran blokady z przyciskiem "Odblokuj"
- `app/(tabs)/settings.tsx` — toggle biometrii (Premium gate)

**Szacunek:** ~0.5 dnia pracy

---

## Faza 3 — Differentiatory

### 3.1 Kalkulator FIRE

**Co:** Oblicza ile lat do finansowej niezależności na podstawie: obecny Net Worth, miesięczne oszczędności, oczekiwana stopa zwrotu, docelowy roczny wydatek (4% rule).

**Zakres zmian:**
- `app/(tabs)/analytics.tsx` lub nowy ekran `app/fire.tsx` — kalkulator z inputami i wykresem
- `store/fireCalculator.ts` — pure functions: `calculateYearsToFI(netWorth, monthlySavings, annualExpenses, rate)`
- `store/i18n.ts` — klucze FIRE
- Premium gate

**Wzór:** FI Number = Annual Expenses / 0.04. Years = ln((FINumber - NetWorth) × rate / monthlySavings + 1) / ln(1 + rate)

**Szacunek:** ~1 dzień pracy

---

### 3.2 Kalkulator dług snowball/avalanche

**Co:** Dla istniejących Liabilities — generuje harmonogram spłaty metodą snowball (najniższe saldo pierwsze) lub avalanche (najwyższe oprocentowanie pierwsze).

**Zakres zmian:**
- `app/debt-planner.tsx` — nowy ekran dostępny z Cashflow
- `store/debtCalculator.ts` — `snowball(liabilities, extraPayment)`, `avalanche(liabilities, extraPayment)`
- `store/types.ts` — dodać opcjonalne pole `interestRate?: number` do `Liability`
- `store/i18n.ts` — klucze debt planner
- Premium gate

**Szacunek:** ~1.5 dnia pracy

---

### 3.3 Export CSV / PDF raport

**Co:** Export wszystkich danych do CSV (surowe dane) lub wygenerowanie PDF z miesięcznym podsumowaniem.

**Zakres zmian:**
```bash
npx expo install expo-sharing expo-print
```

- `store/exportService.ts` — `exportCSV(month)`, `generatePDF(month)`
- `app/(tabs)/settings.tsx` — przyciski eksportu (Premium gate)
- Template HTML → PDF przez `expo-print`

**Szacunek:** ~1 dzień pracy

---

### 3.4 Wspólny budżet dla par

**Co:** Drugi użytkownik może połączyć się z tym samym budżetem. Wymaga backendu do sync.

**Uwagi:** To jest największa zmiana architektonicznie — wymaga:
- Backend API (Supabase lub Firebase) do sync state
- Auth (email lub Apple Sign-In)
- Conflict resolution przy jednoczesnych edycjach

**Decyzja:** Odkładamy na V3. Zbyt duży scope na V2. Zamiast tego — shared budżet przez eksport/import JSON jako "biedna wersja" dla par.

---

## Kolejność implementacji (sugerowana)

```
Faza 1:
  1.1 Edycja pozycji          (~1d)
  1.2 RevenueCat integracja   (~1d)
  1.4 Onboarding + paywall UI (~1.5d)
  1.3 iCloud backup           (~3d)
  → Merge develop → main, TestFlight beta

Faza 2:
  2.4 Biometria               (~0.5d)
  2.1 Push notifications      (~1d)
  2.2 Envelope budgeting      (~2d)
  2.3 iOS Widgets             (~4d)
  → Merge develop → main, TestFlight beta

Faza 3:
  3.1 Kalkulator FIRE         (~1d)
  3.2 Debt planner            (~1.5d)
  3.3 Export CSV/PDF          (~1d)
  → Merge develop → main, App Store release v2.0
```

**Łączny szacunek Faza 1+2:** ~14-15 dni roboczych  
**Łączny szacunek Faza 1+2+3:** ~18-19 dni roboczych

---

## Zależności zewnętrzne do skonfigurowania

| Serwis | Cel | Gdzie |
|---|---|---|
| RevenueCat | Subskrypcje | revenuecat.com — założyć konto, skonfigurować App Store Connect |
| App Store Connect | In-app purchases | Produkty: `premium_annual`, `premium_lifetime` |
| iCloud Entitlement | Backup | Apple Developer Portal — dodać iCloud do App ID |
| EAS Build | Native build | `eas.json` — zaktualizować profile o nowe entitlements |
