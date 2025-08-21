/**
 * CashBoard Data Models
 * Models for income, expenses, and budgets
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

// Export all models and constants
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Income,
        Expense,
        Budget,
        INCOME_CATEGORIES,
        EXPENSE_CATEGORIES,
        PAYMENT_METHODS,
        createIncomeFromData,
        createExpenseFromData,
        createBudgetFromData
    };
}