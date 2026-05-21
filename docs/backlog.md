# Backlog

## Ukończone — MVP (v1.0.0 – v1.2.1):
1. [x] Inicjalizacja projektu Expo i konfiguracja NativeWind/Tailwind.
2. [x] Przygotowanie architektury Zustand z AsyncStorage.
3. [x] Przygotowanie modeli TypeScript (Incomes, FixedExpenses, SinkingFunds, Liabilities, Accounts).
4. [x] Implementacja Głównego Dashboardu z widokiem Net Worth i "Pay yourself first".
5. [x] Implementacja list i formularzy Przychodów (Cashflow).
6. [x] Implementacja list Wydatków Stałych (Cashflow).
7. [x] Implementacja Kosztów Rocznych (Sinking Funds) z wizualizacją w postaci skarbonek.
8. [x] Implementacja Zobowiązań (kredyty, subskrypcje) z checkboxami do oznaczania zapłaty.
9. [x] Wdrożenie "wehikułu czasu" (nawigacja po miesiącach zsynchronizowana na wszystkich ekranach).
10. [x] Edycja i nadpisywanie kwot przychodów/wydatków specyficznych tylko dla danego miesiąca.
11. [x] Ograniczenie przewidywania przyszłości (max 3 miesiące w przód).
12. [x] Usuwanie celów oszczędnościowych (Sinking Funds).
13. [x] Implementacja przycisku Reset App z potwierdzeniem (Danger Zone).
14. [x] Pełna dwujęzyczność EN/PL — uzupełniono brakujące klucze w sekcjach cashflow, savings, settings.
15. [x] Wyodrębnienie współdzielonego hooka `useMonthNavigation` (eliminacja duplikacji kodu).
16. [x] Dokumentacja projektu (CLAUDE.md) dla wspomagania AI.
17. [x] Analityki: stacked bar chart przychód vs. wydatki, pull-to-refresh, monthly surplus.

---

## V2 — Faza 1: Fundament monetyzacji (najwyższy priorytet)

> Prerequisite przed uruchomieniem paywallu. Bez tych elementów monetyzacja nie istnieje.
> Szczegóły: [roadmap_v2.md](roadmap_v2.md)

1. [ ] **Edycja pozycji** — edycja nazwy, kwoty, kategorii i typu bez usuwania i ponownego dodawania. Blocker UX.
2. [ ] **RevenueCat integracja** — SDK do zarządzania subskrypcjami (App Store + Google Play). Prerequisite dla paywallu.
3. [ ] **iCloud / Google Drive backup** — migracja z AsyncStorage na expo-sqlite + zdalny sync. Najsilniejszy hook konwersji Free→Premium.
4. [ ] **Ekran onboardingu + paywall UI** — przedstawienie tierów Free/Premium/Lifetime, ekran powitalny.

## V2 — Faza 2: Konwersja i retencja

5. [ ] **Push notifications** — przypomnienia o płatnościach (2 dni przed terminem). Premium.
6. [ ] **Budżet kategoriowy (envelope budgeting)** — limit wydatków per kategoria z wizualizacją przekroczeń. Premium.
7. [ ] **iOS Widgets** — Net Worth i Free Funds na ekranie głównym (WidgetKit). Premium.
8. [ ] **Biometria** — FaceID / TouchID do odblokowania aplikacji. Premium.

## V2 — Faza 3: Differentiatory

9. [ ] **Kalkulator FIRE** — Financial Independence/Early Retirement: ile lat do wolności finansowej. Premium.
10. [ ] **Kalkulator dług snowball/avalanche** — strategia spłaty z harmonogramem. Premium.
11. [ ] **Export CSV / PDF raport miesięczny** — dane we własnych rękach użytkownika. Premium.
12. [ ] **Wspólny budżet dla par/rodziny** — drugi użytkownik z dostępem do tego samego budżetu. Premium.

## V2 — Faza 4: Long-term / V3

13. [ ] **Live kursy walut** — pobieranie z API (aktualnie statyczne w `EXCHANGE_RATES`).
14. [ ] **Drag & drop kolejność pozycji** — personalizacja list przychodów/wydatków/celów.
15. [ ] **Prognoza cashflow 12 miesięcy** — wykres skumulowanych środków lub deficytu.
16. [ ] **Import wyciągów CSV** — ręczny import z banku (PKO BP, mBank, ING PL) bez bank API.
17. [ ] **Multi-waluta per konto** — przeliczenia kont w różnych walutach (pole `Account.currency` już istnieje).
18. [ ] **Wskaźnik oszczędności** — % dochodu odkładany miesięcznie, trend rok do roku.

## Parked (wysoki próg wejścia)

- **Bank API / pobieranie transakcji** — wymaga licencji AISP od KNF lub płatnego agregatora (€50-200/mies). Wrócimy gdy będzie cashflow z subskrypcji.
- **Historia transakcji** — powiązana z bank API; wrócimy razem z importem CSV jako pierwszym krokiem.
- **Google OAuth / Gmail integracja** — skomplikowany App Store review, ryzyko privacy.

---

## Tech Debt (do adresowania):
- [ ] `Account.currency` pole istnieje w modelu ale nie jest używane w obliczeniach.
- [ ] `AsyncStorage` ma limit ~6 MB — przy backupie konieczna migracja na `expo-sqlite`.
- [ ] Statyczne kursy walut w `EXCHANGE_RATES` — wymagają ręcznej aktualizacji.
- [ ] `Income.history` legacy field nadal w typach (`store/types.ts:9`).
