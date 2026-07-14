const API = "https://btcedge-3.onrender.com/api/dashboard";

const priceEl = document.getElementById("price");
const buyEl = document.getElementById("buy");
const sellEl = document.getElementById("sell");
const deltaEl = document.getElementById("delta");

async function update() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    priceEl.textContent = "$" + Number(data.price).toFixed(2);

    buyEl.textContent =
      "$" + Number(data.m1.buy).toLocaleString();

    sellEl.textContent =
      "$" + Number(data.m1.sell).toLocaleString();

    deltaEl.textContent =
      "$" + Number(data.m1.delta).toLocaleString();

  } catch (err) {
    console.error(err);
  }
}

update();
setInterval(update, 1000);
