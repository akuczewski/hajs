# Hajs 💸

**Hajs** is a premium, privacy-focused budgeting application built with React Native and Expo. It helps you manage your finances using the **"Pay Yourself First"** philosophy, focusing on automating your savings goals (Sinking Funds) and keeping track of your net worth across different asset types.

![Dashboard Preview](file:///Users/rare/.gemini/antigravity/brain/479dbfb6-d3e7-434d-add4-35a5ad630889/fintech_logo_proper_1777583879763.png)

## ✨ Features

- **🏠 Dashboard**: A high-level overview of your Net Worth and a monthly checklist of obligations.
- **📈 Cashflow Management**: Track your monthly incomes (fixed and variable) and fixed expenses.
- **💰 Savings & Assets**: Manage various asset types (Cash, Bank, Crypto, Gold, Stocks) and set Sinking Funds for future goals.
- **🌍 Internationalization**: Full support for **Polish** and **English** languages.
- **💱 Dynamic Currency**: Switch between **PLN, USD, and EUR** with automatic net worth conversion.
- **🔒 100% Private**: All data is stored locally on your device using `AsyncStorage`. No cloud, no trackers, no BS.

## 🚀 Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with Persistence
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Icons**: [Lucide React Native](https://lucide.dev/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)

## 🛠 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/akuczewski/hajs.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npx expo start
   ```

## 📖 Methodology: Pay Yourself First

Hajs encourages you to treat your savings as a non-negotiable expense. 
1. Define your **Fixed Expenses**.
2. Define your **Sinking Funds** (Goals).
3. The app calculates your **Free Funds** only after accounting for these obligations.

---

Created with ❤️ by **Antigravity** (AI Coding Assistant) in collaboration with **Arkadiusz Kuczewski**.
