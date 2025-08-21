/**
 * CashBoard Storage Utility
 * Handles local storage operations for persistent data
 */

const StorageKeys = {
    INCOME: 'cashboard_income',
    EXPENSES: 'cashboard_expenses',
    BUDGETS: 'cashboard_budgets',
    SETTINGS: 'cashboard_settings',
    USER: 'cashboard_user'
};

/**
 * Storage utility for handling localStorage operations
 */
const Storage = {
    /**
     * Save data to localStorage
     * @param {string} key - Storage key
     * @param {*} data - Data to store
     * @returns {boolean} - Success status
     */
    save(key, data) {
        try {
            const serializedData = JSON.stringify(data);
            localStorage.setItem(key, serializedData);
            return true;
        } catch (error) {
            console.error('Failed to save data to storage:', error);
            return false;
        }
    },

    /**
     * Load data from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} - Retrieved data or default value
     */
    load(key, defaultValue = null) {
        try {
            const serializedData = localStorage.getItem(key);
            if (serializedData === null) {
                return defaultValue;
            }
            return JSON.parse(serializedData);
        } catch (error) {
            console.error('Failed to load data from storage:', error);
            return defaultValue;
        }
    },

    /**
     * Remove data from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} - Success status
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Failed to remove data from storage:', error);
            return false;
        }
    },

    /**
     * Check if a key exists in localStorage
     * @param {string} key - Storage key
     * @returns {boolean} - Whether key exists
     */
    exists(key) {
        return localStorage.getItem(key) !== null;
    },

    /**
     * Save income data
     * @param {Array} incomes - Array of income objects
     * @returns {boolean} - Success status
     */
    saveIncomes(incomes) {
        return this.save(StorageKeys.INCOME, incomes);
    },

    /**
     * Load income data
     * @returns {Array} - Array of income objects
     */
    loadIncomes() {
        return this.load(StorageKeys.INCOME, []);
    },

    /**
     * Save expense data
     * @param {Array} expenses - Array of expense objects
     * @returns {boolean} - Success status
     */
    saveExpenses(expenses) {
        return this.save(StorageKeys.EXPENSES, expenses);
    },

    /**
     * Load expense data
     * @returns {Array} - Array of expense objects
     */
    loadExpenses() {
        return this.load(StorageKeys.EXPENSES, []);
    },

    /**
     * Save budget data
     * @param {Array} budgets - Array of budget objects
     * @returns {boolean} - Success status
     */
    saveBudgets(budgets) {
        return this.save(StorageKeys.BUDGETS, budgets);
    },

    /**
     * Load budget data
     * @returns {Array} - Array of budget objects
     */
    loadBudgets() {
        return this.load(StorageKeys.BUDGETS, []);
    },

    /**
     * Save user settings
     * @param {Object} settings - User settings object
     * @returns {boolean} - Success status
     */
    saveSettings(settings) {
        return this.save(StorageKeys.SETTINGS, settings);
    },

    /**
     * Load user settings
     * @returns {Object} - User settings object
     */
    loadSettings() {
        return this.load(StorageKeys.SETTINGS, {
            theme: 'light',
            currency: 'USD',
            language: 'en',
            notifications: true,
            dateFormat: 'YYYY-MM-DD'
        });
    },

    /**
     * Save user profile
     * @param {Object} user - User profile data
     * @returns {boolean} - Success status
     */
    saveUser(user) {
        return this.save(StorageKeys.USER, user);
    },

    /**
     * Load user profile
     * @returns {Object|null} - User profile or null
     */
    loadUser() {
        return this.load(StorageKeys.USER, null);
    },

    /**
     * Check if this is the first time using the app
     * @returns {boolean} - Whether this is first use
     */
    isFirstUse() {
        return !this.exists(StorageKeys.USER);
    },

    /**
     * Clear all application data
     * @returns {boolean} - Success status
     */
    clearAll() {
        try {
            Object.values(StorageKeys).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('Failed to clear storage:', error);
            return false;
        }
    },

    /**
     * Export all data as JSON
     * @returns {string} JSON string of all data
     */
    exportData() {
        try {
            const data = {};
            Object.entries(StorageKeys).forEach(([type, key]) => {
                data[type] = this.load(key);
            });
            return JSON.stringify(data);
        } catch (error) {
            console.error('Failed to export data:', error);
            return null;
        }
    },

    /**
     * Import data from JSON
     * @param {string} jsonData - JSON string of data to import
     * @returns {boolean} - Success status
     */
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            Object.entries(data).forEach(([type, value]) => {
                const key = StorageKeys[type];
                if (key) {
                    this.save(key, value);
                }
            });
            return true;
        } catch (error) {
            console.error('Failed to import data:', error);
            return false;
        }
    }
};

/**
 * User-friendly wrapper around the Storage utility
 */
const StorageUtil = {
    // Storage keys accessible by consumers
    KEYS: {
        INCOME: StorageKeys.INCOME,
        EXPENSES: StorageKeys.EXPENSES,
        BUDGETS: StorageKeys.BUDGETS,
        SETTINGS: StorageKeys.SETTINGS,
        USER: StorageKeys.USER
    },
    
    // Default settings
    DEFAULT_SETTINGS: {
        theme: 'light',
        currency: 'INR',
        currencySymbol: '₹',
        language: 'en',
        notifications: true,
        dateFormat: 'DD/MM/YYYY',
        firstTimeSetup: true
    },
    
    /**
     * Save data to storage
     * @param {string} key - Storage key
     * @param {*} data - Data to store
     * @returns {boolean} - Success status
     */
    saveData(key, data) {
        return Storage.save(key, data);
    },
    
    /**
     * Get data from storage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} - Retrieved data or default value
     */
    getData(key, defaultValue = null) {
        return Storage.load(key, defaultValue);
    },
    
    /**
     * Remove data from storage
     * @param {string} key - Storage key
     * @returns {boolean} - Success status
     */
    removeData(key) {
        return Storage.remove(key);
    },
    
    /**
     * Check if data exists in storage
     * @param {string} key - Storage key
     * @returns {boolean} - Whether key exists
     */
    hasData(key) {
        return Storage.exists(key);
    },
    
    /**
     * Save income data with proper models
     * @param {Array} incomes - Array of income objects
     * @returns {boolean} - Success status
     */
    saveIncome(incomes) {
        // Convert plain objects to models if needed
        const incomeModels = incomes.map(income => {
            if (!(income instanceof Income)) {
                return new Income(income);
            }
            return income;
        });
        
        return Storage.saveIncomes(incomeModels.map(model => model.toJSON()));
    },
    
    /**
     * Get all income data as models
     * @returns {Array<Income>} - Array of Income models
     */
    getIncome() {
        const incomes = Storage.loadIncomes();
        return incomes.map(income => new Income(income));
    },
    
    /**
     * Save expense data with proper models
     * @param {Array} expenses - Array of expense objects
     * @returns {boolean} - Success status
     */
    saveExpenses(expenses) {
        // Convert plain objects to models if needed
        const expenseModels = expenses.map(expense => {
            if (!(expense instanceof Expense)) {
                return new Expense(expense);
            }
            return expense;
        });
        
        return Storage.saveExpenses(expenseModels.map(model => model.toJSON()));
    },
    
    /**
     * Get all expense data as models
     * @returns {Array<Expense>} - Array of Expense models
     */
    getExpenses() {
        const expenses = Storage.loadExpenses();
        return expenses.map(expense => new Expense(expense));
    },
    
    /**
     * Save budgets with proper models
     * @param {Array} budgets - Array of budget objects
     * @returns {boolean} - Success status
     */
    saveBudgets(budgets) {
        // Convert plain objects to models if needed
        const budgetModels = budgets.map(budget => {
            if (!(budget instanceof Budget)) {
                return new Budget(budget);
            }
            return budget;
        });
        
        return Storage.saveBudgets(budgetModels.map(model => model.toJSON()));
    },
    
    /**
     * Get all budgets as models
     * @returns {Array<Budget>} - Array of Budget models
     */
    getBudgets() {
        const budgets = Storage.loadBudgets();
        return budgets.map(budget => new Budget(budget));
    },
    
    /**
     * Save user settings
     * @param {Object} settings - User settings object
     * @returns {boolean} - Success status
     */
    saveSettings(settings) {
        // Merge with default settings
        const mergedSettings = {
            ...this.DEFAULT_SETTINGS,
            ...settings
        };
        
        return Storage.saveSettings(mergedSettings);
    },
    
    /**
     * Get user settings
     * @returns {Object} - User settings object
     */
    getSettings() {
        return Storage.loadSettings();
    },
    
    /**
     * Check if this is the first time using the app
     * @returns {boolean} - Whether this is first use
     */
    isFirstUse() {
        return Storage.isFirstUse();
    },
    
    /**
     * Clear all application data
     * @returns {boolean} - Success status
     */
    clearAllData() {
        return Storage.clearAll();
    },
    
    /**
     * Export all data as JSON file download
     */
    exportDataToFile() {
        const jsonData = Storage.exportData();
        if (!jsonData) return false;
        
        // Create file for download
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        // Create filename with date
        const date = new Date();
        const dateStr = date.toISOString().split('T')[0];
        const filename = `cashboard_backup_${dateStr}.json`;
        
        // Trigger download
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return true;
    },
    
    /**
     * Import data from file
     * @param {File} file - JSON file to import
     * @returns {Promise<boolean>} - Success status
     */
    importDataFromFile(file) {
        return new Promise((resolve, reject) => {
            if (!file || file.type !== 'application/json') {
                reject(new Error('Invalid file type. Please select a JSON file.'));
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const jsonData = event.target.result;
                    const success = Storage.importData(jsonData);
                    if (success) {
                        resolve(true);
                    } else {
                        reject(new Error('Failed to import data. Invalid format.'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsText(file);
        });
    }
};

/**
 * ===============================
 * CashBoard Data Models
 * ===============================
 */

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
function generateID() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * Create Income object from data
 * @param {Object} data - Income data
 * @returns {Income} Income object
 */
function createIncomeFromData(data) {
    return new Income(data);
}

/**
 * Create Expense object from data
 * @param {Object} data - Expense data
 * @returns {Expense} Expense object
 */
function createExpenseFromData(data) {
    return new Expense(data);
}

/**
 * Create Budget object from data
 * @param {Object} data - Budget data
 * @returns {Budget} Budget object
 */
function createBudgetFromData(data) {
    return new Budget(data);
}

/**
 * Income Model
 */
class Income {
    /**
     * Create a new Income instance
     * @param {Object} data - Income data
     */
    constructor(data = {}) {
        this.id = data.id || generateID();
        this.title = data.title || '';
        this.amount = data.amount || 0;
        this.category = data.category || 'Salary';
        this.date = data.date || new Date().toISOString().split('T')[0];
        this.recurring = data.recurring || false;
        this.recurrenceInterval = data.recurrenceInterval || 'monthly';
        this.notes = data.notes || '';
        this.source = data.source || '';
        this.tags = data.tags || [];
    }
    
    /**
     * Update income properties
     * @param {Object} data - Updated income data
     */
    update(data) {
        // Only update provided properties
        if (data.title !== undefined) this.title = data.title;
        if (data.amount !== undefined) this.amount = data.amount;
        if (data.category !== undefined) this.category = data.category;
        if (data.date !== undefined) this.date = data.date;
        if (data.recurring !== undefined) this.recurring = data.recurring;
        if (data.recurrenceInterval !== undefined) this.recurrenceInterval = data.recurrenceInterval;
        if (data.notes !== undefined) this.notes = data.notes;
        if (data.source !== undefined) this.source = data.source;
        if (data.tags !== undefined) this.tags = data.tags;
    }
    
    /**
     * Convert to plain object
     * @returns {Object} Plain object representation
     */
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            amount: this.amount,
            category: this.category,
            date: this.date,
            recurring: this.recurring,
            recurrenceInterval: this.recurrenceInterval,
            notes: this.notes,
            source: this.source,
            tags: this.tags
        };
    }
}

/**
 * Expense Model
 */
class Expense {
    /**
     * Create a new Expense instance
     * @param {Object} data - Expense data
     */
    constructor(data = {}) {
        this.id = data.id || generateID();
        this.title = data.title || '';
        this.amount = data.amount || 0;
        this.category = data.category || 'Miscellaneous';
        this.date = data.date || new Date().toISOString().split('T')[0];
        this.recurring = data.recurring || false;
        this.recurrenceInterval = data.recurrenceInterval || 'monthly';
        this.paymentMethod = data.paymentMethod || 'Cash';
        this.notes = data.notes || '';
        this.tags = data.tags || [];
        this.receipt = data.receipt || null; // Optional receipt image/URL
        this.location = data.location || null; // Optional location info
    }
    
    /**
     * Update expense properties
     * @param {Object} data - Updated expense data
     */
    update(data) {
        // Only update provided properties
        if (data.title !== undefined) this.title = data.title;
        if (data.amount !== undefined) this.amount = data.amount;
        if (data.category !== undefined) this.category = data.category;
        if (data.date !== undefined) this.date = data.date;
        if (data.recurring !== undefined) this.recurring = data.recurring;
        if (data.recurrenceInterval !== undefined) this.recurrenceInterval = data.recurrenceInterval;
        if (data.paymentMethod !== undefined) this.paymentMethod = data.paymentMethod;
        if (data.notes !== undefined) this.notes = data.notes;
        if (data.tags !== undefined) this.tags = data.tags;
        if (data.receipt !== undefined) this.receipt = data.receipt;
        if (data.location !== undefined) this.location = data.location;
    }
    
    /**
     * Convert to plain object
     * @returns {Object} Plain object representation
     */
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            amount: this.amount,
            category: this.category,
            date: this.date,
            recurring: this.recurring,
            recurrenceInterval: this.recurrenceInterval,
            paymentMethod: this.paymentMethod,
            notes: this.notes,
            tags: this.tags,
            receipt: this.receipt,
            location: this.location
        };
    }
}

/**
 * Budget Model
 */
class Budget {
    /**
     * Create a new Budget instance
     * @param {Object} data - Budget data
     */
    constructor(data = {}) {
        this.id = data.id || generateID();
        this.category = data.category || '';
        this.amount = data.amount || 0;
        this.period = data.period || 'monthly';
        this.startDate = data.startDate || new Date().toISOString().split('T')[0];
        this.notes = data.notes || '';
        this.rollover = data.rollover || false;
        this.alerts = data.alerts || {
            warning: 80, // Percentage of budget for warning
            danger: 100 // Percentage of budget for danger
        };
    }
    
    /**
     * Update budget properties
     * @param {Object} data - Updated budget data
     */
    update(data) {
        // Only update provided properties
        if (data.category !== undefined) this.category = data.category;
        if (data.amount !== undefined) this.amount = data.amount;
        if (data.period !== undefined) this.period = data.period;
        if (data.startDate !== undefined) this.startDate = data.startDate;
        if (data.notes !== undefined) this.notes = data.notes;
        if (data.rollover !== undefined) this.rollover = data.rollover;
        if (data.alerts !== undefined) this.alerts = data.alerts;
    }
    
    /**
     * Convert to plain object
     * @returns {Object} Plain object representation
     */
    toJSON() {
        return {
            id: this.id,
            category: this.category,
            amount: this.amount,
            period: this.period,
            startDate: this.startDate,
            notes: this.notes,
            rollover: this.rollover,
            alerts: this.alerts
        };
    }
}

/**
 * Predefined income categories
 * @type {Array}
 */
const INCOME_CATEGORIES = [
    'Salary',
    'Business',
    'Freelance',
    'Investments',
    'Rental',
    'Interest',
    'Dividends',
    'Gift',
    'Other'
];

/**
 * Predefined expense categories
 * @type {Array}
 */
const EXPENSE_CATEGORIES = [
    'Housing',
    'Food',
    'Transportation',
    'Utilities',
    'Healthcare',
    'Entertainment',
    'Personal Care',
    'Education',
    'Gifts & Donations',
    'Travel',
    'Shopping',
    'Insurance',
    'Debt',
    'Investments',
    'Subscriptions',
    'Miscellaneous'
];

/**
 * Predefined payment methods
 * @type {Array}
 */
const PAYMENT_METHODS = [
    'Cash',
    'Credit Card',
    'Debit Card',
    'Bank Transfer',
    'Digital Wallet',
    'Check',
    'Other'
];
