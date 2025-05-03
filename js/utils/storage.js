/**
 * KashBoard Storage Utility
 * Handles local storage operations for persistent data
 */

const StorageKeys = {
    INCOME: 'kashboard_income',
    EXPENSES: 'kashboard_expenses',
    BUDGETS: 'kashboard_budgets',
    SETTINGS: 'kashboard_settings',
    USER: 'kashboard_user'
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
        savingsTarget: 20,
        kashbotTips: true,
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
        const filename = `kashboard_backup_${dateStr}.json`;
        
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