/**
 * KashBoard Charts Component
 * Handles chart rendering and visualization
 */

const ChartComponent = (function() {
    // Chart instances
    const chartInstances = {};
    
    /**
     * Initialize income vs expenses chart
     * @param {string} elementId - Canvas element ID
     * @param {Array} data - Chart data
     * @param {Object} options - Chart options
     */
    function initIncomeExpenseChart(elementId, data, options = {}) {
        const ctx = document.getElementById(elementId)?.getContext('2d');
        if (!ctx) return null;
        
        // Destroy existing chart if it exists
        if (chartInstances[elementId]) {
            chartInstances[elementId].destroy();
        }
        
        // Default data if not provided
        const chartData = data || {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            income: [0, 0, 0, 0, 0, 0],
            expenses: [0, 0, 0, 0, 0, 0]
        };
        
        // Create chart
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: 'Income',
                        backgroundColor: 'rgba(76, 175, 80, 0.6)',
                        borderColor: 'rgba(76, 175, 80, 1)',
                        borderWidth: 1,
                        data: chartData.income,
                        barPercentage: 0.6
                    },
                    {
                        label: 'Expenses',
                        backgroundColor: 'rgba(244, 67, 54, 0.6)',
                        borderColor: 'rgba(244, 67, 54, 1)',
                        borderWidth: 1,
                        data: chartData.expenses,
                        barPercentage: 0.6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                const settings = StorageUtil.getData(StorageUtil.KEYS.SETTINGS, StorageUtil.DEFAULT_SETTINGS);
                                const currencySymbol = settings.currencySymbol || '₹';
                                if (context.parsed.y !== null) {
                                    label += currencySymbol + context.parsed.y.toFixed(2);
                                }
                                return label;
                            }
                        }
                    }
                },
                ...options
            }
        });
        
        // Store chart instance
        chartInstances[elementId] = chart;
        
        return chart;
    }
    
    /**
     * Initialize expense breakdown pie chart
     * @param {string} elementId - Canvas element ID
     * @param {Object} data - Chart data
     * @param {Object} options - Chart options
     */
    function initExpenseBreakdownChart(elementId, data, options = {}) {
        const ctx = document.getElementById(elementId)?.getContext('2d');
        if (!ctx) return null;
        
        // Destroy existing chart if it exists
        if (chartInstances[elementId]) {
            chartInstances[elementId].destroy();
        }
        
        // Default data if not provided
        const chartData = data || {
            labels: ['Food', 'Housing', 'Transport', 'Utilities', 'Entertainment', 'Other'],
            values: [25, 35, 15, 10, 5, 10]
        };
        
        // Color palette for categories
        const colorPalette = [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(199, 199, 199, 0.8)',
            'rgba(83, 102, 255, 0.8)',
            'rgba(40, 159, 64, 0.8)',
            'rgba(210, 199, 199, 0.8)'
        ];
        
        // Create chart
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: chartData.labels,
                datasets: [{
                    data: chartData.values,
                    backgroundColor: colorPalette.slice(0, chartData.labels.length),
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        align: 'start'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                const settings = StorageUtil.getData(StorageUtil.KEYS.SETTINGS, StorageUtil.DEFAULT_SETTINGS);
                                const currencySymbol = settings.currencySymbol || '₹';
                                return `${label}: ${currencySymbol}${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                ...options
            }
        });
        
        // Store chart instance
        chartInstances[elementId] = chart;
        
        return chart;
    }
    
    /**
     * Initialize savings progress chart
     * @param {string} elementId - Canvas element ID
     * @param {Object} data - Chart data
     * @param {Object} options - Chart options
     */
    function initSavingsProgressChart(elementId, data, options = {}) {
        const ctx = document.getElementById(elementId)?.getContext('2d');
        if (!ctx) return null;
        
        // Destroy existing chart if it exists
        if (chartInstances[elementId]) {
            chartInstances[elementId].destroy();
        }
        
        // Default data if not provided
        const chartData = data || {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            actual: [0, 0, 0, 0, 0, 0],
            target: [0, 0, 0, 0, 0, 0]
        };
        
        // Create chart
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: 'Actual Savings',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderColor: 'rgba(76, 175, 80, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(76, 175, 80, 1)',
                        pointRadius: 4,
                        data: chartData.actual,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Target Savings',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                        pointRadius: 4,
                        data: chartData.target,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                const settings = StorageUtil.getData(StorageUtil.KEYS.SETTINGS, StorageUtil.DEFAULT_SETTINGS);
                                const currencySymbol = settings.currencySymbol || '₹';
                                if (context.parsed.y !== null) {
                                    label += currencySymbol + context.parsed.y.toFixed(2);
                                }
                                return label;
                            }
                        }
                    }
                },
                ...options
            }
        });
        
        // Store chart instance
        chartInstances[elementId] = chart;
        
        return chart;
    }
    
    /**
     * Initialize budget vs actual spending chart
     * @param {string} elementId - Canvas element ID
     * @param {Object} data - Chart data
     * @param {Object} options - Chart options
     */
    function initBudgetComparisonChart(elementId, data, options = {}) {
        const ctx = document.getElementById(elementId)?.getContext('2d');
        if (!ctx) return null;
        
        // Destroy existing chart if it exists
        if (chartInstances[elementId]) {
            chartInstances[elementId].destroy();
        }
        
        // Default data if not provided
        const chartData = data || {
            labels: ['Housing', 'Food', 'Transport', 'Utilities', 'Entertainment'],
            budget: [1000, 500, 300, 200, 150],
            actual: [950, 470, 310, 190, 200]
        };
        
        // Create chart
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: 'Budget',
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        data: chartData.budget,
                        barPercentage: 0.7
                    },
                    {
                        label: 'Actual',
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        data: chartData.actual,
                        barPercentage: 0.7
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                const settings = StorageUtil.getData(StorageUtil.KEYS.SETTINGS, StorageUtil.DEFAULT_SETTINGS);
                                const currencySymbol = settings.currencySymbol || '₹';
                                if (context.parsed.y !== null) {
                                    label += currencySymbol + context.parsed.y.toFixed(2);
                                }
                                return label;
                            }
                        }
                    }
                },
                ...options
            }
        });
        
        // Store chart instance
        chartInstances[elementId] = chart;
        
        return chart;
    }
    
    /**
     * Update chart data
     * @param {string} elementId - Canvas element ID
     * @param {Object} newData - New chart data
     */
    function updateChartData(elementId, newData) {
        const chart = chartInstances[elementId];
        if (!chart) return;
        
        // Update labels if provided
        if (newData.labels) {
            chart.data.labels = newData.labels;
        }
        
        // Update datasets if provided
        if (newData.datasets) {
            chart.data.datasets = newData.datasets;
        } else {
            // Handle specific chart types
            if (chart.config.type === 'bar' && (newData.income || newData.expenses || newData.budget || newData.actual)) {
                if (newData.income) chart.data.datasets[0].data = newData.income;
                if (newData.expenses) chart.data.datasets[1].data = newData.expenses;
                if (newData.budget) chart.data.datasets[0].data = newData.budget;
                if (newData.actual) chart.data.datasets[1].data = newData.actual;
            } else if (chart.config.type === 'doughnut' && newData.values) {
                chart.data.datasets[0].data = newData.values;
            } else if (chart.config.type === 'line') {
                if (newData.actual) chart.data.datasets[0].data = newData.actual;
                if (newData.target) chart.data.datasets[1].data = newData.target;
            }
        }
        
        // Update chart
        chart.update();
    }
    
    /**
     * Get monthly data for chart display
     * @param {number} months - Number of months to include
     * @returns {Object} Formatted data for charts
     */
    function getMonthlyChartData(months = 6) {
        // Calculate date range
        const today = new Date();
        const labels = [];
        const incomeData = [];
        const expenseData = [];
        
        // Generate data for each month
        for (let i = months - 1; i >= 0; i--) {
            // Calculate month and year
            const month = new Date();
            month.setMonth(today.getMonth() - i);
            
            // Format month label
            const monthLabel = month.toLocaleString('default', { month: 'short' });
            const yearLabel = month.getFullYear();
            labels.push(`${monthLabel} ${yearLabel}`);
            
            // Calculate date range for this month
            const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
            const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
            
            // Get income and expenses for this month
            const income = DataService.getTotalIncome(startDate, endDate);
            const expenses = DataService.getTotalExpenses(startDate, endDate);
            
            incomeData.push(income);
            expenseData.push(expenses);
        }
        
        return {
            labels,
            income: incomeData,
            expenses: expenseData
        };
    }
    
    /**
     * Get expense breakdown data for chart display
     * @param {Date} startDate - Start date for data range
     * @param {Date} endDate - End date for data range
     * @returns {Object} Formatted data for expense breakdown chart
     */
    function getExpenseBreakdownData(startDate = null, endDate = null) {
        // Get expense breakdown from data service
        const breakdown = DataService.getExpenseBreakdown(startDate, endDate);
        
        // Format data for chart
        const labels = [];
        const values = [];
        
        // Sort categories by amount
        const sortedCategories = Object.entries(breakdown)
            .sort((a, b) => b[1].amount - a[1].amount);
        
        // Get top categories (limit to 8 for better visualization)
        const topCategories = sortedCategories.slice(0, 8);
        
        // Format data
        topCategories.forEach(([category, data]) => {
            labels.push(data.name || category);
            values.push(data.amount);
        });
        
        // If there are more than 8 categories, add "Other"
        if (sortedCategories.length > 8) {
            const otherAmount = sortedCategories
                .slice(8)
                .reduce((sum, [, data]) => sum + data.amount, 0);
            
            labels.push('Other');
            values.push(otherAmount);
        }
        
        return {
            labels,
            values
        };
    }
    
    /**
     * Get budget comparison data for chart display
     * @param {Date} startDate - Start date for data range
     * @param {Date} endDate - End date for data range
     * @returns {Object} Formatted data for budget comparison chart
     */
    function getBudgetComparisonData(startDate = null, endDate = null) {
        // Get all budgets
        const budgets = DataService.getAllBudgets();
        
        // Calculate actual spending for each budget category
        const budgetData = {
            labels: [],
            budget: [],
            actual: []
        };
        
        // Process each budget
        budgets.forEach(budget => {
            // Skip inactive budgets
            if (!budget.isActive) return;
            
            // Add budget category to labels
            budgetData.labels.push(budget.category);
            
            // Add budget amount
            budgetData.budget.push(budget.amount);
            
            // Calculate actual spending for this category
            const expensesByCategory = DataService.getExpensesByCategory(startDate, endDate);
            const actualSpending = expensesByCategory[budget.category] || 0;
            budgetData.actual.push(actualSpending);
        });
        
        return budgetData;
    }
    
    // Public API
    return {
        initIncomeExpenseChart,
        initExpenseBreakdownChart,
        initSavingsProgressChart,
        initBudgetComparisonChart,
        updateChartData,
        getMonthlyChartData,
        getExpenseBreakdownData,
        getBudgetComparisonData
    };
})();