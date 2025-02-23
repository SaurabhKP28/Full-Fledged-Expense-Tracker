document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

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

      const response = await fetch("/expense", {
          method: "POST",
          headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ amount, category, description })
      });

      if (response.ok) {
          loadExpenses();
          form.reset();
      }
  });

  async function loadExpenses() {
      const response = await fetch("/expenses", {
          headers: { "Authorization": `Bearer ${token}` }
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
      const response = await fetch(`/expense/${expenseId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
          loadExpenses();
      }
  };

  loadExpenses();
});
