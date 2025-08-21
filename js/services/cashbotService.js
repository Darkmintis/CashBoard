/**
 * CashBot Service
 * Smart financial allocation engine for CashBoard
 */

const CashBotService = (function() {
    // Default allocation percentages
    const DEFAULT_ALLOCATIONS = {
        savings: 20,
        investment: 10,
        emergency: 5,
        leisure: 5
    };
    
    // Financial tips by situation
    const FINANCIAL_TIPS = {
        noIncome: [
            "You haven't recorded any income yet. Start by adding your income sources to get personalized insights.",
            "Track your expenses to understand your spending patterns even before adding income."
        ],
        noExpenses: [
            "You haven't recorded any expenses yet. Add your expenses to get a complete financial picture.",
            "Setting up budget categories can help you plan your spending before recording expenses."
        ],
        highExpenses: [
            "Your expenses are higher than your income. Consider reducing non-essential spending.",
            "Review your largest expense categories for potential savings opportunities.",
            "Consider setting up an emergency fund to handle unexpected expenses."
        ],
        lowSavings: [
            "Your savings rate is lower than recommended. Try to save at least 20% of your income.",
            "Small, regular contributions to savings add up over time.",
            "Consider automating your savings by setting aside money as soon as you receive income."
        ],
        goodSavings: [
            "Great job on your savings! You're on track to meet your financial goals.",
            "Consider investing some of your savings for potential higher returns.",
            "Diversifying your savings into different accounts can maximize your returns."
        ],
        excellent: [
            "Excellent financial management! Your spending is well under control.",
            "Consider increasing your investments to make your money work harder for you.",
            "You're in a good position to increase your emergency fund or retirement contributions."
        ]
    };
    
    /**
     * Get settings for smart allocation
     * @returns {Object} Allocation settings
     */
    function getAllocationSettings() {
        const settings = StorageUtil.getData(StorageUtil.KEYS.SETTINGS, StorageUtil.DEFAULT_SETTINGS);
        return {
            savings: settings.savingsTarget || DEFAULT_ALLOCATIONS.savings,
            investment: DEFAULT_ALLOCATIONS.investment,
            emergency: DEFAULT_ALLOCATIONS.emergency,
            leisure: DEFAULT_ALLOCATIONS.leisure
        };
    }
    
    /**
     * Calculate smart allocations based on income
     * @param {number} income - Total income amount
     * @returns {Object} Allocation amounts
     */
    function calculateAllocations(income) {
        const allocations = getAllocationSettings();
        
        return {
            savings: (income * allocations.savings) / 100,
            investment: (income * allocations.investment) / 100,
            emergency: (income * allocations.emergency) / 100,
            leisure: (income * allocations.leisure) / 100
        };
    }
    
    /**
     * Analyze financial health based on income and expenses
     * @param {Object} summary - Monthly summary data
     * @returns {Object} Financial health assessment
     */
    function analyzeFinancialHealth(summary) {
        const { totalIncome, totalExpenses, balance, savingsRate } = summary;
        
        // Initialize result object
        const result = {
            status: 'healthy', // healthy, warning, danger
            score: 0, // 0-100
            recommendations: []
        };
        
        // No income recorded
        if (totalIncome <= 0) {
            result.status = 'warning';
            result.score = 50;
            result.recommendations.push(FINANCIAL_TIPS.noIncome[0]);
            return result;
        }
        
        // No expenses recorded but income exists
        if (totalExpenses <= 0 && totalIncome > 0) {
            result.status = 'warning';
            result.score = 60;
            result.recommendations.push(FINANCIAL_TIPS.noExpenses[0]);
            return result;
        }
        
        // Expenses higher than income
        if (totalExpenses > totalIncome) {
            result.status = 'danger';
            result.score = 30;
            result.recommendations.push(FINANCIAL_TIPS.highExpenses[0]);
            result.recommendations.push(FINANCIAL_TIPS.highExpenses[1]);
            return result;
        }
        
        // Calculate financial health score
        // Based on savings rate, expense ratio, and income level
        const expenseRatio = totalExpenses / totalIncome;
        
        // Better savings rate improves score
        let savingsScore = Math.min(savingsRate * 2, 50);
        
        // Lower expense ratio improves score
        let expenseScore = Math.max(0, 50 - (expenseRatio * 50));
        
        // Calculate final score
        result.score = Math.round(savingsScore + expenseScore);
        
        // Determine status and recommendations
        if (result.score >= 80) {
            result.status = 'healthy';
            result.recommendations.push(FINANCIAL_TIPS.excellent[0]);
            result.recommendations.push(FINANCIAL_TIPS.excellent[1]);
        } else if (result.score >= 60) {
            result.status = 'healthy';
            result.recommendations.push(FINANCIAL_TIPS.goodSavings[0]);
        } else if (result.score >= 40) {
            result.status = 'warning';
            result.recommendations.push(FINANCIAL_TIPS.lowSavings[0]);
            result.recommendations.push(FINANCIAL_TIPS.lowSavings[1]);
        } else {
            result.status = 'danger';
            result.recommendations.push(FINANCIAL_TIPS.highExpenses[0]);
            result.recommendations.push(FINANCIAL_TIPS.highExpenses[2]);
        }
        
        return result;
    }
    
    /**
     * Get personalized financial tip based on financial health
     * @param {Object} healthData - Financial health data
     * @returns {Object} Financial tip object with message and type
     */
    function getFinancialTip(healthData) {
        const { status, recommendations } = healthData;
        
        // No recommendations available
        if (!recommendations || recommendations.length === 0) {
            return {
                message: "Add your income and expenses to get personalized financial insights.",
                type: "info"
            };
        }
        
        // Get a random recommendation
        const randomIndex = Math.floor(Math.random() * recommendations.length);
        const message = recommendations[randomIndex];
        
        return {
            message,
            type: status === 'healthy' ? 'success' : status
        };
    }
    
    /**
     * Get expense categories that are over budget
     * @param {Object} summary - Monthly summary
     * @param {Object} budgets - Budget data by category
     * @returns {Array} Over-budget categories
     */
    function getOverBudgetCategories(summary, budgets) {
        const overBudget = [];
        const { expensesByCategory } = summary;
        
        // Compare each expense category with its budget
        for (const category in expensesByCategory) {
            const spent = expensesByCategory[category];
            const budget = budgets[category] || 0;
            
            // Skip if no budget set for this category
            if (budget === 0) continue;
            
            // Calculate percentage spent
            const percentSpent = (spent / budget) * 100;
            
            if (percentSpent >= 100) {
                overBudget.push({
                    category,
                    budget,
                    spent,
                    percentSpent,
                    overage: spent - budget
                });
            }
        }
        
        // Sort by percentage overspent
        return overBudget.sort((a, b) => b.percentSpent - a.percentSpent);
    }
    
    /**
     * Optimize budget allocations based on spending patterns
     * @param {Object} summary - Monthly summary
     * @returns {Object} Budget recommendations
     */
    function optimizeBudget(summary) {
        const { totalIncome, totalExpenses, expensesByCategory } = summary;
        
        // Can't optimize without income or expenses
        if (totalIncome <= 0 || totalExpenses <= 0) {
            return null;
        }
        
        // Get current budget allocations if any
        const currentBudgets = DataService.getBudgetByCategory();
        
        // Calculate optimized budget based on actual spending patterns
        // but adjusted to ensure savings target is met
        const settings = StorageUtil.getData(StorageUtil.KEYS.SETTINGS, StorageUtil.DEFAULT_SETTINGS);
        const targetSavingsRate = settings.savingsTarget / 100;
        const targetSavingsAmount = totalIncome * targetSavingsRate;
        const targetTotalExpenses = totalIncome - targetSavingsAmount;
        
        // Factor to adjust expenses to meet savings goal
        const adjustmentFactor = totalExpenses > targetTotalExpenses 
            ? targetTotalExpenses / totalExpenses 
            : 1;
        
        // Create optimized budget
        const optimizedBudget = {};
        for (const category in expensesByCategory) {
            const currentSpending = expensesByCategory[category];
            // Slightly increase budget from actual spending to give wiggle room
            // but apply adjustment factor to meet savings goals
            optimizedBudget[category] = Math.round(currentSpending * adjustmentFactor * 1.1);
        }
        
        return {
            currentBudgets,
            optimizedBudget,
            recommendedSavings: targetSavingsAmount
        };
    }
    
    // Public API
    return {
        calculateAllocations,
        analyzeFinancialHealth,
        getFinancialTip,
        getOverBudgetCategories,
        optimizeBudget
    };
})();
