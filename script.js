let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function addTransaction() {
  const desc = document.getElementById("desc").value;
  const amount = document.getElementById("amount").value;
  const date = document.getElementById("date").value;
  const type = document.getElementById("type").value;

  if (!desc || !amount || !date) {
    alert("Fill all fields");
    return;
  }

  const transaction = {
    id: Date.now(),
    desc,
    amount: parseFloat(amount),
    date,
    type
  };

  transactions.push(transaction);
  saveAndRender();

  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("date").value = "";
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  render();
}
function toggleDarkMode() {
  document.body.classList.toggle("dark");

  // save preference
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

// load theme on startup
(function () {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
})();

function render() {
  const list = document.getElementById("list");
  const balanceEl = document.getElementById("balance");

  list.innerHTML = "";
  let balance = 0;

  transactions.forEach(t => {
    const div = document.createElement("div");
    div.classList.add("transaction");

    if (t.type === "income") {
      balance += t.amount;
    } else {
      balance -= t.amount;
    }

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

// Load data on start
render();