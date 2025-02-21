document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
  
    if (!userId) {
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
  
      const response = await fetch("/expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount, category, description }),
      });
  
      if (response.ok) {
        loadExpenses();
        form.reset();
      }
    });
  
    async function loadExpenses() {
      const response = await fetch(`/expenses/${userId}`);
      const expenses = await response.json();
      expenseList.innerHTML = expenses
        .map(expense => `
          <li>
            ${expense.category}: $${expense.amount} - ${expense.description}
            <button onclick="deleteExpense(${expense.id})">Delete</button>
          </li>
        `)
        .join("");
    }
  
    window.deleteExpense = async (expenseId) => {
      const response = await fetch(`/expense/${expenseId}`, { method: "DELETE" });
      if (response.ok) {
        loadExpenses();
      }
    };
  
    loadExpenses();
  });
  