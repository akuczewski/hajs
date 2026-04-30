# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
