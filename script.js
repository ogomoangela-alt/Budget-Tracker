let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function addTransaction() {
  const desc = document.getElementById("desc").value;
  const amount = document.getElementById("amount").value;
  const type = document.getElementById("type").value;

  if (!desc || !amount) {
    alert("Fill all fields");
    return;
  }

  const transaction = {
    id: Date.now(),
    desc,
    amount: parseFloat(amount),
    type
  };

  transactions.push(transaction);
  saveAndRender();

  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  render();
}

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
      div.innerHTML = `
        <span>${t.desc}</span>
        <span class="income">+${t.amount}</span>
        <button onclick="deleteTransaction(${t.id})">X</button>
      `;
    } else {
      balance -= t.amount;
      div.innerHTML = `
        <span>${t.desc}</span>
        <span class="expense">-${t.amount}</span>
        <button onclick="deleteTransaction(${t.id})">X</button>
      `;
    }

    list.appendChild(div);
  });

  balanceEl.innerText = balance;
}

// Load data on start
render();
