// Check authentication
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '/login.html';
}

// DOM Elements
const expenseForm = document.getElementById('expense-form');
const expensesContainer = document.getElementById('expenses-container');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const leaderboard = document.getElementById('leaderboard');
const leaderboardContainer = document.getElementById('leaderboard-container');

// Load expenses
async function loadExpenses() {
    try {
        const response = await fetch('/expense', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch expenses');

        const expenses = await response.json();
        displayExpenses(expenses);
        loadLeaderboard(); // Refresh leaderboard when loading expenses
    } catch (error) {
        console.error('Error:', error);
    }
}

// Display expenses
function displayExpenses(expenses) {
    expensesContainer.innerHTML = expenses.map(expense => `
        <div class="expense-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #ddd;">
            <span><strong>${expense.category}</strong>: ${expense.description}</span>
            <span>₹${expense.amount}</span>
            <button class="delete-btn" onclick="deleteExpense(${expense.id})" style="margin-left: 10px;">Delete</button>
        </div>
    `).join('');
}


// Load leaderboard
async function loadLeaderboard() {
    try {
        const response = await fetch('/leaderboard', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch leaderboard');

        const leaderboardData = await response.json();
        localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData)); // Store in localStorage
        displayLeaderboard(leaderboardData);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Display leaderboard
function displayLeaderboard(data) {
    leaderboardContainer.innerHTML = data.map(user => `
        <li>Name - ${user.name} | Total Expense - ₹${user.totalExpense} ${user.isPremium ? '<span class="premium-badge">⭐ Premium</span>' : ''}</li>
    `).join('');
        
}

// Add expense
expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const expenseData = {
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value,
        description: document.getElementById('description').value
    };

    try {
        const response = await fetch('/expense', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(expenseData)
        });

        if (!response.ok) throw new Error('Failed to add expense');

        expenseForm.reset();
        loadExpenses();  // Refresh expenses and leaderboard
    } catch (error) {
        console.error('Error:', error);
    }
});

// Delete expense
async function deleteExpense(id) {
    try {
        const response = await fetch(`/expense/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to delete expense');

        loadExpenses();  // Refresh expenses and leaderboard
    } catch (error) {
        console.error('Error:', error);
    }
}

// Toggle leaderboard
leaderboardBtn.addEventListener('click', async () => {
    const isHidden = leaderboard.style.display === 'none';
    leaderboard.style.display = isHidden ? 'block' : 'none';

    if (isHidden) {
        const storedLeaderboard = localStorage.getItem('leaderboardData');
        if (storedLeaderboard) {
            displayLeaderboard(JSON.parse(storedLeaderboard)); // Use stored data first
        }
        loadLeaderboard(); // Fetch fresh data
    }
});

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('leaderboardData'); // Clear leaderboard data on logout
    window.location.href = '/login.html';
}

// Initial load
loadExpenses();
loadLeaderboard(); // Ensure leaderboard loads on page refresh
