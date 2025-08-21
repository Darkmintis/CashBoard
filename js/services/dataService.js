/**
 * CashBoard Data Service
 * Handles data operations for income, expenses, and budgets
 */

const DataService = (function() {
    // Private storage of data
    let incomeData = [];
    let expenseData = [];
    let budgetData = [];
    
    // Event listeners
    const eventListeners = {
        dataChanged: []
    };
    
    /**
     * Initialize the data service
     * Load data from storage
     */
    function init() {
        loadIncome();
        loadExpenses();
        loadBudgets();
    }
    
    /**
     * Trigger data changed event
     * @param {string} type - Type of data that changed
     */
    function triggerDataChanged(type) {
        eventListeners.dataChanged.forEach(listener => {
            listener(type);
        });
    }
    
    /**
     * Add event listener for data changes
     * @param {Function} callback - Function to call when data changes
     */
    function onDataChanged(callback) {
        eventListeners.dataChanged.push(callback);
    }
    
    /*
     * Income Methods
     */
    
    /**
     * Load income data from storage
     */
    function loadIncome() {
        const stored = StorageUtil.getData(StorageUtil.KEYS.INCOME, []);
        incomeData = stored.map(item => createIncomeFromData(item));
    }
    
    /**
     * Save income data to storage
     */
    function saveIncome() {
        const data = incomeData.map(income => income.toJSON());
        StorageUtil.saveData(StorageUtil.KEYS.INCOME, data);
        triggerDataChanged('income');
    }
    
    /**
     * Get all income records
     * @returns {Array} Income records
     */
    function getAllIncome() {
        return [...incomeData];
    }
    
    /**
     * Get total income amount for a period
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {number} Total income
     */
    function getTotalIncome(startDate = null, endDate = null) {
        // If no dates provided, return total of all income
        if (!startDate && !endDate) {
            return incomeData.reduce((total, income) => total + income.amount, 0);
        }
        
        // Filter by date range
        return incomeData
            .filter(income => {
                const date = new Date(income.date);
                return (!startDate || date >= startDate) && (!endDate || date <= endDate);
            })
            .reduce((total, income) => total + income.amount, 0);
    }
    
    /**
     * Add a new income record
     * @param {Object} data - Income data
     * @returns {Income} New income record
     */
    function addIncome(data) {
        const newIncome = new Income(data);
        incomeData.push(newIncome);
        saveIncome();
        return newIncome;
    }
    
    /**
     * Update an existing income record
     * @param {string} id - Income ID
     * @param {Object} data - Updated income data
     * @returns {Income|null} Updated income record or null
     */
    function updateIncome(id, data) {
        const index = incomeData.findIndex(income => income.id === id);
        if (index === -1) return null;
        
        incomeData[index].update(data);
        saveIncome();
        return incomeData[index];
    }
    
    /**
     * Delete an income record
     * @param {string} id - Income ID
     * @returns {boolean} Success status
     */
    function deleteIncome(id) {
        const index = incomeData.findIndex(income => income.id === id);
        if (index === -1) return false;
        
        incomeData.splice(index, 1);
        saveIncome();
        return true;
    }
    
    /**
     * Get income by category for a period
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Object} Income by category
     */
    function getIncomeByCategory(startDate = null, endDate = null) {
        const result = {};
        
        // Filter by date range if provided
        const filtered = incomeData.filter(income => {
            const date = new Date(income.date);
            return (!startDate || date >= startDate) && (!endDate || date <= endDate);
        });
        
        // Group by category
        filtered.forEach(income => {
            if (!result[income.category]) {
                result[income.category] = 0;
            }
            result[income.category] += income.amount;
        });
        
        return result;
    }
    
    /*
     * Expense Methods
     */
    
    /**
     * Load expense data from storage
     */
    function loadExpenses() {
        const stored = StorageUtil.getData(StorageUtil.KEYS.EXPENSES, []);
        expenseData = stored.map(item => createExpenseFromData(item));
    }
    
    /**
     * Save expense data to storage
     */
    function saveExpenses() {
        const data = expenseData.map(expense => expense.toJSON());
        StorageUtil.saveData(StorageUtil.KEYS.EXPENSES, data);
        triggerDataChanged('expense');
    }
    
    /**
     * Get all expense records
     * @returns {Array} Expense records
     */
    function getAllExpenses() {
        return [...expenseData];
    }
    
    /**
     * Get total expenses amount for a period
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {number} Total expenses
     */
    function getTotalExpenses(startDate = null, endDate = null) {
        // If no dates provided, return total of all expenses
        if (!startDate && !endDate) {
            return expenseData.reduce((total, expense) => total + expense.amount, 0);
        }
        
        // Filter by date range
        return expenseData
            .filter(expense => {
                const date = new Date(expense.date);
                return (!startDate || date >= startDate) && (!endDate || date <= endDate);
            })
            .reduce((total, expense) => total + expense.amount, 0);
    }
    
    /**
     * Add a new expense record
     * @param {Object} data - Expense data
     * @returns {Expense} New expense record
     */
    function addExpense(data) {
        const newExpense = new Expense(data);
        expenseData.push(newExpense);
        saveExpenses();
        return newExpense;
    }
    
    /**
     * Update an existing expense record
     * @param {string} id - Expense ID
     * @param {Object} data - Updated expense data
     * @returns {Expense|null} Updated expense record or null
     */
    function updateExpense(id, data) {
        const index = expenseData.findIndex(expense => expense.id === id);
        if (index === -1) return null;
        
        expenseData[index].update(data);
        saveExpenses();
        return expenseData[index];
    }
    
    /**
     * Delete an expense record
     * @param {string} id - Expense ID
     * @returns {boolean} Success status
     */
    function deleteExpense(id) {
        const index = expenseData.findIndex(expense => expense.id === id);
        if (index === -1) return false;
        
        expenseData.splice(index, 1);
        saveExpenses();
        return true;
    }
    
    /**
     * Get expenses by category for a period
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Object} Expenses by category
     */
    function getExpensesByCategory(startDate = null, endDate = null) {
        const result = {};
        
        // Filter by date range if provided
        const filtered = expenseData.filter(expense => {
            const date = new Date(expense.date);
            return (!startDate || date >= startDate) && (!endDate || date <= endDate);
        });
        
        // Group by category
        filtered.forEach(expense => {
            if (!result[expense.category]) {
                result[expense.category] = 0;
            }
            result[expense.category] += expense.amount;
        });
        
        return result;
    }
    
    /*
     * Budget Methods
     */
    
    /**
     * Load budget data from storage
     */
    function loadBudgets() {
        const stored = StorageUtil.getData(StorageUtil.KEYS.BUDGETS, []);
        budgetData = stored.map(item => createBudgetFromData(item));
    }
    
    /**
     * Save budget data to storage
     */
    function saveBudgets() {
        const data = budgetData.map(budget => budget.toJSON());
        StorageUtil.saveData(StorageUtil.KEYS.BUDGETS, data);
        triggerDataChanged('budget');
    }
    
    /**
     * Get all budget records
     * @returns {Array} Budget records
     */
    function getAllBudgets() {
        return [...budgetData];
    }
    
    /**
     * Get budget by id
     * @param {string} id - Budget ID
     * @returns {Budget|null} Budget record or null if not found
     */
    function getBudget(id) {
        return budgetData.find(budget => budget.id === id) || null;
    }
    
    /**
     * Get budget by category
     * @param {string} category - Expense category
     * @returns {Budget|null} Budget record or null if not found
     */
    function getBudgetByCategory(category) {
        return budgetData.find(budget => budget.category === category) || null;
    }
    
    /**
     * Add a new budget
     * @param {Object} data - Budget data
     * @returns {Budget} New budget record
     */
    function addBudget(data) {
        const newBudget = new Budget(data);
        budgetData.push(newBudget);
        saveBudgets();
        return newBudget;
    }
    
    /**
     * Update an existing budget
     * @param {string} id - Budget ID
     * @param {Object} data - Updated budget data
     * @returns {Budget|null} Updated budget record or null
     */
    function updateBudget(id, data) {
        const index = budgetData.findIndex(budget => budget.id === id);
        if (index === -1) return null;
        
        budgetData[index].update(data);
        saveBudgets();
        return budgetData[index];
    }
    
    /**
     * Delete a budget
     * @param {string} id - Budget ID
     * @returns {boolean} Success status
     */
    function deleteBudget(id) {
        const index = budgetData.findIndex(budget => budget.id === id);
        if (index === -1) return false;
        
        budgetData.splice(index, 1);
        saveBudgets();
        return true;
    }
    
    /**
     * Get budget status for current period
     * @param {string} id - Budget ID (optional)
     * @returns {Array|Object} Budget status for each budget or for a specific budget
     */
    function getBudgetStatus(id = null) {
        // If id is provided, get status for a single budget
        if (id) {
            const budget = getBudget(id);
            if (!budget) return null;
            return calculateBudgetStatus(budget);
        }
        
        // Otherwise, get status for all budgets
        return budgetData.map(budget => calculateBudgetStatus(budget));
    }
    
    /**
     * Calculate budget status for a single budget
     * @param {Budget} budget - Budget object
     * @returns {Object} Budget status
     */
    function calculateBudgetStatus(budget) {
        // Get current period start and end dates based on budget period
        const { startDate, endDate } = getCurrentPeriodDates(budget.period);
        
        // Get expenses for this category and period
        const expenses = expenseData.filter(expense => {
            const date = new Date(expense.date);
            return expense.category === budget.category && 
                   date >= startDate && 
                   date <= endDate;
        });
        
        // Calculate total spent
        const spent = expenses.reduce((total, expense) => total + expense.amount, 0);
        
        // Calculate remaining amount
        const remaining = Math.max(0, budget.amount - spent);
        
        // Calculate percentage spent
        const percentSpent = budget.amount > 0 ? (spent / budget.amount) * 100 : 100;
        
        // Determine status
        let status = 'good';
        if (percentSpent >= budget.alertThreshold) {
            status = 'warning';
        }
        if (percentSpent >= budget.criticalThreshold) {
            status = 'danger';
        }
        
        return {
            id: budget.id,
            category: budget.category,
            amount: budget.amount,
            period: budget.period,
            spent,
            remaining,
            percentSpent,
            status,
            startDate,
            endDate
        };
    }
    
    /**
     * Get current period start and end dates based on period type
     * @param {string} periodType - Period type ('monthly', 'weekly', etc.)
     * @returns {Object} Start and end dates
     */
    function getCurrentPeriodDates(periodType) {
        const now = new Date();
        let startDate, endDate;
        
        switch (periodType) {
            case 'daily':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                break;
            case 'weekly':
                const dayOfWeek = now.getDay();
                const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Start week on Monday
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff);
                endDate = new Date(now.getFullYear(), now.getMonth(), startDate.getDate() + 6, 23, 59, 59);
                break;
            case 'monthly':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
                break;
            case 'yearly':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        }
        
        return { startDate, endDate };
    }
    
    /**
     * Get insights about budget status
     * @returns {Array} Array of insight objects
     */
    function getBudgetInsights() {
        const budgetStatuses = getBudgetStatus();
        const insights = [];
        
        // Find overspending categories
        const overspent = budgetStatuses.filter(status => status.spent > status.amount);
        if (overspent.length > 0) {
            insights.push({
                type: 'danger',
                title: 'Budget Overspending',
                items: overspent.map(status => 
                    `${status.category}: Spent ${formatCurrency(status.spent)} of ${formatCurrency(status.amount)} (${Math.round(status.percentSpent)}%)`
                )
            });
        }
        
        // Find categories approaching budget limit
        const approaching = budgetStatuses.filter(
            status => status.percentSpent >= status.alertThreshold && 
                     status.percentSpent < status.criticalThreshold
        );
        if (approaching.length > 0) {
            insights.push({
                type: 'warning',
                title: 'Approaching Budget Limit',
                items: approaching.map(status => 
                    `${status.category}: Spent ${formatCurrency(status.spent)} of ${formatCurrency(status.amount)} (${Math.round(status.percentSpent)}%)`
                )
            });
        }
        
        // Find healthy budget categories
        const healthy = budgetStatuses.filter(status => status.percentSpent < status.alertThreshold);
        if (healthy.length > 0) {
            insights.push({
                type: 'success',
                title: 'Healthy Budget Categories',
                items: healthy.map(status => 
                    `${status.category}: Spent ${formatCurrency(status.spent)} of ${formatCurrency(status.amount)} (${Math.round(status.percentSpent)}%)`
                )
            });
        }
        
        return insights;
    }
    
    /**
     * Format currency amount
     * @param {number} amount - Amount to format
     * @returns {string} Formatted currency string
     */
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
    
    /**
     * Get budgeting tips based on budget status
     * @returns {Array} Array of tip objects
     */
    function getBudgetTips() {
        const budgetStatuses = getBudgetStatus();
        const tips = [];
        
        // Check if any category is overspent
        const overspent = budgetStatuses.filter(status => status.spent > status.amount);
        if (overspent.length > 0) {
            tips.push({
                type: 'danger',
                icon: 'warning',
                text: `You've overspent in ${overspent.length} ${overspent.length === 1 ? 'category' : 'categories'}. Consider adjusting your spending habits or reallocating your budget.`
            });
        }
        
        // Check if total spending is within overall budget
        const totalBudget = budgetData.reduce((total, budget) => total + budget.amount, 0);
        const totalSpent = budgetStatuses.reduce((total, status) => total + status.spent, 0);
        const percentSpent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 100;
        
        if (percentSpent > 90) {
            tips.push({
                type: 'warning',
                icon: 'insights',
                text: `You've spent ${Math.round(percentSpent)}% of your total budget. Try to limit additional spending for the rest of the period.`
            });
        } else if (percentSpent < 50) {
            tips.push({
                type: 'success',
                icon: 'thumb_up',
                text: `Great job! You've only spent ${Math.round(percentSpent)}% of your total budget.`
            });
        }
        
        // Suggest creating budgets if none exist
        if (budgetData.length === 0) {
            tips.push({
                type: 'warning',
                icon: 'add_circle',
                text: `You haven't created any budgets yet. Start by adding a budget for your main expense categories.`
            });
        }
        
        return tips;
    }
    
    /**
     * Export user data to JSON
     * @returns {Object} All user data
     */
    function exportData() {
        return {
            income: incomeData.map(income => income.toJSON()),
            expenses: expenseData.map(expense => expense.toJSON()),
            budgets: budgetData.map(budget => budget.toJSON())
        };
    }
    
    /**
     * Import user data from JSON
     * @param {Object} data - User data
     * @returns {boolean} Success status
     */
    function importData(data) {
        try {
            // Validate data structure
            if (!data.income || !data.expenses || !data.budgets) {
                return false;
            }
            
            // Import income data
            incomeData = data.income.map(item => createIncomeFromData(item));
            saveIncome();
            
            // Import expense data
            expenseData = data.expenses.map(item => createExpenseFromData(item));
            saveExpenses();
            
            // Import budget data
            budgetData = data.budgets.map(item => createBudgetFromData(item));
            saveBudgets();
            
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
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
    
    // Public API
    return {
        init,
        onDataChanged,
        
        // Income methods
        getAllIncome,
        getTotalIncome,
        addIncome,
        updateIncome,
        deleteIncome,
        getIncomeByCategory,
        
        // Expense methods
        getAllExpenses,
        getTotalExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
        getExpensesByCategory,
        
        // Budget methods
        getAllBudgets,
        getBudget,
        getBudgetByCategory,
        addBudget,
        updateBudget,
        deleteBudget,
        getBudgetStatus,
        getBudgetInsights,
        getBudgetTips,
        
        // Data import/export
        exportData,
        importData
    };
})();