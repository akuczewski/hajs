# Backlog

## Ukończone — MVP (v1.0.0 – v1.2.0):
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

## Do zrobienia w wersji V2 (Funkcjonalności):

### Priorytet wysoki
1. [ ] **Historia transakcji** — ręczne dodawanie transakcji z kategorią, tagiem i notatką; baza do raportów.
2. [ ] **Kopia zapasowa iCloud / Google Drive** — migracja z AsyncStorage na expo-sqlite + zdalny sync; krytyczne przed utratą telefonu.
3. [ ] **Edycja pozycji** — możliwość edycji nazwy, kategorii, typu bez konieczności usuwania i ponownego dodawania.

### Priorytet średni
4. [ ] **Budżet kategoriowy** — limit wydatków per kategoria w miesiącu (envelope budgeting) z wizualizacją przekroczeń.
5. [ ] **Prognoza cashflow** — wykres na 12 miesięcy pokazujący kiedy skończą się środki przy obecnych trendach.
6. [ ] **Wykresy trendów** — przychód vs. wydatki po miesiącach (ostatnie 12), breakdown per kategoria.
7. [ ] **Powiadomienia push** — przypomnienia o płatnościach (np. 2 dni przed terminem raty).
8. [ ] **Wskaźnik oszczędności** — % dochodu odkładany miesięcznie, trend rok do roku.

### Priorytet niski / Long-term
9. [ ] **Live kursy walut** — pobieranie z API (aktualnie statyczne w `EXCHANGE_RATES`); aktualizacja Net Worth dla aktywów niefiatowych.
10. [ ] **Export CSV/JSON** — własne dane w rękach użytkownika.
11. [ ] **Biometria** — FaceID / TouchID do odblokowania aplikacji.
12. [ ] **Widgety iOS** — Net Worth i Free Funds na ekranie głównym bez otwierania apki (WidgetKit).
13. [ ] **Raport miesięczny/roczny** — PDF lub share summary z podsumowaniem przychodów, wydatków i oszczędności.
14. [ ] **Kalkulator FIRE** — Financial Independence / Early Retirement: ile lat do wolności finansowej.
15. [ ] **Multi-waluta per konto** — przeliczenia kont w różnych walutach (pole `Account.currency` już istnieje w modelu).
16. [ ] **Dług snowball / avalanche** — kalkulator strategii spłaty kredytów z harmonogramem.
17. [ ] **Import wyciągów bankowych (CSV/PDF)** — automatyczne kategoryzowanie transakcji.
18. [ ] **Integracja Google API** — Gmail/Play do automatycznego wykrywania subskrypcji.

## Tech Debt (zidentyfikowany, do adresowania):
- [ ] `Account.currency` pole istnieje w modelu ale nie jest używane w obliczeniach (wszystkie konta traktowane są jako waluta globalna store'a).
- [ ] `AsyncStorage` ma limit ~6 MB — przy rozbudowie o historię transakcji konieczna migracja na `expo-sqlite`.
- [ ] Statyczne kursy walut w `EXCHANGE_RATES` — wymagają ręcznej aktualizacji przy zmianie kursów.
