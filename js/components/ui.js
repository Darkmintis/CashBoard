/**
 * CashBoard UI Component
 * Handles UI-related functionality and interactions
 */

const UIComponent = (function() {
    /**
     * Initialize UI component
     */
    function init() {
        // Setup date range selector
        setupDateRangeSelector();
        
        // Setup modal forms
        setupIncomeForm();
        setupExpenseForm();
        
        // Setup search and filter functionality
        setupTableFilters();
    }
    
    /**
     * Setup date range selector in the dashboard
     */
    function setupDateRangeSelector() {
        const prevMonthBtn = document.getElementById('prev-month');
        const nextMonthBtn = document.getElementById('next-month');
        const currentPeriodElem = document.getElementById('current-period');
        
        if (!prevMonthBtn || !nextMonthBtn || !currentPeriodElem) return;
        
        // Store the current view date
        let viewDate = new Date();
        
        // Update the period display
        function updatePeriodDisplay() {
            const monthName = viewDate.toLocaleString('default', { month: 'long' });
            const year = viewDate.getFullYear();
            currentPeriodElem.textContent = `${monthName} ${year}`;
            
            // Dispatch event so other components can update
            window.dispatchEvent(new CustomEvent('period-changed', {
                detail: {
                    startDate: new Date(viewDate.getFullYear(), viewDate.getMonth(), 1),
                    endDate: new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0)
                }
            }));
        }
        
        // Initial display
        updatePeriodDisplay();
        
        // Previous month button
        prevMonthBtn.addEventListener('click', () => {
            viewDate.setMonth(viewDate.getMonth() - 1);
            updatePeriodDisplay();
        });
        
        // Next month button
        nextMonthBtn.addEventListener('click', () => {
            viewDate.setMonth(viewDate.getMonth() + 1);
            updatePeriodDisplay();
        });
    }
    
    /**
     * Setup income form handling
     */
    function setupIncomeForm() {
        const incomeForm = document.getElementById('income-form');
        if (!incomeForm) return;
        
        incomeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = {
                date: document.getElementById('income-date').value,
                category: document.getElementById('income-category').value,
                description: document.getElementById('income-description').value,
                amount: parseFloat(document.getElementById('income-amount').value),
                notes: document.getElementById('income-notes').value
            };
            
            // Validate form data
            if (!formData.date || !formData.category || !formData.description || isNaN(formData.amount)) {
                window.CashBoard.showToast('Please fill out all required fields', 'error');
                return;
            }
            
            // Add income via data service
            DataService.addIncome(formData);
            
            // Show success message
            window.CashBoard.showToast('Income added successfully', 'success');
            
            // Reset form and close modal
            incomeForm.reset();
            document.getElementById('income-modal').classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    /**
     * Setup expense form handling
     */
    function setupExpenseForm() {
        const expenseForm = document.getElementById('expense-form');
        if (!expenseForm) return;
        
        // Handle receipt uploads
        const receiptInput = document.getElementById('expense-receipt');
        if (receiptInput) {
            receiptInput.addEventListener('change', handleReceiptUpload);
        }
        
        expenseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = {
                date: document.getElementById('expense-date').value,
                category: document.getElementById('expense-category').value,
                description: document.getElementById('expense-description').value,
                amount: parseFloat(document.getElementById('expense-amount').value),
                notes: document.getElementById('expense-notes').value,
                receipt: receiptInput ? receiptInput.dataset.receipt || null : null
            };
            
            // Validate form data
            if (!formData.date || !formData.category || !formData.description || isNaN(formData.amount)) {
                window.CashBoard.showToast('Please fill out all required fields', 'error');
                return;
            }
            
            // Add expense via data service
            DataService.addExpense(formData);
            
            // Show success message
            window.CashBoard.showToast('Expense added successfully', 'success');
            
            // Reset form and close modal
            expenseForm.reset();
            document.getElementById('expense-modal').classList.remove('active');
            document.body.style.overflow = '';
            
            // Clear receipt data
            if (receiptInput) {
                receiptInput.value = '';
                receiptInput.dataset.receipt = '';
            }
        });
    }
    
    /**
     * Handle receipt file uploads
     * @param {Event} e - Change event
     */
    function handleReceiptUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Check file size (limit to 2MB)
        if (file.size > 2 * 1024 * 1024) {
            window.CashBoard.showToast('Receipt file size exceeds 2MB limit', 'error');
            e.target.value = '';
            return;
        }
        
        // Check file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            window.CashBoard.showToast('Please select an image or PDF file', 'error');
            e.target.value = '';
            return;
        }
        
        // Convert to base64 for storage
        const reader = new FileReader();
        reader.onload = function(fileEvent) {
            const base64String = fileEvent.target.result;
            e.target.dataset.receipt = base64String;
        };
        reader.onerror = function() {
            window.CashBoard.showToast('Error processing receipt file', 'error');
        };
        reader.readAsDataURL(file);
    }
    
    /**
     * Setup search and filter functionality for tables
     */
    function setupTableFilters() {
        // Income table filter
        setupTableFilter('income-search', 'income-filter', 'income-table');
        
        // Expense table filter
        setupTableFilter('expense-search', 'expense-filter', 'expense-table');
    }
    
    /**
     * Setup filter for a specific table
     * @param {string} searchInputId - Search input element ID
     * @param {string} filterSelectId - Filter select element ID
     * @param {string} tableId - Table element ID
     */
    function setupTableFilter(searchInputId, filterSelectId, tableId) {
        const searchInput = document.getElementById(searchInputId);
        const filterSelect = document.getElementById(filterSelectId);
        const tableBody = document.querySelector(`#${tableId} tbody`);
        
        if (!searchInput || !filterSelect || !tableBody) return;
        
        // Function to filter table rows
        function filterTable() {
            const searchTerm = searchInput.value.toLowerCase();
            const filterValue = filterSelect.value;
            
            const rows = tableBody.querySelectorAll('tr');
            
            rows.forEach(row => {
                const category = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                const description = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
                
                // Check if row matches filter criteria
                const categoryMatch = filterValue === 'all' || category === filterValue;
                const searchMatch = !searchTerm || 
                    description.includes(searchTerm) || 
                    category.includes(searchTerm);
                
                // Show or hide row
                row.style.display = categoryMatch && searchMatch ? '' : 'none';
            });
        }
        
        // Attach event listeners
        searchInput.addEventListener('input', filterTable);
        filterSelect.addEventListener('change', filterTable);
    }
    
    /**
     * Populate a table with data
     * @param {string} tableId - Table element ID
     * @param {Array} data - Data array to populate table with
     * @param {Function} rowRenderer - Function to render each row
     */
    function populateTable(tableId, data, rowRenderer) {
        const tableBody = document.querySelector(`#${tableId} tbody`);
        if (!tableBody) return;
        
        // Clear existing rows
        tableBody.innerHTML = '';
        
        // Add data rows
        if (data.length === 0) {
            // No data message
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="5" class="empty-table-message">No data to display</td>
            `;
            tableBody.appendChild(emptyRow);
        } else {
            // Add each data row
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = rowRenderer(item);
                tableBody.appendChild(row);
            });
            
            // Attach event listeners for row actions
            attachRowActionListeners(tableBody);
        }
    }
    
    /**
     * Attach event listeners to table row action buttons
     * @param {HTMLElement} tableBody - Table body element
     */
    function attachRowActionListeners(tableBody) {
        // Edit buttons
        tableBody.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.dataset.id;
                const type = this.dataset.type; // 'income' or 'expense'
                
                if (type === 'income') {
                    editIncome(id);
                } else if (type === 'expense') {
                    editExpense(id);
                }
            });
        });
        
        // Delete buttons
        tableBody.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.dataset.id;
                const type = this.dataset.type; // 'income' or 'expense'
                
                // Confirm deletion
                if (confirm('Are you sure you want to delete this entry?')) {
                    if (type === 'income') {
                        DataService.deleteIncome(id);
                        window.CashBoard.showToast('Income entry deleted', 'success');
                    } else if (type === 'expense') {
                        DataService.deleteExpense(id);
                        window.CashBoard.showToast('Expense entry deleted', 'success');
                    }
                }
            });
        });
    }
    
    /**
     * Edit an income entry
     * @param {string} id - Income ID to edit
     */
    function editIncome(id) {
        // Get income data
        const incomeData = DataService.getAllIncome().find(income => income.id === id);
        if (!incomeData) return;
        
        // Fill form with data
        document.getElementById('income-date').value = incomeData.getFormattedDate();
        document.getElementById('income-category').value = incomeData.category;
        document.getElementById('income-description').value = incomeData.description;
        document.getElementById('income-amount').value = incomeData.amount;
        document.getElementById('income-notes').value = incomeData.notes || '';
        
        // Create hidden field for ID
        let idField = document.getElementById('income-id');
        if (!idField) {
            idField = document.createElement('input');
            idField.type = 'hidden';
            idField.id = 'income-id';
            document.getElementById('income-form').appendChild(idField);
        }
        idField.value = id;
        
        // Change form submit handler to update instead of add
        const incomeForm = document.getElementById('income-form');
        const originalSubmitHandler = incomeForm.onsubmit;
        
        incomeForm.onsubmit = function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = {
                date: document.getElementById('income-date').value,
                category: document.getElementById('income-category').value,
                description: document.getElementById('income-description').value,
                amount: parseFloat(document.getElementById('income-amount').value),
                notes: document.getElementById('income-notes').value
            };
            
            // Validate form data
            if (!formData.date || !formData.category || !formData.description || isNaN(formData.amount)) {
                window.CashBoard.showToast('Please fill out all required fields', 'error');
                return;
            }
            
            // Update income via data service
            DataService.updateIncome(id, formData);
            
            // Show success message
            window.CashBoard.showToast('Income updated successfully', 'success');
            
            // Reset form and close modal
            incomeForm.reset();
            document.getElementById('income-modal').classList.remove('active');
            document.body.style.overflow = '';
            
            // Restore original submit handler
            incomeForm.onsubmit = originalSubmitHandler;
        };
        
        // Show modal
        document.getElementById('income-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    /**
     * Edit an expense entry
     * @param {string} id - Expense ID to edit
     */
    function editExpense(id) {
        // Get expense data
        const expenseData = DataService.getAllExpenses().find(expense => expense.id === id);
        if (!expenseData) return;
        
        // Fill form with data
        document.getElementById('expense-date').value = expenseData.getFormattedDate();
        document.getElementById('expense-category').value = expenseData.category;
        document.getElementById('expense-description').value = expenseData.description;
        document.getElementById('expense-amount').value = expenseData.amount;
        document.getElementById('expense-notes').value = expenseData.notes || '';
        
        // Handle receipt if exists
        const receiptInput = document.getElementById('expense-receipt');
        if (receiptInput && expenseData.receipt) {
            receiptInput.dataset.receipt = expenseData.receipt;
            // Display receipt preview if it's an image
            if (expenseData.receipt.startsWith('data:image')) {
                // Create or update preview
                let previewContainer = document.getElementById('receipt-preview');
                if (!previewContainer) {
                    previewContainer = document.createElement('div');
                    previewContainer.id = 'receipt-preview';
                    previewContainer.className = 'receipt-preview';
                    receiptInput.parentNode.appendChild(previewContainer);
                }
                
                previewContainer.innerHTML = `
                    <img src="${expenseData.receipt}" alt="Receipt preview">
                    <button type="button" class="remove-receipt">×</button>
                `;
                
                // Add event listener to remove button
                previewContainer.querySelector('.remove-receipt').addEventListener('click', function() {
                    previewContainer.remove();
                    receiptInput.dataset.receipt = '';
                });
            }
        }
        
        // Create hidden field for ID
        let idField = document.getElementById('expense-id');
        if (!idField) {
            idField = document.createElement('input');
            idField.type = 'hidden';
            idField.id = 'expense-id';
            document.getElementById('expense-form').appendChild(idField);
        }
        idField.value = id;
        
        // Change form submit handler to update instead of add
        const expenseForm = document.getElementById('expense-form');
        const originalSubmitHandler = expenseForm.onsubmit;
        
        expenseForm.onsubmit = function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = {
                date: document.getElementById('expense-date').value,
                category: document.getElementById('expense-category').value,
                description: document.getElementById('expense-description').value,
                amount: parseFloat(document.getElementById('expense-amount').value),
                notes: document.getElementById('expense-notes').value,
                receipt: receiptInput ? receiptInput.dataset.receipt || null : null
            };
            
            // Validate form data
            if (!formData.date || !formData.category || !formData.description || isNaN(formData.amount)) {
                window.CashBoard.showToast('Please fill out all required fields', 'error');
                return;
            }
            
            // Update expense via data service
            DataService.updateExpense(id, formData);
            
            // Show success message
            window.CashBoard.showToast('Expense updated successfully', 'success');
            
            // Reset form and close modal
            expenseForm.reset();
            document.getElementById('expense-modal').classList.remove('active');
            document.body.style.overflow = '';
            
            // Remove receipt preview if exists
            const previewContainer = document.getElementById('receipt-preview');
            if (previewContainer) {
                previewContainer.remove();
            }
            
            // Restore original submit handler
            expenseForm.onsubmit = originalSubmitHandler;
        };
        
        // Show modal
        document.getElementById('expense-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    /**
     * Format a date object to a readable string
     * @param {Date|string} date - Date object or date string
     * @returns {string} Formatted date string
     */
    function formatDate(date) {
        const dateObj = date instanceof Date ? date : new Date(date);
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const year = dateObj.getFullYear();
        
        return `${day}/${month}/${year}`;
    }
    
    /**
     * Format currency amount based on user settings
     * @param {number} amount - Amount to format
     * @returns {string} Formatted currency string
     */
    function formatCurrency(amount) {
        const settings = StorageUtil.getData(StorageUtil.KEYS.SETTINGS, StorageUtil.DEFAULT_SETTINGS);
        const currencySymbol = settings.currencySymbol || '₹';
        
        return currencySymbol + amount.toFixed(2);
    }
    
    // Public API
    return {
        init,
        populateTable,
        formatDate,
        formatCurrency
    };
})();
