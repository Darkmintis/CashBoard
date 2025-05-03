/**
 * KashBoard Application
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
        console.log('Initializing KashBoard application...');
        
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
        
        console.log('KashBoard initialization complete');
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
            email: 'demo@kashboard.app',
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
        const allocations = KashBotService.generateAllocations(financialSummary, appSettings);
        const tips = KashBotService.generateTips(financialSummary, allocations);
        
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
                
                <div class="dashboard-sections">
                    <div class="section allocation-section">
                        <h2>KashBot Allocation</h2>
                        <div class="allocation-container">
                            ${renderAllocationChart(allocations)}
                        </div>
                    </div>
                    
                    <div class="section tips-section">
                        <h2>KashBot Tips</h2>
                        <div class="tips-container">
                            ${renderTips(tips)}
                        </div>
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
     * @returns {string} HTML for the allocation chart
     */
    const renderAllocationChart = (allocations) => {
        let html = '<div class="allocations">';
        
        // Create allocation bars
        Object.values(allocations).forEach(allocation => {
            const percentage = allocation.actualPercentage.toFixed(1);
            const targetPercentage = allocation.targetPercentage;
            const statusClass = allocation.status;
            
            html += `
                <div class="allocation-item ${statusClass}">
                    <div class="allocation-label">
                        <span class="name">${allocation.name}</span>
                        <span class="percentage">${percentage}%</span>
                    </div>
                    <div class="allocation-bar-container">
                        <div class="allocation-bar" style="width: ${percentage}%"></div>
                        <div class="target-marker" style="left: ${targetPercentage}%" title="Target: ${targetPercentage}%"></div>
                    </div>
                    <div class="allocation-details">
                        <span class="actual">${formatCurrency(allocation.actualAmount)}</span>
                        <span class="target">Target: ${formatCurrency(allocation.targetAmount)}</span>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    };
    
    /**
     * Render financial tips
     * @param {Array} tips - Array of tip objects
     * @returns {string} HTML for the tips section
     */
    const renderTips = (tips) => {
        if (!tips || tips.length === 0) {
            return '<p>No tips available at this time.</p>';
        }
        
        let html = '<ul class="tips-list">';
        
        tips.forEach(tip => {
            html += `
                <li class="tip-item ${tip.category}">
                    <span class="tip-icon"></span>
                    <p>${tip.text}</p>
                </li>
            `;
        });
        
        html += '</ul>';
        return html;
    };
    
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
        // Implementation for reports page rendering would go here
        console.log('Reports page rendering would go here');
        if (elements.contentArea) {
            elements.contentArea.innerHTML = '<h1>Reports Page</h1><p>Financial reports would be implemented here.</p>';
        }
    };
    
    /**
     * Render the settings page
     */
    const renderSettingsPage = () => {
        if (!elements.contentArea) return;
        
        let html = `
            <div class="settings-container">
                <h1 class="page-title">Settings</h1>
                
                <div class="settings-section">
                    <h2>General Settings</h2>
                    
                    <div class="setting-item">
                        <label for="currency-setting">Currency</label>
                        <select id="currency-setting" class="setting-input">
                            <option value="USD" ${appSettings.currency === 'USD' ? 'selected' : ''}>USD ($)</option>
                            <option value="EUR" ${appSettings.currency === 'EUR' ? 'selected' : ''}>EUR (€)</option>
                            <option value="GBP" ${appSettings.currency === 'GBP' ? 'selected' : ''}>GBP (£)</option>
                            <option value="JPY" ${appSettings.currency === 'JPY' ? 'selected' : ''}>JPY (¥)</option>
                            <option value="CNY" ${appSettings.currency === 'CNY' ? 'selected' : ''}>CNY (¥)</option>
                            <option value="INR" ${appSettings.currency === 'INR' ? 'selected' : ''}>INR (₹)</option>
                        </select>
                    </div>
                    
                    <div class="setting-item">
                        <label for="theme-setting">Theme</label>
                        <div class="theme-selector">
                            <button id="theme-light" class="theme-button ${appSettings.theme === 'light' ? 'active' : ''}">Light</button>
                            <button id="theme-dark" class="theme-button ${appSettings.theme === 'dark' ? 'active' : ''}">Dark</button>
                        </div>
                    </div>
                    
                    <div class="setting-item">
                        <label for="notifications-setting">Notifications</label>
                        <div class="toggle-switch">
                            <input type="checkbox" id="notifications-setting" ${appSettings.notificationsEnabled ? 'checked' : ''}>
                            <label for="notifications-setting"></label>
                        </div>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h2>Financial Settings</h2>
                    
                    <div class="setting-item">
                        <label for="savings-target">Savings Target (%)</label>
                        <input type="range" id="savings-target" min="5" max="50" step="1" value="${appSettings.savingsTarget}" class="setting-input">
                        <span id="savings-target-value">${appSettings.savingsTarget}%</span>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h2>Data Management</h2>
                    
                    <div class="setting-item">
                        <button id="export-data" class="action-button">Export Data</button>
                        <button id="import-data" class="action-button">Import Data</button>
                    </div>
                    
                    <div class="setting-item">
                        <button id="reset-data" class="danger-button">Reset All Data</button>
                    </div>
                </div>
                
                <div class="settings-actions">
                    <button id="save-settings" class="primary-button">Save Settings</button>
                </div>
            </div>
        `;
        
        elements.contentArea.innerHTML = html;
        
        // Set up event listeners for settings
        const saveSettingsBtn = document.getElementById('save-settings');
        const currencySetting = document.getElementById('currency-setting');
        const themeLight = document.getElementById('theme-light');
        const themeDark = document.getElementById('theme-dark');
        const notificationsSetting = document.getElementById('notifications-setting');
        const savingsTarget = document.getElementById('savings-target');
        const savingsTargetValue = document.getElementById('savings-target-value');
        const exportDataBtn = document.getElementById('export-data');
        const importDataBtn = document.getElementById('import-data');
        const resetDataBtn = document.getElementById('reset-data');
        
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                // Save all settings
                if (currencySetting) appSettings.currency = currencySetting.value;
                if (notificationsSetting) appSettings.notificationsEnabled = notificationsSetting.checked;
                if (savingsTarget) appSettings.savingsTarget = parseInt(savingsTarget.value);
                
                saveSettings();
                alert('Settings saved successfully!');
            });
        }
        
        if (themeLight) {
            themeLight.addEventListener('click', () => {
                themeLight.classList.add('active');
                if (themeDark) themeDark.classList.remove('active');
                appSettings.theme = 'light';
                applyTheme('light');
            });
        }
        
        if (themeDark) {
            themeDark.addEventListener('click', () => {
                themeDark.classList.add('active');
                if (themeLight) themeLight.classList.remove('active');
                appSettings.theme = 'dark';
                applyTheme('dark');
            });
        }
        
        if (savingsTarget && savingsTargetValue) {
            savingsTarget.addEventListener('input', () => {
                savingsTargetValue.textContent = `${savingsTarget.value}%`;
            });
        }
        
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', exportAppData);
        }
        
        if (importDataBtn) {
            importDataBtn.addEventListener('click', importAppData);
        }
        
        if (resetDataBtn) {
            resetDataBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                    resetAllData();
                }
            });
        }
    };
    
    /**
     * Export application data
     */
    const exportAppData = () => {
        const allData = {
            appSettings: appSettings,
            user: currentUser,
            incomeData: StorageUtil.getItem('incomeData'),
            expenseData: StorageUtil.getItem('expenseData'),
            savingsGoals: StorageUtil.getItem('savingsGoals'),
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(allData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const dataUrl = URL.createObjectURL(dataBlob);
        
        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = dataUrl;
        downloadLink.download = `kashboard-export-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };
    
    /**
     * Import application data
     */
    const importAppData = () => {
        // Create a file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'application/json';
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedData = JSON.parse(event.target.result);
                    
                    // Validate data format
                    if (!importedData.appSettings || !importedData.user) {
                        throw new Error('Invalid data format');
                    }
                    
                    // Import the data
                    appSettings = importedData.appSettings;
                    currentUser = importedData.user;
                    
                    if (importedData.incomeData) StorageUtil.setItem('incomeData', importedData.incomeData);
                    if (importedData.expenseData) StorageUtil.setItem('expenseData', importedData.expenseData);
                    if (importedData.savingsGoals) StorageUtil.setItem('savingsGoals', importedData.savingsGoals);
                    
                    StorageUtil.setItem('appSettings', appSettings);
                    StorageUtil.setItem('currentUser', currentUser);
                    
                    alert('Data imported successfully! The application will reload.');
                    window.location.reload();
                } catch (err) {
                    alert(`Error importing data: ${err.message}`);
                }
            };
            
            reader.readAsText(file);
        });
        
        // Trigger the file input dialog
        fileInput.click();
    };
    
    /**
     * Reset all application data
     */
    const resetAllData = () => {
        StorageUtil.clear();
        alert('All data has been reset. The application will reload.');
        window.location.reload();
    };
    
    /**
     * Save application settings
     */
    const saveSettings = () => {
        StorageUtil.setItem('appSettings', appSettings);
        updateSettingsUI();
    };
    
    /**
     * Update UI based on settings
     */
    const updateSettingsUI = () => {
        // Update currency selector
        if (elements.currencySelector) {
            elements.currencySelector.value = appSettings.currency;
        }
        
        // Update notification bell
        if (elements.notificationBell) {
            elements.notificationBell.classList.toggle('active', appSettings.notificationsEnabled);
        }
        
        // Apply theme
        applyTheme(appSettings.theme);
    };
    
    /**
     * Apply theme to the application
     * @param {string} theme - The theme to apply ('light' or 'dark')
     */
    const applyTheme = (theme) => {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${theme}-theme`);
        
        // Update theme toggle if it exists
        if (elements.themeToggle) {
            elements.themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
        }
    };
    
    /**
     * Update the user profile UI
     */
    const updateUserProfileUI = () => {
        if (!elements.userProfileArea || !currentUser) return;
        
        elements.userProfileArea.innerHTML = `
            <img src="${currentUser.avatar}" alt="${currentUser.name}" class="user-avatar">
            <span class="user-name">${currentUser.name}</span>
        `;
    };
    
    /**
     * Update date display
     */
    const updateDateDisplay = () => {
        if (!elements.dateDisplay) return;
        
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        elements.dateDisplay.textContent = now.toLocaleDateString('en-US', options);
    };
    
    /**
     * Format currency based on current settings
     * @param {number} amount - The amount to format
     * @returns {string} Formatted currency string
     */
    const formatCurrency = (amount) => {
        const currency = appSettings.currency || 'USD';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };
    
    // Public API
    return {
        init,
        navigateToPage,
        formatCurrency
    };
})();

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);

/**
 * KashBoard - Main Application
 * Initializes components and handles application-wide functionality
 */

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('KashBoard App initializing...');
    
    // Initialize UI components
    initNavigation();
    initModals();
    initToasts();
    
    // Check if first time setup is needed
    const settings = StorageUtil.getData(StorageUtil.KEYS.SETTINGS);
    if (settings && settings.firstTimeSetup) {
        showFirstTimeSetup();
    }
    
    // Apply theme based on settings
    applyTheme();
});

/**
 * Initialize navigation between sections
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('main > section');
    
    // Handle navigation click
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get target section id from href
            const targetId = this.getAttribute('href').substring(1);
            
            // Remove active class from all links and sections
            navLinks.forEach(link => link.classList.remove('active'));
            sections.forEach(section => section.classList.remove('section-active'));
            
            // Add active class to clicked link and target section
            this.classList.add('active');
            document.getElementById(targetId).classList.add('section-active');
            
            // Update URL hash without scrolling
            history.pushState(null, null, '#' + targetId);
        });
    });
    
    // Handle direct navigation from URL hash
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetLink = document.querySelector(`nav ul li a[href="#${targetId}"]`);
        if (targetLink) {
            targetLink.click();
        }
    }
}

/**
 * Initialize modal functionality
 */
function initModals() {
    // Get all modal elements
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('[data-target]');
    const closeButtons = document.querySelectorAll('.close-modal, .cancel-modal');
    
    // Open modal when trigger is clicked
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const targetModal = document.getElementById(this.dataset.target);
            if (targetModal) {
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    });
    
    // Close modal when close button is clicked
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    });
    
    // Close modal when clicking outside of modal content
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close modal on Escape key press
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    });
}

/**
 * Initialize toast notifications
 */
function initToasts() {
    // Toast container should already exist in the HTML
    if (!document.getElementById('toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
}

/**
 * Show a toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type: success, error, warning, info
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.getElementById('toast-container');
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Set toast content
    toast.innerHTML = `
        <div class="toast-header">
            <span class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
            <button type="button" class="toast-close">&times;</button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Show toast with animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Setup auto removal after duration
    const timeout = setTimeout(() => {
        removeToast(toast);
    }, duration);
    
    // Close button functionality
    const closeButton = toast.querySelector('.toast-close');
    closeButton.addEventListener('click', () => {
        clearTimeout(timeout);
        removeToast(toast);
    });
}

/**
 * Remove a toast with animation
 * @param {HTMLElement} toast - Toast element to remove
 */
function removeToast(toast) {
    toast.classList.add('hiding');
    toast.classList.remove('show');
    
    // Remove from DOM after animation completes
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

/**
 * Show first time setup guidance
 */
function showFirstTimeSetup() {
    const welcomeMessage = `
        <div class="welcome-message">
            <h3>Welcome to KashBoard!</h3>
            <p>Your personal finance dashboard is ready to use. Here's how to get started:</p>
            <ol>
                <li>Add your income sources</li>
                <li>Track your expenses</li>
                <li>View the auto-generated budget suggestions</li>
                <li>Explore the reports section for insights</li>
            </ol>
            <p>All your data stays on your device - we respect your privacy!</p>
        </div>
    `;
    
    showModal('Welcome', welcomeMessage, () => {
        // Update settings to mark first time setup as complete
        const settings = StorageUtil.getData(StorageUtil.KEYS.SETTINGS, StorageUtil.DEFAULT_SETTINGS);
        settings.firstTimeSetup = false;
        StorageUtil.saveData(StorageUtil.KEYS.SETTINGS, settings);
    });
}

/**
 * Show a custom modal
 * @param {string} title - Modal title
 * @param {string} content - Modal content (HTML)
 * @param {Function} onClose - Callback when modal is closed
 */
function showModal(title, content, onClose = null) {
    // Check if custom modal already exists
    let customModal = document.getElementById('custom-modal');
    
    // Create modal if it doesn't exist
    if (!customModal) {
        customModal = document.createElement('div');
        customModal.id = 'custom-modal';
        customModal.className = 'modal';
        
        customModal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3 id="custom-modal-title"></h3>
                <div id="custom-modal-content"></div>
                <div class="form-actions">
                    <button type="button" class="btn-primary" id="custom-modal-ok">OK</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(customModal);
        
        // Setup close button
        const closeBtn = customModal.querySelector('.close-modal');
        const okBtn = customModal.querySelector('#custom-modal-ok');
        
        closeBtn.addEventListener('click', () => {
            customModal.classList.remove('active');
            document.body.style.overflow = '';
            if (onClose) onClose();
        });
        
        okBtn.addEventListener('click', () => {
            customModal.classList.remove('active');
            document.body.style.overflow = '';
            if (onClose) onClose();
        });
        
        // Close modal when clicking outside content
        customModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = '';
                if (onClose) onClose();
            }
        });
    }
    
    // Update modal content
    document.getElementById('custom-modal-title').textContent = title;
    document.getElementById('custom-modal-content').innerHTML = content;
    
    // Show modal
    customModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Apply theme based on user settings
 */
function applyTheme() {
    const settings = StorageUtil.getData(StorageUtil.KEYS.SETTINGS, StorageUtil.DEFAULT_SETTINGS);
    const { theme } = settings;
    
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else if (theme === 'system') {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        
        // Listen for changes in system preference
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        });
    }
}

// Export functions for other modules to use
window.KashBoard = {
    showToast,
    showModal,
    applyTheme
};