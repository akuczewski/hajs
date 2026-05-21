# Roadmap V2 — Hajs

> Ostatnia aktualizacja: 2026-05-21  
> Podstawa: analiza konkurencji (YNAB, Wallet, Spendee, Emma, Finanzguru, Toshl, Finary)

---

## Pozycjonowanie strategiczne

**Gap na rynku:** Nie istnieje żaden dobry ZBB (zero-based budgeting) app po polsku w przystępnej cenie.
- YNAB: $109/rok (~430 PLN), angielski, brak sync z PKO BP / mBank / ING PL
- Kontomierz: przestarzały UI, przestał się rozwijać po przejęciu
- Spendee / Wallet: czeskie, brak polskiego ZBB flow

**Pozycja Hajs:** ZBB filozofia + wehikuł czasu + sinking funds + net worth — w języku polskim. Unikalna kombinacja której żaden polski app nie ma.

---

## Model monetyzacji

### Tiery

| Tier | Cena | Co zawiera |
|---|---|---|
| **Free** | 0 PLN | Wszystkie funkcje MVP (dashboard, cashflow, savings, analityki, wehikuł czasu) |
| **Premium** | 99 PLN/rok lub 11 PLN/mies | Backup, powiadomienia, widgety, zaawansowane kalkulatory |
| **Lifetime** | 199 PLN jednorazowo | Wszystko z Premium na zawsze — dla founding users |

### Uzasadnienie cen
- Europejski sweet spot: €20–€50/rok — Spendee $22.99, Toshl $19.99, Finanzguru €36
- 99 PLN/rok (~€23) = połowa ceny YNAB, realna dla polskiego użytkownika
- Lifetime deal wzorowany na Wallet (£48.99) — jeden z ich najlepiej konwertujących produktów
- **Nie podnosić cen po launchu** — exodus YNAB po podwyżce 260% w 10 lat zrodził całą branżę "YNAB alternatives"

### Infrastruktura
- **RevenueCat** — SDK do zarządzania subskrypcjami (Expo-compatible, App Store + Google Play, darmowy do $2.5k MRR)

### Czego unikać
- Agresywne upselle co krok (Emma straciła przez to użytkowników przy dobrym produkcie)
- Blokowanie manual entry za paywallem (europejski user chce darmowej opcji)
- Reklamy bankowe/pożyczkowe (conflict of interest w finance app = utrata zaufania)

---

## Co trafia za paywall (Premium)

Zasada: **Free = core ZBB flow działa w pełni. Premium = dane są bezpieczne + wygoda codziennego użytku.**

| Funkcja | Dlaczego za paywallem |
|---|---|
| iCloud / Google Drive backup | Najsilniejszy hook — user który używa apki 3 miesiące boi się utraty danych |
| Push notifications (przypomnienia o płatnościach) | Duża wartość, wymaga infrastruktury |
| iOS Widgets (Net Worth, Free Funds) | Visiblility bez otwierania apki — Monefy to ma i jest chwalone |
| Kalkulator FIRE | Differentiator — prawie nikt w EU tego nie ma w ZBB app |
| Kalkulator dług snowball/avalanche | Zaawansowane narzędzie dla motivated users |
| Export CSV / PDF raport | Dane we własnych rękach — Finanzguru ma to za paywallem |
| Nieograniczona historia miesięcy | Free: bieżący rok; Premium: bez limitu |
| Budżet para / household (2 konta Premium) | Spendee i YNAB to mają, mocny argument dla par |

---

## Roadmap funkcji V2

Priorytet oparty na: (1) sile konwersji na Premium, (2) lukach u konkurencji, (3) opiniach użytkowników z recenzji App Store / Reddit.

### Faza 1 — Fundament monetyzacji (must-have przed paywallem)

| # | Funkcja | Tier | Uzasadnienie |
|---|---|---|---|
| 1 | **iCloud / Google Drive backup** | Premium | Najsilniejszy hook do konwersji; krytyczne przed ryzykiem utraty danych |
| 2 | **RevenueCat integracja** | — | Infrastruktura płatności; prerequisite dla wszystkiego |
| 3 | **Ekran onboardingu + paywall UI** | — | Bez tego monetyzacja nie istnieje |
| 4 | **Edycja pozycji** (nazwa, kwota, typ bez usuwania) | Free | Blocker UX — users nie mogą edytować wpisów |

### Faza 2 — Konwersja i retencja

| # | Funkcja | Tier | Uzasadnienie |
|---|---|---|---|
| 5 | **Push notifications** (remindery płatności) | Premium | Wysoko oceniane w recenzjach, zwiększa dzienne aktywne użycie |
| 6 | **Budżet kategoriowy (envelope budgeting)** | Premium | YNAB killer feature; polskie apki tego nie mają |
| 7 | **iOS Widgets** (Net Worth + Free Funds) | Premium | Monefy chwalone za widgety; WidgetKit w Expo |
| 8 | **Biometria (FaceID / TouchID)** | Premium | Standard dla finance app; buduje zaufanie |

### Faza 3 — Differentiatory (word-of-mouth)

| # | Funkcja | Tier | Uzasadnienie |
|---|---|---|---|
| 9 | **Kalkulator FIRE** | Premium | r/eupersonalfinance pyta o to stale; prawie nikt w EU tego nie ma |
| 10 | **Kalkulator dług snowball/avalanche** | Premium | Uzupełnia istniejący model Liability; brak u konkurencji |
| 11 | **Export CSV / PDF raport miesięczny** | Premium | Dane we własnych rękach — mocny argument |
| 12 | **Wspólny budżet dla par** | Premium | Spendee "shared wallets" jest bardzo chwalone; duży gap w ZBB apkach |

### Faza 4 — Long-term / V3

| # | Funkcja | Tier | Uzasadnienie |
|---|---|---|---|
| 13 | Live kursy walut (API) | Free | Aktualnie statyczne; ważne dla użytkowników z aktywami crypto/ETF |
| 14 | Drag & drop kolejność pozycji | Free | Personalizacja UX |
| 15 | Prognoza cashflow 12 miesięcy | Premium | Zaawansowana analityka |
| 16 | Import wyciągów CSV (bez bank API) | Premium | Most ku bank sync bez regulacyjnych barier |
| 17 | Multi-waluta per konto | Premium | Pole już w modelu, wymaga kalkulacji |

---

## Czego NIE robimy (parked)

- **Bank API / transakcje** — zbyt wysoki próg wejścia (AISP licencja KNF lub drogie agregatory €50-200/mies przy małej bazie), odkładamy na V3+ gdy będzie cashflow z subskrypcji
- **Google OAuth / Gmail** — duże ryzyko privacy, skomplikowany review App Store

---

## Metryki sukcesu V2

| Metryka | Cel |
|---|---|
| Konwersja Free → Premium | ≥ 5% aktywnych użytkowników |
| MRR po 6 miesiącach | 2 000 PLN (≈ 200 subskrybentów × 99 PLN / 12) |
| App Store rating | ≥ 4.6★ |
| Retencja 30-dniowa | ≥ 40% |

---

## Konkurencja — kluczowe wnioski

| App | Tygodniowy przychód EU | Lekcja |
|---|---|---|
| Finanzguru (DE) | $244k/tydz | Niska cena (€2.99/mies) + lokalna znajomość rynku = dominacja |
| Wallet (CZ) | — | Lifetime deal konwertuje; 340k recenzji Google Play |
| Emma (UK) | $7.3k/tydz | Dobry produkt zabity agresywnymi upsellami |
| YNAB (US) | $16k/tydz EU | Za drogi dla EU/PL; brak lokalizacji = otwarta furtka |
| Spendee (CZ) | — | $22.99/rok dowodzi że EU users płacą za ZBB apki |
