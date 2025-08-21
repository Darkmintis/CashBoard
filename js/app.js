/**
 * CashBoard Application
 * Main application file that initializes and orchestrates the personal finance dashboard
 */

// Application state
const App = (() => {
    // Private variables
    let currentPage = 'dashboard';
    let currentUser = null;
    let appSettings = {
        currency: 'USD',
        savingsTarget: 20, // Default savings target percentage
        theme: 'light',
        notificationsEnabled: true
    };
    
    // DOM Elements
    const elements = {
        sidebarLinks: document.querySelectorAll('.sidebar-link'),
        contentArea: document.getElementById('content-area'),
        currencySelector: document.getElementById('currency-selector'),
        themeToggle: document.getElementById('theme-toggle'),
        notificationBell: document.getElementById('notification-bell'),
        userProfileArea: document.getElementById('user-profile'),
        dateDisplay: document.getElementById('current-date'),
        loader: document.getElementById('app-loader')
    };
    
    /**
     * Initialize the application
     */
    const init = () => {
        console.log('Initializing CashBoard application...');
        
        // Load user data and settings
        loadUserData();
        
        // Set up event listeners
        setupEventListeners();
        
        // Display current date
        updateDateDisplay();
        
        // Apply saved theme
        applyTheme(appSettings.theme);
        
        // Load the default page
        navigateToPage(currentPage);
        
        // Hide loader when app is ready
        if (elements.loader) {
            elements.loader.style.display = 'none';
        }
        
        console.log('CashBoard initialization complete');
    };
    
    /**
     * Load user data from storage
     */
    const loadUserData = () => {
        // Attempt to load user data
        const userData = StorageUtil.getItem('currentUser');
        if (userData) {
            currentUser = userData;
            updateUserProfileUI();
        } else {
            // If no user found, create a demo user
            createDemoUserIfNeeded();
        }
        
        // Load application settings
        const savedSettings = StorageUtil.getItem('appSettings');
        if (savedSettings) {
            appSettings = {...appSettings, ...savedSettings};
        }
        
        // Update UI based on settings
        updateSettingsUI();
    };
    
    /**
     * Create a demo user if no user exists
     */
    const createDemoUserIfNeeded = () => {
        const demoUser = {
            id: 'demo-user',
            name: 'Demo User',
            email: 'demo@CashBoard.app',
            avatar: 'images/default-avatar.png',
            createdAt: new Date().toISOString()
        };
        
        currentUser = demoUser;
        StorageUtil.setItem('currentUser', demoUser);
        
        // Create some demo data
        createDemoData();
        
        updateUserProfileUI();
    };
    
    /**
     * Create demo financial data for new users
     */
    const createDemoData = () => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        // Create income data
        const incomeData = [
            {
                id: 'inc-1',
                description: 'Salary',
                amount: 5000,
                date: new Date(currentYear, currentMonth, 15).toISOString(),
                category: 'Salary',
                recurring: true
            },
            {
                id: 'inc-2',
                description: 'Freelance Work',
                amount: 800,
                date: new Date(currentYear, currentMonth, 20).toISOString(),
                category: 'Side Income',
                recurring: false
            }
        ];
        
        // Create expense data
        const expenseData = [
            {
                id: 'exp-1',
                description: 'Rent',
                amount: 1200,
                date: new Date(currentYear, currentMonth, 1).toISOString(),
                category: 'Housing',
                recurring: true
            },
            {
                id: 'exp-2',
                description: 'Groceries',
                amount: 400,
                date: new Date(currentYear, currentMonth, 10).toISOString(),
                category: 'Food',
                recurring: true
            },
            {
                id: 'exp-3',
                description: 'Internet',
                amount: 60,
                date: new Date(currentYear, currentMonth, 5).toISOString(),
                category: 'Utilities',
                recurring: true
            },
            {
                id: 'exp-4',
                description: 'Movie Night',
                amount: 50,
                date: new Date(currentYear, currentMonth, 18).toISOString(),
                category: 'Entertainment',
                recurring: false
            }
        ];
        
        // Save to storage
        StorageUtil.setItem('incomeData', incomeData);
        StorageUtil.setItem('expenseData', expenseData);
        
        // Create savings goals
        const savingsGoals = [
            {
                id: 'goal-1',
                name: 'Emergency Fund',
                targetAmount: 10000,
                currentAmount: 2500,
                deadline: new Date(currentYear + 1, 5, 1).toISOString(),
                priority: 'high'
            },
            {
                id: 'goal-2',
                name: 'Vacation',
                targetAmount: 3000,
                currentAmount: 800,
                deadline: new Date(currentYear, 8, 1).toISOString(),
                priority: 'medium'
            }
        ];
        
        StorageUtil.setItem('savingsGoals', savingsGoals);
    };
    
    /**
     * Set up event listeners for the application
     */
    const setupEventListeners = () => {
        // Navigation
        if (elements.sidebarLinks) {
            elements.sidebarLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const page = link.getAttribute('data-page');
                    navigateToPage(page);
                });
            });
        }
        
        // Theme toggle
        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', () => {
                const newTheme = appSettings.theme === 'light' ? 'dark' : 'light';
                appSettings.theme = newTheme;
                applyTheme(newTheme);
                saveSettings();
            });
        }
        
        // Currency selector
        if (elements.currencySelector) {
            elements.currencySelector.addEventListener('change', (e) => {
                appSettings.currency = e.target.value;
                saveSettings();
                // Refresh current page to update currency display
                navigateToPage(currentPage);
            });
        }
        
        // Notification toggle
        if (elements.notificationBell) {
            elements.notificationBell.addEventListener('click', () => {
                appSettings.notificationsEnabled = !appSettings.notificationsEnabled;
                elements.notificationBell.classList.toggle('active', appSettings.notificationsEnabled);
                saveSettings();
            });
        }
    };
    
    /**
     * Navigate to a specific page
     * @param {string} page - The page to navigate to
     */
    const navigateToPage = (page) => {
        if (!page || page === currentPage) return;
        
        // Update active state in sidebar
        if (elements.sidebarLinks) {
            elements.sidebarLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('data-page') === page);
            });
        }
        
        // Update current page
        currentPage = page;
        
        // Clear content area
        if (elements.contentArea) {
            elements.contentArea.innerHTML = '<div class="page-loader"></div>';
        }
        
        // Load page content
        loadPageContent(page);
    };
    
    /**
     * Load content for a specific page
     * @param {string} page - The page to load content for
     */
    const loadPageContent = (page) => {
        // This would typically load the page content dynamically
        switch (page) {
            case 'dashboard':
                renderDashboardPage();
                break;
            case 'income':
                renderIncomePage();
                break;
            case 'expenses':
                renderExpensesPage();
                break;
            case 'budget':
                renderBudgetPage();
                break;
            case 'savings':
                renderSavingsPage();
                break;
            case 'reports':
                renderReportsPage();
                break;
            case 'settings':
                renderSettingsPage();
                break;
            default:
                // Handle unknown page
                if (elements.contentArea) {
                    elements.contentArea.innerHTML = '<div class="error-message">Page not found</div>';
                }
        }
    };
    
    /**
     * Render the dashboard page
     */
    const renderDashboardPage = () => {
        if (!elements.contentArea) return;
        
        // Get financial data
        const financialSummary = DataService.getFinancialSummary();
        
        let html = `
            <div class="dashboard-container">
                <h1 class="page-title">Dashboard</h1>
                
                <div class="summary-cards">
                    <div class="card income-card">
                        <h3>Income</h3>
                        <div class="amount">${formatCurrency(financialSummary.totalIncome)}</div>
                    </div>
                    
                    <div class="card expense-card">
                        <h3>Expenses</h3>
                        <div class="amount">${formatCurrency(financialSummary.totalExpenses)}</div>
                    </div>
                    
                    <div class="card balance-card">
                        <h3>Balance</h3>
                        <div class="amount">${formatCurrency(financialSummary.totalIncome - financialSummary.totalExpenses)}</div>
                    </div>
                </div>
                
                <div class="recent-transactions">
                    <h2>Recent Transactions</h2>
                    <div class="transactions-container">
                        ${renderRecentTransactions()}
                    </div>
                </div>
            </div>
        `;
        
        elements.contentArea.innerHTML = html;
        
        // Initialize any charts or interactive elements
        initializeDashboardCharts();
    };
    
    /**
     * Render the allocation chart for the dashboard
     * @param {Object} allocations - The allocations object
    /**
     * Render recent transactions
     * @returns {string} HTML for recent transactions
     */
    const renderRecentTransactions = () => {
        const transactions = DataService.getRecentTransactions(5);
        
        if (!transactions || transactions.length === 0) {
            return '<p>No recent transactions found.</p>';
        }
        
        let html = `
            <table class="transactions-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            const transactionType = transaction.type === 'income' ? 'income' : 'expense';
            const amount = transaction.type === 'income' ? transaction.amount : -transaction.amount;
            
            html += `
                <tr class="${transactionType}-row">
                    <td>${formattedDate}</td>
                    <td>${transaction.description}</td>
                    <td>${transaction.category}</td>
                    <td class="amount ${transactionType}">${formatCurrency(amount)}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        return html;
    };
    
    /**
     * Initialize dashboard charts using a charting library
     */
    const initializeDashboardCharts = () => {
        // This would initialize charts using a library like Chart.js
        // For now, we'll just log that we would initialize charts here
        console.log('Dashboard charts would be initialized here');
    };
    
    /**
     * Render the income page
     */
    const renderIncomePage = () => {
        // Implementation for income page rendering would go here
        console.log('Income page rendering would go here');
        if (elements.contentArea) {
            elements.contentArea.innerHTML = '<h1>Income Page</h1><p>Income management would be implemented here.</p>';
        }
    };
    
    /**
     * Render the expenses page
     */
    const renderExpensesPage = () => {
        // Implementation for expenses page rendering would go here
        console.log('Expenses page rendering would go here');
        if (elements.contentArea) {
            elements.contentArea.innerHTML = '<h1>Expenses Page</h1><p>Expense management would be implemented here.</p>';
        }
    };
    
    /**
     * Render the budget page
     */
    const renderBudgetPage = () => {
        if (!elements.contentArea) return;
        
        // Get budget data and expense data for the current month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        const allBudgets = DataService.getAllBudgets();
        const budgetStatuses = DataService.getAllBudgetStatus(startOfMonth, endOfMonth);
        const expensesByCategory = DataService.getExpensesByCategory(startOfMonth, endOfMonth);
        const allCategories = [...new Set([
            ...Object.keys(expensesByCategory),
            ...allBudgets.map(budget => budget.category)
        ])];
        
        // Render the budget page content
        let html = `
            <div class="budget-container">
                <h1 class="page-title">Budget Management</h1>
                
                <div class="budget-header">
                    <div class="budget-period">
                        <h3>Budget for ${now.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                    </div>
                    <button id="add-budget-btn" class="primary-button">+ Create New Budget</button>
                </div>
                
                <div class="budget-summary">
                    <div class="summary-cards">
                        <div class="card budget-total-card">
                            <h3>Total Budget</h3>
                            <div class="amount">${formatCurrency(allBudgets.reduce((sum, budget) => sum + budget.amount, 0))}</div>
                        </div>
                        
                        <div class="card budget-spent-card">
                            <h3>Total Spent</h3>
                            <div class="amount">${formatCurrency(Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0))}</div>
                        </div>
                        
                        <div class="card budget-remaining-card">
                            <h3>Remaining</h3>
                            <div class="amount">${formatCurrency(
                                allBudgets.reduce((sum, budget) => sum + budget.amount, 0) - 
                                Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0)
                            )}</div>
                        </div>
                    </div>
                </div>
                
                <div class="budget-list-container">
                    <h2>Your Budgets</h2>
                    
                    ${allBudgets.length > 0 ? 
                        renderBudgetTable(allBudgets, budgetStatuses) : 
                        '<p class="empty-state">No budgets created yet. Click the "Create New Budget" button to get started.</p>'
                    }
                </div>
                
                <div class="budget-visualization">
                    <h2>Budget Overview</h2>
                    <div id="budget-chart-container">
                        <canvas id="budget-chart"></canvas>
                    </div>
                </div>
                
                <div class="budget-insights">
                    <h2>Budget Insights</h2>
                    <div class="insights-container">
                        ${renderBudgetInsights(allBudgets, budgetStatuses)}
                    </div>
                </div>
            </div>
        `;
        
        elements.contentArea.innerHTML = html;
        
        // Initialize the budget chart
        initializeBudgetChart(allBudgets, budgetStatuses);
        
        // Set up event listeners
        setupBudgetEventListeners(allBudgets, allCategories);
    };
    
    /**
     * Render the budget table
     * @param {Array} budgets - Array of budget objects
     * @param {Object} budgetStatuses - Budget statuses by category
     * @returns {string} HTML for the budget table
     */
    const renderBudgetTable = (budgets, budgetStatuses) => {
        let html = `
            <table class="budget-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Budget</th>
                        <th>Spent</th>
                        <th>Remaining</th>
                        <th>Progress</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        budgets.forEach(budget => {
            const status = budgetStatuses[budget.category] || { 
                budget: budget.amount, 
                spent: 0, 
                remaining: budget.amount, 
                percentage: 0,
                status: 'normal'
            };
            
            html += `
                <tr data-budget-id="${budget.id}">
                    <td class="budget-category">${budget.category}</td>
                    <td class="budget-amount">${formatCurrency(budget.amount)}</td>
                    <td class="budget-spent">${formatCurrency(status.spent)}</td>
                    <td class="budget-remaining">${formatCurrency(status.remaining)}</td>
                    <td class="budget-progress">
                        <div class="progress-bar-container">
                            <div class="progress-bar ${status.status}" style="width: ${Math.min(status.percentage, 100)}%"></div>
                        </div>
                        <span class="progress-text">${Math.round(status.percentage)}%</span>
                    </td>
                    <td class="budget-actions">
                        <button class="icon-button edit-budget" title="Edit Budget" data-budget-id="${budget.id}">
                            <span class="material-icons">edit</span>
                        </button>
                        <button class="icon-button delete-budget" title="Delete Budget" data-budget-id="${budget.id}">
                            <span class="material-icons">delete</span>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        return html;
    };
    
    /**
     * Render budget insights
     * @param {Array} budgets - Budget objects
     * @param {Object} budgetStatuses - Budget statuses by category
     * @returns {string} HTML for budget insights
     */
    const renderBudgetInsights = (budgets, budgetStatuses) => {
        if (budgets.length === 0) {
            return '<p class="empty-state">Create budgets to see insights.</p>';
        }
        
        // Find budgets that are over or close to exceeding their limits
        const overBudget = [];
        const nearLimit = [];
        const healthyBudget = [];
        
        budgets.forEach(budget => {
            const status = budgetStatuses[budget.category];
            if (!status) return;
            
            if (status.status === 'danger') {
                overBudget.push({ budget, status });
            } else if (status.status === 'warning') {
                nearLimit.push({ budget, status });
            } else {
                healthyBudget.push({ budget, status });
            }
        });
        
        let html = '<div class="insights-list">';
        
        // Over budget items
        if (overBudget.length > 0) {
            html += '<div class="insight-category danger">';
            html += '<h3>Over Budget</h3>';
            html += '<ul>';
            overBudget.forEach(item => {
                html += `
                    <li>
                        <strong>${item.budget.category}:</strong> You've spent 
                        ${formatCurrency(item.status.spent)} of your 
                        ${formatCurrency(item.budget.amount)} budget 
                        (${Math.round(item.status.percentage)}%).
                    </li>
                `;
            });
            html += '</ul>';
            html += '</div>';
        }
        
        // Near limit items
        if (nearLimit.length > 0) {
            html += '<div class="insight-category warning">';
            html += '<h3>Approaching Limit</h3>';
            html += '<ul>';
            nearLimit.forEach(item => {
                html += `
                    <li>
                        <strong>${item.budget.category}:</strong> You've spent 
                        ${formatCurrency(item.status.spent)} of your 
                        ${formatCurrency(item.budget.amount)} budget 
                        (${Math.round(item.status.percentage)}%).
                    </li>
                `;
            });
            html += '</ul>';
            html += '</div>';
        }
        
        // Healthy budget items
        if (healthyBudget.length > 0) {
            html += '<div class="insight-category success">';
            html += '<h3>On Track</h3>';
            html += '<ul>';
            healthyBudget.forEach(item => {
                html += `
                    <li>
                        <strong>${item.budget.category}:</strong> You've spent 
                        ${formatCurrency(item.status.spent)} of your 
                        ${formatCurrency(item.budget.amount)} budget 
                        (${Math.round(item.status.percentage)}%).
                    </li>
                `;
            });
            html += '</ul>';
            html += '</div>';
        }
        
        // Add tips based on budget performance
        html += '<div class="budget-tips">';
        html += '<h3>Budget Tips</h3>';
        
        if (overBudget.length > 0) {
            html += `
                <div class="tip danger">
                    <span class="material-icons">warning</span>
                    <p>You have ${overBudget.length} ${overBudget.length === 1 ? 'category' : 'categories'} over budget. 
                    Consider adjusting your spending or increasing these budgets next month.</p>
                </div>
            `;
        }
        
        if (nearLimit.length > 0) {
            html += `
                <div class="tip warning">
                    <span class="material-icons">info</span>
                    <p>Monitor your spending in ${nearLimit.length} ${nearLimit.length === 1 ? 'category' : 'categories'} 
                    that are approaching their limits.</p>
                </div>
            `;
        }
        
        if (healthyBudget.length > 0) {
            html += `
                <div class="tip success">
                    <span class="material-icons">check_circle</span>
                    <p>Great job! You're staying within budget for ${healthyBudget.length} 
                    ${healthyBudget.length === 1 ? 'category' : 'categories'}.</p>
                </div>
            `;
        }
        
        html += '</div>';
        html += '</div>';
        
        return html;
    };
    
    /**
     * Initialize budget chart
     * @param {Array} budgets - Budget objects
     * @param {Object} budgetStatuses - Budget statuses
     */
    const initializeBudgetChart = (budgets, budgetStatuses) => {
        if (budgets.length === 0 || !document.getElementById('budget-chart')) return;
        
        // Get current date range for this month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        // Get formatted data for chart using ChartComponent helper
        const budgetData = ChartComponent.getBudgetComparisonData(startOfMonth, endOfMonth);
        
        // Initialize the budget comparison chart
        ChartComponent.initBudgetComparisonChart('budget-chart', budgetData, {
            plugins: {
                title: {
                    display: true,
                    text: 'Budget vs. Actual Spending',
                    font: {
                        size: 16
                    }
                }
            }
        });
        
        // Log for debugging
        console.log('Budget chart initialized with data:', budgetData);
    };
    
    /**
     * Set up event listeners for budget page
     * @param {Array} budgets - Current budgets
     * @param {Array} categories - All available categories
     */
    const setupBudgetEventListeners = (budgets, categories) => {
        // Add budget button
        const addBudgetBtn = document.getElementById('add-budget-btn');
        if (addBudgetBtn) {
            addBudgetBtn.addEventListener('click', () => showBudgetModal());
        }
        
        // Edit budget buttons
        const editBtns = document.querySelectorAll('.edit-budget');
        editBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const budgetId = btn.getAttribute('data-budget-id');
                const budget = budgets.find(b => b.id === budgetId);
                if (budget) {
                    showBudgetModal(budget);
                }
            });
        });
        
        // Delete budget buttons
        const deleteBtns = document.querySelectorAll('.delete-budget');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const budgetId = btn.getAttribute('data-budget-id');
                if (confirm('Are you sure you want to delete this budget?')) {
                    DataService.deleteBudget(budgetId);
                    navigateToPage('budget'); // Refresh the page
                }
            });
        });
    };
    
    /**
     * Show budget creation/edit modal
     * @param {Object} budget - Existing budget for editing (null for new budget)
     */
    const showBudgetModal = (budget = null) => {
        const isEdit = budget !== null;
        const modalTitle = isEdit ? 'Edit Budget' : 'Create New Budget';
        
        // Get all expense categories for dropdown
        const expenseCategories = DataService.getAllExpenseCategories();
        
        let modalContent = `
            <form id="budget-form" class="form-container">
                <div class="form-group">
                    <label for="budget-category">Category</label>
                    <select id="budget-category" class="form-control" ${isEdit ? 'disabled' : ''} required>
                        ${isEdit ? `<option value="${budget.category}" selected>${budget.category}</option>` : 
                            `<option value="">Select a Category</option>
                            ${expenseCategories.map(category => 
                                `<option value="${category}" ${budget && budget.category === category ? 'selected' : ''}>${category}</option>`
                            ).join('')}`
                        }
                        <option value="new-category">+ Add New Category</option>
                    </select>
                    
                    <div id="new-category-group" class="form-group" style="display: none;">
                        <label for="new-category-name">New Category Name</label>
                        <input type="text" id="new-category-name" class="form-control" placeholder="Enter category name" maxlength="30">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="budget-amount">Budget Amount</label>
                    <input type="number" id="budget-amount" class="form-control" value="${budget ? budget.amount : ''}" 
                        min="0" step="0.01" placeholder="Enter amount" required>
                </div>
                
                <div class="form-group">
                    <label for="budget-period">Budget Period</label>
                    <select id="budget-period" class="form-control" required>
                        <option value="monthly" ${budget && budget.period === 'monthly' ? 'selected' : ''}>Monthly</option>
                        <option value="yearly" ${budget && budget.period === 'yearly' ? 'selected' : ''}>Yearly</option>
                        <option value="weekly" ${budget && budget.period === 'weekly' ? 'selected' : ''}>Weekly</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <h4>Alert Thresholds</h4>
                    <div class="alert-settings">
                        <div class="alert-item">
                            <label for="warning-threshold">Warning at (%)</label>
                            <input type="number" id="warning-threshold" class="form-control" 
                                value="${budget ? budget.alerts.warning : '75'}" min="1" max="100" required>
                        </div>
                        <div class="alert-item">
                            <label for="danger-threshold">Danger at (%)</label>
                            <input type="number" id="danger-threshold" class="form-control" 
                                value="${budget ? budget.alerts.danger : '90'}" min="1" max="100" required>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="enable-notifications" ${budget && budget.notifications ? 'checked' : ''}>
                        Enable notifications when approaching limits
                    </label>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-primary">${isEdit ? 'Update Budget' : 'Create Budget'}</button>
                    <button type="button" class="btn-secondary cancel-modal">Cancel</button>
                </div>
            </form>
        `;
        
        // Show the modal
        const customModal = document.createElement('div');
        customModal.id = 'budget-modal';
        customModal.className = 'modal';
        
        customModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${modalTitle}</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    ${modalContent}
                </div>
            </div>
        `;
        
        document.body.appendChild(customModal);
        customModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Set up category change event
        const categorySelect = document.getElementById('budget-category');
        const newCategoryGroup = document.getElementById('new-category-group');
        
        if (categorySelect) {
            categorySelect.addEventListener('change', () => {
                if (categorySelect.value === 'new-category') {
                    newCategoryGroup.style.display = 'block';
                } else {
                    newCategoryGroup.style.display = 'none';
                }
            });
        }
        
        // Set up form submission
        const budgetForm = document.getElementById('budget-form');
        if (budgetForm) {
            budgetForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form values
                let category = categorySelect.value;
                if (category === 'new-category') {
                    category = document.getElementById('new-category-name').value.trim();
                    if (!category) {
                        alert('Please enter a category name');
                        return;
                    }
                }
                
                const amount = parseFloat(document.getElementById('budget-amount').value);
                const period = document.getElementById('budget-period').value;
                const warningThreshold = parseInt(document.getElementById('warning-threshold').value);
                const dangerThreshold = parseInt(document.getElementById('danger-threshold').value);
                const enableNotifications = document.getElementById('enable-notifications').checked;
                
                // Validate thresholds
                if (warningThreshold >= dangerThreshold) {
                    alert('Warning threshold must be less than danger threshold');
                    return;
                }
                
                // Create budget data object
                const budgetData = {
                    category,
                    amount,
                    period,
                    alerts: {
                        warning: warningThreshold,
                        danger: dangerThreshold
                    },
                    notifications: enableNotifications
                };
                
                // Save the budget
                if (isEdit) {
                    DataService.updateBudget(budget.id, budgetData);
                } else {
                    DataService.addBudget(budgetData);
                }
                
                // Close modal and refresh
                customModal.classList.remove('active');
                document.body.style.overflow = '';
                document.body.removeChild(customModal);
                
                // Refresh the budget page
                navigateToPage('budget');
            });
        }
        
        // Close modal functionality
        const closeBtn = customModal.querySelector('.close-modal');
        const cancelBtn = customModal.querySelector('.cancel-modal');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                customModal.classList.remove('active');
                document.body.style.overflow = '';
                document.body.removeChild(customModal);
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                customModal.classList.remove('active');
                document.body.style.overflow = '';
                document.body.removeChild(customModal);
            });
        }
        
        // Close on outside click
        customModal.addEventListener('click', (e) => {
            if (e.target === customModal) {
                customModal.classList.remove('active');
                document.body.style.overflow = '';
                document.body.removeChild(customModal);
            }
        });
    };
    
    /**
     * Render the savings page
     */
    const renderSavingsPage = () => {
        // Implementation for savings page rendering would go here
        console.log('Savings page rendering would go here');
        if (elements.contentArea) {
            elements.contentArea.innerHTML = '<h1>Savings Page</h1><p>Savings goals would be implemented here.</p>';
        }
    };
    
    /**
     * Render the reports page
     */
    const renderReportsPage = () => {
        if (!elements.contentArea) return;
        
        let html = `
            <div class="reports-container-page">
                <h1 class="page-title">Financial Reports</h1>
                
                <div class="report-filters">
                    <div class="filter-group">
                        <label for="report-period">Period:</label>
                        <select id="report-period">
                            <option value="1month">Last Month</option>
                            <option value="3months">Last 3 Months</option>
                            <option value="6months" selected>Last 6 Months</option>
                            <option value="1year">Last Year</option>
                        </select>
                    </div>
                </div>
                
                <div class="reports-grid">
                    <div class="report-card">
                        <h3>Income vs Expenses</h3>
                        <canvas id="income-expense-chart" class="report-chart"></canvas>
                    </div>
                    
                    <div class="report-card">
                        <h3>Expense Categories</h3>
                        <canvas id="expense-categories-chart" class="report-chart"></canvas>
                    </div>
                    
                    <div class="report-card">
                        <h3>Monthly Trends</h3>
                        <canvas id="monthly-trends-chart" class="report-chart"></canvas>
                    </div>
                    
                    <div class="report-card">
                        <h3>Summary Statistics</h3>
                        <div id="summary-stats" class="stats-container">
                            <!-- Stats will be populated here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        elements.contentArea.innerHTML = html;
        
        // Generate reports
        generateReports();
        
        // Set up period filter
        const periodSelect = document.getElementById('report-period');
        if (periodSelect) {
            periodSelect.addEventListener('change', () => {
                generateReports();
            });
        }
    };
    
    /**
     * Generate financial reports and charts
     */
    const generateReports = () => {
        const period = document.getElementById('report-period')?.value || '6months';
        const data = getReportData(period);
        
        // Income vs Expenses Chart
        createIncomeExpenseChart(data);
        
        // Expense Categories Chart
        createExpenseCategoriesChart(data);
        
        // Monthly Trends Chart
        createMonthlyTrendsChart(data);
        
        // Summary Statistics
        createSummaryStats(data);
    };
    
    /**
     * Get report data for specified period
     */
    const getReportData = (period) => {
        const now = new Date();
        let startDate = new Date();
        
        switch (period) {
            case '1month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case '3months':
                startDate.setMonth(now.getMonth() - 3);
                break;
            case '6months':
                startDate.setMonth(now.getMonth() - 6);
                break;
            case '1year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
        }
        
        const incomes = StorageUtil.getItem('incomes') || [];
        const expenses = StorageUtil.getItem('expenses') || [];
        
        const filteredIncomes = incomes.filter(income => 
            new Date(income.date) >= startDate
        );
        
        const filteredExpenses = expenses.filter(expense => 
            new Date(expense.date) >= startDate
        );
        
        return { incomes: filteredIncomes, expenses: filteredExpenses, startDate, endDate: now };
    };
    
    /**
     * Create Income vs Expenses chart
     */
    const createIncomeExpenseChart = (data) => {
        const ctx = document.getElementById('income-expense-chart');
        if (!ctx) return;
        
        const totalIncome = data.incomes.reduce((sum, income) => sum + income.amount, 0);
        const totalExpenses = data.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Income', 'Expenses', 'Savings'],
                datasets: [{
                    data: [totalIncome, totalExpenses, Math.max(0, totalIncome - totalExpenses)],
                    backgroundColor: ['#4CAF50', '#F44336', '#2196F3'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    };
    
    /**
     * Create Expense Categories chart
     */
    const createExpenseCategoriesChart = (data) => {
        const ctx = document.getElementById('expense-categories-chart');
        if (!ctx) return;
        
        // Group expenses by category
        const categoryTotals = {};
        data.expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });
        
        const labels = Object.keys(categoryTotals);
        const amounts = Object.values(categoryTotals);
        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
        
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: amounts,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    };
    
    /**
     * Create Monthly Trends chart
     */
    const createMonthlyTrendsChart = (data) => {
        const ctx = document.getElementById('monthly-trends-chart');
        if (!ctx) return;
        
        // Group data by month
        const monthlyData = {};
        
        data.incomes.forEach(income => {
            const month = new Date(income.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
            if (!monthlyData[month]) monthlyData[month] = { income: 0, expenses: 0 };
            monthlyData[month].income += income.amount;
        });
        
        data.expenses.forEach(expense => {
            const month = new Date(expense.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
            if (!monthlyData[month]) monthlyData[month] = { income: 0, expenses: 0 };
            monthlyData[month].expenses += expense.amount;
        });
        
        const labels = Object.keys(monthlyData).sort();
        const incomeData = labels.map(month => monthlyData[month].income);
        const expenseData = labels.map(month => monthlyData[month].expenses);
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Income',
                        data: incomeData,
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Expenses',
                        data: expenseData,
                        borderColor: '#F44336',
                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };
    
    /**
     * Create Summary Statistics
     */
    const createSummaryStats = (data) => {
        const container = document.getElementById('summary-stats');
        if (!container) return;
        
        const totalIncome = data.incomes.reduce((sum, income) => sum + income.amount, 0);
        const totalExpenses = data.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const savings = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0;
        
        container.innerHTML = `
            <div class="stat-item">
                <h4>Total Income</h4>
                <div class="stat-value income">${formatCurrency(totalIncome)}</div>
            </div>
            <div class="stat-item">
                <h4>Total Expenses</h4>
                <div class="stat-value expense">${formatCurrency(totalExpenses)}</div>
            </div>
            <div class="stat-item">
                <h4>Net Savings</h4>
                <div class="stat-value ${savings >= 0 ? 'income' : 'expense'}">${formatCurrency(savings)}</div>
            </div>
            <div class="stat-item">
                <h4>Savings Rate</h4>
                <div class="stat-value">${savingsRate}%</div>
            </div>
        `;
    };
    
    /**
     * Render the settings page
     */
    const renderSettingsPage = () => {
        // Since we have static HTML for settings, we just need to set up event listeners
        // and sync the current settings with the UI
        updateSettingsUI();
        setupSettingsEventListeners();
    };
    
    /**
     * Update settings UI with current values
     */
    const updateSettingsUI = () => {
        // Update currency select
        const currencySelect = document.getElementById('currency');
        if (currencySelect) {
            currencySelect.value = appSettings.currency;
        }
        
        // Update theme buttons
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === appSettings.theme) {
                btn.classList.add('active');
            }
        });
    };
    
    /**
     * Set up event listeners for settings
     */
    const setupSettingsEventListeners = () => {
        // Currency change
        const currencySelect = document.getElementById('currency');
        if (currencySelect) {
            currencySelect.addEventListener('change', (e) => {
                appSettings.currency = e.target.value;
                saveSettings();
                showNotification('Currency updated successfully');
            });
        }
        
        // Theme buttons
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                appSettings.theme = theme;
                applyTheme(theme);
                saveSettings();
                
                // Update active state
                themeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                showNotification(`${theme.charAt(0).toUpperCase() + theme.slice(1)} theme applied`);
            });
        });
        
        // Data export
        const exportBtn = document.getElementById('export-data');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportData);
        }
        
        // Data import
        const importBtn = document.getElementById('import-data');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        importData(file);
                    }
                };
                input.click();
            });
        }
        
        // Clear data
        const clearBtn = document.getElementById('clear-data');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
                    clearAllData();
                    showNotification('All data cleared successfully');
                }
            });
        }
        
        // Save settings
        const saveBtn = document.getElementById('save-settings');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                saveSettings();
                showNotification('Settings saved successfully');
            });
        }
    };
    
    /**
     * Export user data
     */
    const exportData = () => {
        try {
            const data = {
                incomes: StorageUtil.getItem('incomes') || [],
                expenses: StorageUtil.getItem('expenses') || [],
                budgets: StorageUtil.getItem('budgets') || [],
                settings: appSettings,
                exportDate: new Date().toISOString()
            };
            
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `cashboard-data-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            showNotification('Data exported successfully');
        } catch (error) {
            console.error('Export error:', error);
            showNotification('Failed to export data', 'error');
        }
    };
    
    /**
     * Import user data
     */
    const importData = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.incomes) StorageUtil.setItem('incomes', data.incomes);
                if (data.expenses) StorageUtil.setItem('expenses', data.expenses);
                if (data.budgets) StorageUtil.setItem('budgets', data.budgets);
                if (data.settings) {
                    appSettings = { ...appSettings, ...data.settings };
                    saveSettings();
                    applyTheme(appSettings.theme);
                }
                
                showNotification('Data imported successfully');
                // Refresh the current page to show imported data
                renderPage(currentPage);
            } catch (error) {
                console.error('Import error:', error);
                showNotification('Failed to import data. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    /**
     * Clear all user data
     */
    /**
     * Clear all user data
     */
    const clearAllData = () => {
        StorageUtil.removeItem('incomes');
        StorageUtil.removeItem('expenses');
        StorageUtil.removeItem('budgets');
        
        // Reset to default settings
        appSettings = {
            currency: 'INR',
            theme: 'light',
            language: 'en'
        };
        saveSettings();
        applyTheme('light');
        
        // Refresh the current page
        renderPage(currentPage);
    };

    /**
     * Save application settings
     */
    const saveSettings = () => {
        StorageUtil.setItem('appSettings', appSettings);
    };

    /**
     * Apply theme to the application
     * @param {string} theme - The theme to apply ('light' or 'dark')
     */
    const applyTheme = (theme) => {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${theme}-theme`);
    };

    /**
     * Format currency based on current settings
     * @param {number} amount - The amount to format
     * @returns {string} Formatted currency string
     */
    const formatCurrency = (amount) => {
        const currency = appSettings.currency || 'INR';
        const symbols = {
            'USD': '$',
            'EUR': '€', 
            'GBP': '£',
            'JPY': '¥',
            'INR': '₹',
            'CAD': '$',
            'AUD': '$'
        };
        
        const symbol = symbols[currency] || currency;
        return `${symbol}${amount.toLocaleString()}`;
    };
    
    /**
     * Show notification to user
     */
    const showNotification = (message, type = 'success') => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'error' ? '#f44336' : '#4caf50'};
            color: white;
            border-radius: 4px;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    };

    // Public API
    return {
        init,
        navigateToPage,
        formatCurrency,
        showNotification
    };
})();

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);
