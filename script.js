let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

/* =========================
   ADD TRANSACTION
========================= */
function addTransaction() {
  const desc = document.getElementById("desc")?.value;
  const amount = document.getElementById("amount")?.value;
  const date = document.getElementById("date")?.value;
  const type = document.getElementById("type")?.value;
  const categoryInput = document.getElementById("category");

  const category = categoryInput ? categoryInput.value.trim() : "";

  if (!desc || !amount || !date) {
    alert("Fill all fields");
    return;
  }

  if (!category) {
    alert("Please enter a category");
    return;
  }

  const transaction = {
    id: Date.now(),
    desc,
    amount: parseFloat(amount),
    date,
    type,
    category
  };

  transactions.push(transaction);
  saveAndRender();

  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("date").value = "";

  if (categoryInput) categoryInput.value = "";
}

/* =========================
   DELETE
========================= */
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveAndRender();
}

/* =========================
   SAVE + RENDER
========================= */
function saveAndRender() {
  localStorage.setItem("transactions", JSON.stringify(transactions));

  if (document.getElementById("list")) render();
  if (document.getElementById("categoryList")) renderCategories();

  if (typeof updateChart === "function") updateChart();
  if (typeof updateMonthlyChart === "function") updateMonthlyChart();
}

/* =========================
   MAIN RENDER
========================= */
function render() {
  const list = document.getElementById("list");
  const balanceEl = document.getElementById("balance");

  if (!list || !balanceEl) return;

  list.innerHTML = "";
  let balance = 0;

  transactions.forEach(t => {
    const div = document.createElement("div");
    div.classList.add("transaction");

    if (t.type === "income") balance += t.amount;
    else balance -= t.amount;

    div.innerHTML = `
      <span>
        ${t.desc} <br>
        <small>${t.date}</small>
      </span>

      <span class="${t.type}">
        ${t.type === "income" ? "+" : "-"}${t.amount}
      </span>

      <button onclick="deleteTransaction(${t.id})">X</button>
    `;

    list.appendChild(div);
  });

  balanceEl.innerText = balance;
}

/* =========================
   CATEGORY RENDER
========================= */
function renderCategories() {
  const container = document.getElementById("categoryList");
  if (!container) return;

  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  let categoryTotals = {};

  transactions.forEach(t => {
    if (t.type === "expense") {
      const cat = (t.category || "Uncategorized").trim();

      categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount;
    }
  });

  container.innerHTML = "";

  const keys = Object.keys(categoryTotals);

  if (keys.length === 0) {
    container.innerHTML = "<p>No expenses yet.</p>";
    return;
  }

  keys.forEach(cat => {
    const div = document.createElement("div");
    div.classList.add("transaction");

    div.innerHTML = `
      <span>${cat}</span>
      <span class="expense">-${categoryTotals[cat]}</span>
    `;

    container.appendChild(div);
  });
}

/* =========================
   DARK MODE
========================= */
function toggleDarkMode() {
  document.body.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}

(function () {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
})();

/* =========================
   SAFE INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("list")) render();
  if (document.getElementById("categoryList")) renderCategories();

  if (typeof updateChart === "function" && document.getElementById("myChart")) {
    updateChart();
  }

  if (typeof updateMonthlyChart === "function" && document.getElementById("monthlyChart")) {
    updateMonthlyChart();
  }
});