# KashBoard

Your Private Money Mentor. No Cloud. No Ads. Just Clarity.

## 🧠 What is KashBoard?

KashBoard is a local-first, privacy-respecting personal finance dashboard that helps users manage income, track expenses, and automatically suggest savings, investments, and lifestyle budgets — without storing any data on external servers.

## ✅ Key Features (MVP)

### 1. Manual Income Input
- Primary income (salary, business, freelance, etc.)
- Surprise income (bonus, gifts, interest, cashback, etc.)

### 2. Manual Expense Tracking
- Add categories: food, rent, transport, education, subscriptions, etc.
- Optional notes, receipts (image or PDF), or tags

### 3. Smart Allocation Engine (KashBot Module)
Based on income – expenses, auto-suggest:
- 📥 Savings goal suggestion (20% rule, customizable)
- 📈 Investment bucket (based on risk preference, if extended)
- 🎉 Entertainment/Leisure budget (suggest balance)
- 💡 Custom "KashTips" (e.g., "You overspent 12% on food this month")

### 4. Local-Only Data Storage
- Use IndexedDB, LocalStorage, or File-based JSON export/import
- No cloud; users control everything
- Optional data encryption for security

### 5. Progress Visualization
- Simple charts: income vs expenses, savings over time, budget pie charts
- Visual reminders for savings goals, budget overflow alerts

### 6. Offline-First PWA
- Works fully offline as a Progressive Web App
- User installs it like an app, but all in-browser

## 🛠️ Tech Stack

- **Frontend**: React / SvelteKit
- **Storage**: LocalStorage, IndexedDB, or WebSQL (no backend needed)
- **Optional**: Add Tauri or Electron for desktop builds
- **Open Source**: Hosted on GitHub under MIT or GPL-3.0

## 🌟 Unique Selling Points (USP)

- 🔒 100% local data control
- 🧠 Auto-budgeting intelligence without AI dependence
- 🚫 No tracking, no ads, no account signup
- ✍️ Open-source with plug-and-play architecture for contributors
- 📊 Designed for clarity, ethics, and daily use
