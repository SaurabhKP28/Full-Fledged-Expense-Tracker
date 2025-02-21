document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/login.html";
        return;
    }

    const form = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const amount = form.amount.value;
        const category = form.category.value;
        const description = form.description.value;

        await fetch("/expense", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            body: JSON.stringify({ amount, category, description }),
        });

        loadExpenses();
        form.reset();
    });

    async function loadExpenses() {
        const response = await fetch("/expenses", {
            headers: { "Authorization": token },
        });
        const expenses = await response.json();
        expenseList.innerHTML = expenses.map(expense => `
            <li>
                ${expense.category}: $${expense.amount} - ${expense.description}
                <button onclick="deleteExpense(${expense.id})">Delete</button>
            </li>
        `).join("");
    }

    window.deleteExpense = async (expenseId) => {
        await fetch(`/expense/${expenseId}`, {
            method: "DELETE",
            headers: { "Authorization": token },
        });
        loadExpenses();
    };

    loadExpenses();
});
