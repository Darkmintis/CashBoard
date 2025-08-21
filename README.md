# 💰 CashBoard

> **Your Private Money Mentor. No Cloud. No Ads. Just Clarity.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-brightgreen.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![Offline First](https://img.shields.io/badge/Offline-First-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers)

A privacy-first, local-only personal finance management application that helps you track income, manage expenses, and get smart financial insights—all without storing any data on external servers.

## ✨ Features

### 🏦 **Financial Management**
- **Income Tracking**: Record salary, freelance, business income with categorization
- **Expense Monitoring**: Track spending across customizable categories
- **Budget Planning**: Set and monitor budgets with visual progress indicators
- **Smart Allocation**: AI-powered spending suggestions and savings goals

### 🔒 **Privacy & Security**
- **100% Local Storage**: All data stays on your device
- **No Cloud Dependency**: Works completely offline
- **No Tracking**: No analytics, ads, or user monitoring
- **Export Control**: Full data export/import capabilities

### 📊 **Insights & Analytics**
- **Visual Charts**: Interactive expense and income visualizations
- **CashBot Tips**: Personalized financial recommendations
- **Progress Tracking**: Savings goals and budget monitoring
- **Trend Analysis**: Monthly and yearly financial patterns

### � **Modern Experience**
- **Progressive Web App**: Install like a native app
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Offline First**: Full functionality without internet
- **Fast Performance**: Lightweight and optimized

## � Quick Start

### Option 1: Direct Use
1. Download or clone this repository
2. Open `index.html` in your browser
3. Start managing your finances immediately!

### Option 2: Local Server
```bash
# Clone the repository
git clone https://github.com/Darkmintis/CashBoard.git
cd CashBoard

# Serve with Python (or any HTTP server)
python -m http.server 8000

# Visit http://localhost:8000
```

### Option 3: Install as PWA
1. Open CashBoard in Chrome/Edge/Safari
2. Click the install button in the address bar
3. Enjoy native app experience

## 🏗️ Project Structure

```
CashBoard/
├── 📄 index.html              # Main application page
├── 📄 manifest.json           # PWA configuration
├── 📄 sw.js                   # Service worker for offline functionality
├── 🎨 css/
│   ├── normalize.css          # CSS reset
│   └── main.css              # Consolidated application styles
├── ⚡ js/
│   ├── app.js                # Main application logic
│   ├── 🔧 utils/
│   │   └── storage.js        # Local storage & data models
│   ├── 🎛️ components/
│   │   ├── ui.js             # User interface components
│   │   └── charts.js         # Chart visualizations
│   └── 🚀 services/
│       ├── dataService.js    # Data management service
│       └── cashbotService.js # Smart financial suggestions
└── 📋 docs/
    ├── CHANGELOG.md          # Version history
    └── README.md            # This file
```

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Charts**: Chart.js for interactive visualizations
- **Storage**: Browser LocalStorage with IndexedDB fallback
- **PWA**: Service Workers, Web App Manifest
- **Icons**: Font Awesome for UI icons
- **No Dependencies**: Pure web technologies, no frameworks

## 📱 Installation Guide

### Desktop Browsers
1. **Chrome/Edge**: Look for install icon in address bar
2. **Firefox**: Menu → Install this site as an app
3. **Safari**: Share → Add to Dock

### Mobile Devices
1. **Android**: Chrome menu → "Add to Home screen"
2. **iOS**: Safari share button → "Add to Home Screen"

## 🎯 Core Philosophy

### Privacy First
- **Your Data, Your Device**: Everything stored locally
- **No Server Dependency**: Works completely offline
- **No Tracking**: Zero analytics or user monitoring
- **Transparent Code**: Open source for full transparency

### Simplicity
- **Easy to Use**: Intuitive interface for all skill levels
- **Fast Setup**: Start tracking finances in under 2 minutes
- **No Registration**: No accounts, emails, or sign-ups required

### Intelligence
- **CashBot Engine**: Smart spending analysis and suggestions
- **Automated Insights**: Spending patterns and budget recommendations
- **Goal Tracking**: Savings and financial milestone monitoring

## 🤖 CashBot Features

Our intelligent financial assistant provides:

- **Spending Analysis**: Identify overspending categories
- **Savings Suggestions**: Automated savings goal recommendations
- **Budget Optimization**: Smart budget allocation based on income
- **Financial Tips**: Personalized advice for better money management

## 📊 Data Management

### Storage
- **Local First**: All data stored in browser LocalStorage
- **Backup/Restore**: JSON export/import functionality
- **Privacy**: No cloud storage, no external servers

### Export Formats
- **JSON**: Complete data export with all transactions
- **Backup Files**: Timestamped backups for easy restoration

## 🚧 Development

### Prerequisites
- Modern web browser (Chrome 80+, Firefox 75+, Safari 13+)
- Basic HTTP server (for development)

### Local Development
```bash
# Clone repository
git clone https://github.com/Darkmintis/CashBoard.git
cd CashBoard

# Start development server
npx serve .
# or
python -m http.server 8000

# Open http://localhost:8000
```

### Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📈 Roadmap

- [ ] **Multi-currency Support**: Handle different currencies
- [ ] **Advanced Analytics**: Detailed spending analysis
- [ ] **Goal Setting**: Financial milestone tracking
- [ ] **Categories Customization**: User-defined expense categories
- [ ] **Receipt Scanning**: OCR for automatic expense entry
- [ ] **Dark Mode**: Theme customization options

## 🆘 Support

### Documentation
- Check the [Wiki](https://github.com/Darkmintis/CashBoard/wiki) for detailed guides
- Browse [Issues](https://github.com/Darkmintis/CashBoard/issues) for common problems

### Getting Help
- 🐛 **Bug Reports**: [Create an Issue](https://github.com/Darkmintis/CashBoard/issues/new)
- 💡 **Feature Requests**: [Discussion Forum](https://github.com/Darkmintis/CashBoard/discussions)
- 📧 **Direct Contact**: [Email Support](mailto:support@cashboard.app)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License - Copyright (c) 2025 CashBoard Team
Permission granted for commercial and non-commercial use.
```

## 🙏 Acknowledgments

- **Chart.js**: Beautiful, responsive charts
- **Font Awesome**: Comprehensive icon library
- **Normalize.css**: Cross-browser consistency
- **Open Source Community**: Inspiration and best practices

## 🌟 Why Choose CashBoard?

| Feature | CashBoard | Mint | YNAB | Personal Capital |
|---------|-----------|------|------|------------------|
| **Privacy** | ✅ Local Only | ❌ Cloud Required | ❌ Cloud Required | ❌ Cloud Required |
| **Cost** | ✅ Free Forever | ✅ Free | ❌ $84/year | ✅ Free |
| **Offline** | ✅ Works Offline | ❌ Internet Required | ❌ Internet Required | ❌ Internet Required |
| **No Ads** | ✅ Ad-Free | ❌ Has Ads | ✅ Ad-Free | ❌ Has Ads |
| **Open Source** | ✅ Transparent | ❌ Proprietary | ❌ Proprietary | ❌ Proprietary |

---

<div align="center">

**Built with ❤️ for financial privacy and transparency**

[![GitHub Stars](https://img.shields.io/github/stars/Darkmintis/CashBoard?style=social)](https://github.com/Darkmintis/CashBoard/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Darkmintis/CashBoard?style=social)](https://github.com/Darkmintis/CashBoard/network/members)

[⭐ Star on GitHub](https://github.com/Darkmintis/CashBoard) • [🚀 Try CashBoard](https://darkmintis.github.io/CashBoard) • [📖 Documentation](https://github.com/Darkmintis/CashBoard/wiki)

</div>
